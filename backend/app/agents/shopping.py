"""
Shopping Agent for Product Discovery & Conversational Recommendation.
Powered by Groq LLM with deterministic semantic catalog fallback.
"""

import os
import json
import re
from typing import List, Dict, Any, Optional
import httpx

from app.config import settings
from app.models import Product, CartItem, ChatRequest, ChatResponse
from app.catalog import PRODUCTS, CATALOG_LOOKUP, search_catalog

SYSTEM_PROMPT = """You are an intelligent, helpful, and concise Agentic E-Commerce Shopping Assistant.
Your mission is to help shoppers discover high-quality products, answer questions about specifications, and guide them to a seamless checkout.

Strict Rules & Guardrails:
1. Recommend ONLY items from the provided catalog. Never hallucinate products, specs, or prices.
2. Prices are in Indian Rupees (INR ₹).
3. The platform enforces a strict ₹10,000 maximum spend-cap per checkout transaction.
4. Keep replies conversational, concise, friendly, and structured.
5. In your response, if you recommend products, mention their names and prices clearly.
"""

GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "llama-3.3-70b-versatile"


def extract_budget(text: str) -> Optional[float]:
    """Extracts budget limit if present (e.g. 'under 3000', 'below ₹4000', 'less than 2500')."""
    match = re.search(r'(?:under|below|less than|max(?:imum)?|within)\s*(?:rs\.?|inr|₹)?\s*(\d+(?:,\d+)*)', text, re.I)
    if match:
        try:
            return float(match.group(1).replace(",", ""))
        except ValueError:
            return None
    return None


async def process_shopping_chat(req: ChatRequest) -> ChatResponse:
    """Processes shopper query through Groq LLM with deterministic fallback."""
    user_msg = req.message.strip()
    budget = extract_budget(user_msg)

    # 1. Search matching products from canonical catalog
    matched_products = search_catalog(query=user_msg, max_price=budget)
    if not matched_products and budget:
        # Fallback to general search within budget
        matched_products = search_catalog(max_price=budget)
    if not matched_products:
        # Default trending items
        matched_products = [p for p in PRODUCTS if p.in_stock][:3]

    selected_recommendations = matched_products[:3]

    # 2. Attempt Groq LLM generation if API key is provided
    groq_key = settings.GROQ_API_KEY.strip() if settings.GROQ_API_KEY else os.getenv("GROQ_API_KEY", "").strip()

    if groq_key:
        catalog_summary = "\n".join([
            f"- {p.name} (ID: {p.id}) | Category: {p.category} | Price: ₹{p.price:.2f} | In Stock: {p.in_stock} | Rating: {p.rating}★: {p.description}"
            for p in selected_recommendations
        ])

        messages = [
            {"role": "system", "content": f"{SYSTEM_PROMPT}\nAvailable Catalog Options:\n{catalog_summary}"},
            {"role": "user", "content": user_msg}
        ]

        try:
            timeout_cfg = httpx.Timeout(4.0, connect=2.0)
            async with httpx.AsyncClient(timeout=timeout_cfg) as client:
                res = await client.post(
                    GROQ_ENDPOINT,
                    headers={
                        "Authorization": f"Bearer {groq_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": GROQ_MODEL,
                        "messages": messages,
                        "temperature": 0.5,
                        "max_tokens": 350
                    }
                )
                if res.status_code == 200:
                    data = res.json()
                    ai_text = data["choices"][0]["message"]["content"].strip()
                    return ChatResponse(
                        reply=ai_text,
                        recommended_products=selected_recommendations,
                        action="recommend",
                        suggested_prompts=[
                            "Add to cart",
                            "Show items under ₹2,000",
                            "Proceed to checkout"
                        ]
                    )
        except Exception as e:
            print(f"[Shopping Agent] Groq call fallback: {e}")

    # 3. Deterministic Fallback if Groq offline or unavailable
    reply_lines = []
    if selected_recommendations:
        reply_lines.append(f"I found {len(selected_recommendations)} great option(s) for you in our catalog:")
        for p in selected_recommendations:
            reply_lines.append(f"• **{p.name}** — ₹{p.price:,.2f} ({p.category}) — {p.description}")
        reply_lines.append("\nYou can add any item directly to your cart or review checkout!")
    else:
        reply_lines.append("I couldn't find an exact match, but here are our top-rated essentials below the ₹10,000 spend-cap limit:")

    return ChatResponse(
        reply="\n".join(reply_lines),
        recommended_products=selected_recommendations,
        action="recommend",
        suggested_prompts=[
            "Show wireless headphones",
            "Best accessories under ₹2,000",
            "Review cart & checkout"
        ]
    )
