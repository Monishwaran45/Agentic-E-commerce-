"""
Guardrails Engine for Agentic E-Commerce & Checkout Agent.
Enforces deterministic financial safety checks, spend limits, inventory locks, and session bounds.
"""

from typing import List, Dict, Tuple, Any
from fastapi import HTTPException, status
from app.models import CartItem, Product

SHOPPING_MAX_SPEND_CAP_INR = 10000.0  # ₹10,000 max spend cap per transaction
MAX_ORDERS_PER_SESSION = 5


class GuardrailViolation(HTTPException):
    def __init__(self, code: str, message: str, status_code: int = status.HTTP_400_BAD_REQUEST):
        super().__init__(status_code=status_code, detail={"code": code, "message": message})


class GuardrailEngine:
    def __init__(self):
        self.session_order_counts: Dict[str, int] = {}

    def validate_cart(self, items: List[CartItem], catalog_lookup: Dict[str, Product]) -> Tuple[bool, float]:
        """
        Validates cart against:
        1. Non-empty items.
        2. Catalog existence & stock availability.
        3. Unit price consistency (prevents price injection/tampering).
        4. Hard ₹10,000 spend-cap limit.
        """
        if not items:
            raise GuardrailViolation("EMPTY_CART", "Cannot checkout with an empty cart")

        calculated_total = 0.0

        for item in items:
            product = catalog_lookup.get(item.product_id)
            if not product:
                raise GuardrailViolation(
                    "CATALOG_MISMATCH",
                    f"Product '{item.product_id}' does not exist in canonical catalog"
                )

            if not product.in_stock or product.stock_count < item.quantity:
                raise GuardrailViolation(
                    "OUT_OF_STOCK",
                    f"Product '{product.name}' is out of stock (available: {product.stock_count})"
                )

            # Invariant: Prices must match canonical catalog, never client-tampered
            if abs(item.unit_price - product.price) > 0.01:
                raise GuardrailViolation(
                    "PRICE_TAMPERING",
                    f"Tampered price detected for '{product.name}': expected ₹{product.price:.2f}, got ₹{item.unit_price:.2f}"
                )

            calculated_total += product.price * item.quantity

        # Enforce ₹10,000 spend-cap guardrail
        if calculated_total > SHOPPING_MAX_SPEND_CAP_INR:
            raise GuardrailViolation(
                "SPEND_CAP_EXCEEDED",
                f"Cart total ₹{calculated_total:,.2f} exceeds strict guardrail spend cap of ₹{SHOPPING_MAX_SPEND_CAP_INR:,.2f}"
            )

        return True, round(calculated_total, 2)

    def validate_session_limits(self, session_id: str):
        """Enforces max 5 orders per shopper session."""
        count = self.session_order_counts.get(session_id, 0)
        if count >= MAX_ORDERS_PER_SESSION:
            raise GuardrailViolation(
                "SESSION_LIMIT_EXCEEDED",
                f"Shopper session limit reached ({MAX_ORDERS_PER_SESSION} orders max per session)",
                status_code=status.HTTP_429_TOO_MANY_REQUESTS
            )

    def record_session_order(self, session_id: str):
        self.session_order_counts[session_id] = self.session_order_counts.get(session_id, 0) + 1


guardrail_engine = GuardrailEngine()

