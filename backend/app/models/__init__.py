from pydantic import BaseModel, Field
from typing import List, Optional


class Product(BaseModel):
    id: str
    name: str
    description: str
    price: float
    category: str
    in_stock: bool = True


class CartItem(BaseModel):
    product_id: str
    quantity: int = Field(default=1, ge=1)
    unit_price: float


class CheckoutSession(BaseModel):
    session_id: str
    items: List[CartItem]
    total_amount: float
    status: str = "pending"
