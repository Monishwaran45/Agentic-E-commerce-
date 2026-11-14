"""
Canonical Product Catalog for Agentic E-Commerce.
Prices are in INR (₹) strictly enforced below the ₹10,000 spend-cap.
"""

from typing import List, Dict, Optional
from app.models import Product

CATALOG_ITEMS: List[Dict] = [
    {
        "id": "prod_audio_01",
        "name": "AcousticPro ANC Wireless Headphones",
        "description": "Hybrid active noise cancellation, 40hr battery life, ultra-plush memory foam earcups.",
        "price": 4499.0,
        "category": "Audio",
        "in_stock": True,
        "stock_count": 18,
        "rating": 4.8,
        "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
        "tags": ["headphones", "anc", "wireless", "audio", "bluetooth", "noise cancelling"]
    },
    {
        "id": "prod_audio_02",
        "name": "SonicBuds True Wireless Earbuds",
        "description": "IPX7 waterproof, low-latency gaming mode, crystal clear 4-mic ENC calls.",
        "price": 1999.0,
        "category": "Audio",
        "in_stock": True,
        "stock_count": 35,
        "rating": 4.6,
        "image_url": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80",
        "tags": ["earbuds", "tws", "earphones", "wireless", "audio", "sports"]
    },
    {
        "id": "prod_wear_01",
        "name": "Chronos Pulse Smartwatch",
        "description": "1.43\" AMOLED always-on display, 24/7 SpO2 & heart monitor, titanium alloy bezel.",
        "price": 3899.0,
        "category": "Wearables",
        "in_stock": True,
        "stock_count": 12,
        "rating": 4.7,
        "image_url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
        "tags": ["smartwatch", "watch", "fitness", "tracker", "health", "amoled"]
    },
    {
        "id": "prod_acc_01",
        "name": "VoltFast 65W GaN Dual Charger",
        "description": "Ultra-compact Gallium Nitride fast charger for laptops, phones, and tablets.",
        "price": 1499.0,
        "category": "Accessories",
        "in_stock": True,
        "stock_count": 45,
        "rating": 4.9,
        "image_url": "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&q=80",
        "tags": ["charger", "gan", "fast charging", "type-c", "adapter", "power"]
    },
    {
        "id": "prod_acc_02",
        "name": "AeroDesk Ergonomic Aluminum Laptop Stand",
        "description": "Adjustable 6-level height elevator with heat dissipation airflow cutout.",
        "price": 1299.0,
        "category": "Accessories",
        "in_stock": True,
        "stock_count": 22,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80",
        "tags": ["stand", "laptop stand", "desk", "ergonomic", "accessories", "aluminum"]
    },
    {
        "id": "prod_periph_01",
        "name": "KeyCraft RGB Mechanical Keyboard",
        "description": "Hot-swappable tactile brown switches, aircraft-grade aluminum top frame.",
        "price": 4999.0,
        "category": "Peripherals",
        "in_stock": True,
        "stock_count": 9,
        "rating": 4.8,
        "image_url": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80",
        "tags": ["keyboard", "mechanical", "gaming", "rgb", "switches", "peripherals"]
    },
    {
        "id": "prod_periph_02",
        "name": "PrecisionGlide Wireless Ergonomic Mouse",
        "description": "High-precision 4000 DPI optical sensor, whisper-quiet clicks, dual Bluetooth + 2.4G.",
        "price": 1799.0,
        "category": "Peripherals",
        "in_stock": True,
        "stock_count": 30,
        "rating": 4.6,
        "image_url": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&q=80",
        "tags": ["mouse", "wireless", "ergonomic", "office", "quiet", "bluetooth"]
    },
    {
        "id": "prod_acc_03",
        "name": "MagPower 10,000mAh Magnetic Power Bank",
        "description": "Snap-on magnetic wireless charging with 20W PD Type-C fast output.",
        "price": 2499.0,
        "category": "Accessories",
        "in_stock": True,
        "stock_count": 15,
        "rating": 4.7,
        "image_url": "https://images.unsplash.com/photo-1609592424361-b452e859b964?w=500&q=80",
        "tags": ["power bank", "battery", "wireless", "magnetic", "portable", "travel"]
    },
    {
        "id": "prod_home_01",
        "name": "BaristaPro Precision Coffee Scale",
        "description": "0.1g accuracy, integrated brewing flow-rate timer, USB-C rechargeable battery.",
        "price": 2199.0,
        "category": "Lifestyle",
        "in_stock": True,
        "stock_count": 14,
        "rating": 4.9,
        "image_url": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&q=80",
        "tags": ["coffee", "scale", "brewing", "barista", "kitchen", "precision"]
    },
    {
        "id": "prod_rare_01",
        "name": "UltraLimited Studio Monitor Speakers",
        "description": "Reference-grade studio nearfield monitors with Kevlar cones. Currently out of stock.",
        "price": 8999.0,
        "category": "Audio",
        "in_stock": False,
        "stock_count": 0,
        "rating": 4.9,
        "image_url": "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&q=80",
        "tags": ["speakers", "studio", "audio", "monitors", "professional"]
    }
]

PRODUCTS: List[Product] = [Product(**item) for item in CATALOG_ITEMS]
CATALOG_LOOKUP: Dict[str, Product] = {p.id: p for p in PRODUCTS}


def search_catalog(
    query: str = "",
    category: Optional[str] = None,
    max_price: Optional[float] = None,
    in_stock_only: bool = False
) -> List[Product]:
    """Semantic and keyword catalog filtering."""
    results = PRODUCTS

    if category:
        results = [p for p in results if p.category.lower() == category.lower()]

    if max_price is not None:
        results = [p for p in results if p.price <= max_price]

    if in_stock_only:
        results = [p for p in results if p.in_stock]

    if query and query.strip():
        q_tokens = query.lower().split()
        matched = []
        for p in results:
            text = f"{p.name} {p.description} {p.category} {' '.join(p.tags)}".lower()
            score = sum(1 for token in q_tokens if token in text)
            if score > 0:
                matched.append((score, p))
        matched.sort(key=lambda x: x[0], reverse=True)
        return [p for score, p in matched]

    return results

