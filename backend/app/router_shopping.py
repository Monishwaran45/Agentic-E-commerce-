"""
Shopping & Checkout API Router for Agentic E-Commerce.
Provides product discovery, LLM agent chat, guardrail-checked orders, and Razorpay HMAC verification.
"""

from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Query, status

from app.models import (
    Product,
    ChatRequest,
    ChatResponse,
    CreateOrderRequest,
    VerifyPaymentRequest,
)
from app.catalog import PRODUCTS, CATALOG_LOOKUP, search_catalog
from app.agents.shopping import process_shopping_chat
from app.agents.checkout import (
    create_shopping_order,
    verify_shopping_payment,
    get_shopping_order,
    list_shopping_orders,
)

router = APIRouter(tags=["shopping_and_checkout"])


@router.get("/api/products", response_model=List[Product])
def get_products(
    query: Optional[str] = None,
    category: Optional[str] = None,
    max_price: Optional[float] = None,
    in_stock_only: bool = False,
):
    """Lists products from canonical catalog with filtering."""
    return search_catalog(query, category, max_price, in_stock_only)


@router.get("/api/products/{product_id}", response_model=Product)
def get_product_details(product_id: str):
    """Returns details for a specific product."""
    product = CATALOG_LOOKUP.get(product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "PRODUCT_NOT_FOUND", "message": f"Product '{product_id}' not found"}
        )
    return product


@router.post("/api/chat", response_model=ChatResponse)
async def shopping_agent_chat(req: ChatRequest):
    """Conversational Shopping Agent driven by Groq LLM with catalog grounding."""
    return await process_shopping_chat(req)


@router.post("/api/checkout/create-order", status_code=status.HTTP_201_CREATED)
def checkout_create_order(req: CreateOrderRequest):
    """
    Enforces guardrails: stock check, price integrity, ₹10,000 spend-cap, session limit.
    Creates a Razorpay test order.
    """
    return create_shopping_order(req)


@router.post("/api/verify-payment")
def checkout_verify_payment(req: VerifyPaymentRequest):
    """
    Server-side Razorpay HMAC SHA256 payment signature verification.
    """
    return verify_shopping_payment(req)


@router.get("/api/orders/{order_id}")
def get_order_by_id(order_id: str):
    """Retrieves order and payment verification receipt."""
    return get_shopping_order(order_id)


@router.get("/api/orders")
def get_all_orders(session_id: Optional[str] = Query(None)):
    """Lists completed or pending orders."""
    return list_shopping_orders(session_id)

