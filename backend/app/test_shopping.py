"""
Unit and Integration Test Suite for Shopping Agent, Checkout Agent, and Guardrails.
"""

import pytest
import hmac
import hashlib
from fastapi import HTTPException

from app.models import CartItem, CreateOrderRequest, VerifyPaymentRequest, ChatRequest
from app.catalog import PRODUCTS, CATALOG_LOOKUP, search_catalog
from app.guardrails import guardrail_engine, SHOPPING_MAX_SPEND_CAP_INR
from app.agents.checkout import (
    create_shopping_order,
    verify_shopping_payment,
    _SHOPPING_ORDERS,
    _RZP_SHOPPING_MAP,
    RAZORPAY_KEY_SECRET,
)
from app.agents.shopping import process_shopping_chat


@pytest.fixture(autouse=True)
def reset_state():
    _SHOPPING_ORDERS.clear()
    _RZP_SHOPPING_MAP.clear()
    guardrail_engine.session_order_counts.clear()
    yield
    _SHOPPING_ORDERS.clear()
    _RZP_SHOPPING_MAP.clear()
    guardrail_engine.session_order_counts.clear()


def test_catalog_search():
    headphones = search_catalog(query="headphones")
    assert len(headphones) >= 1
    assert any("AcousticPro" in p.name for p in headphones)

    under_2k = search_catalog(max_price=2000.0)
    assert all(p.price <= 2000.0 for p in under_2k)


def test_valid_checkout_order_creation():
    item = CartItem(
        product_id="prod_audio_02",
        name="SonicBuds True Wireless Earbuds",
        quantity=1,
        unit_price=1999.0
    )
    req = CreateOrderRequest(session_id="test_sess_01", items=[item])
    order = create_shopping_order(req)

    assert order["status"] == "pending"
    assert order["amount"] == 1999.0
    assert order["amount_minor"] == 199900
    assert order["currency"] == "INR"
    assert "order_id" in order
    assert "razorpay_order_id" in order


def test_spend_cap_guardrail_rejection():
    # Attempting to order 3 units of AcousticPro (3 * 4499 = 13,497 > 10,000)
    item = CartItem(
        product_id="prod_audio_01",
        quantity=3,
        unit_price=4499.0
    )
    req = CreateOrderRequest(session_id="test_sess_02", items=[item])

    with pytest.raises(HTTPException) as exc:
        create_shopping_order(req)
    assert exc.value.status_code == 400
    assert exc.value.detail["code"] == "SPEND_CAP_EXCEEDED"


def test_out_of_stock_guardrail():
    # prod_rare_01 has in_stock=False, stock_count=0
    item = CartItem(
        product_id="prod_rare_01",
        quantity=1,
        unit_price=8999.0
    )
    req = CreateOrderRequest(session_id="test_sess_03", items=[item])

    with pytest.raises(HTTPException) as exc:
        create_shopping_order(req)
    assert exc.value.status_code == 400
    assert exc.value.detail["code"] == "OUT_OF_STOCK"


def test_price_tampering_guardrail():
    # prod_acc_01 real price is 1499.0, user attempts 10.0
    item = CartItem(
        product_id="prod_acc_01",
        quantity=1,
        unit_price=10.0
    )
    req = CreateOrderRequest(session_id="test_sess_04", items=[item])

    with pytest.raises(HTTPException) as exc:
        create_shopping_order(req)
    assert exc.value.status_code == 400
    assert exc.value.detail["code"] == "PRICE_TAMPERING"


def test_session_order_limit():
    sess_id = "test_sess_high_volume"
    item = CartItem(
        product_id="prod_acc_02",
        quantity=1,
        unit_price=1299.0
    )
    req = CreateOrderRequest(session_id=sess_id, items=[item])

    # First 5 orders succeed
    for _ in range(5):
        create_shopping_order(req)

    # 6th order fails with SESSION_LIMIT_EXCEEDED (429)
    with pytest.raises(HTTPException) as exc:
        create_shopping_order(req)
    assert exc.value.status_code == 429
    assert exc.value.detail["code"] == "SESSION_LIMIT_EXCEEDED"


def test_payment_verification_hmac():
    item = CartItem(
        product_id="prod_acc_01",
        quantity=1,
        unit_price=1499.0
    )
    order = create_shopping_order(CreateOrderRequest(session_id="test_sess_pay", items=[item]))
    rzp_order_id = order["razorpay_order_id"]
    payment_id = "pay_test_998877"

    # 1. Compute valid HMAC signature
    message = f"{rzp_order_id}|{payment_id}".encode("utf-8")
    valid_sig = hmac.new(RAZORPAY_KEY_SECRET.encode("utf-8"), message, hashlib.sha256).hexdigest()

    res = verify_shopping_payment(VerifyPaymentRequest(
        razorpay_order_id=rzp_order_id,
        razorpay_payment_id=payment_id,
        razorpay_signature=valid_sig
    ))
    assert res["status"] == "success"
    assert res["verified"] is True
    assert _SHOPPING_ORDERS[order["order_id"]]["status"] == "paid"

    # 2. Forged signature fails
    with pytest.raises(HTTPException) as exc:
        verify_shopping_payment(VerifyPaymentRequest(
            razorpay_order_id=rzp_order_id,
            razorpay_payment_id=payment_id,
            razorpay_signature="forged_signature_xyz"
        ))
    assert exc.value.status_code == 400
    assert exc.value.detail["code"] == "INVALID_SIGNATURE"


@pytest.mark.anyio
async def test_shopping_chat_agent():
    req = ChatRequest(message="Looking for wireless headphones under 5000", session_id="chat_test_1")
    resp = await process_shopping_chat(req)
    assert resp.recommended_products
    assert any("AcousticPro" in p.name for p in resp.recommended_products)
    assert resp.action == "recommend"

