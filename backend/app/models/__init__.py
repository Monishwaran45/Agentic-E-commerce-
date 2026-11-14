from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any


class Product(BaseModel):
    id: str
    name: str
    description: str
    price: float  # In INR (₹)
    category: str
    in_stock: bool = True
    stock_count: int = 25
    rating: float = 4.5
    image_url: Optional[str] = None
    tags: List[str] = Field(default_factory=list)


class CartItem(BaseModel):
    product_id: str
    name: Optional[str] = None
    quantity: int = Field(default=1, ge=1)
    unit_price: float
    image_url: Optional[str] = None


class CheckoutSession(BaseModel):
    session_id: str
    items: List[CartItem]
    total_amount: float
    status: str = "pending"  # pending | processing | paid | failed


class CreateOrderRequest(BaseModel):
    session_id: str
    items: List[CartItem]
    customer_name: Optional[str] = "Demo Shopper"
    customer_email: Optional[str] = "shopper@example.com"
    customer_phone: Optional[str] = "9999999999"


class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    session_id: Optional[str] = None


class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = "default-session"
    cart_items: Optional[List[CartItem]] = Field(default_factory=list)


class ChatResponse(BaseModel):
    reply: str
    recommended_products: List[Product] = Field(default_factory=list)
    action: Optional[str] = None  # browse | recommend | add_to_cart | review_checkout
    suggested_prompts: List[str] = Field(default_factory=list)
