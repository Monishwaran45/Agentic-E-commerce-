"""
PayPal Disputes Router for Unified Vasool Operations Edge.
Allows viewing, redrafting, approving, and conceding PayPal disputes
directly from localhost:8000.
"""

import os
import json
import time
from typing import Dict, Any, Optional, List
from fastapi import APIRouter, HTTPException, Header, status
from pydantic import BaseModel

router = APIRouter(tags=["paypal_disputes"])

DISPUTES_FILE = os.path.join(os.path.dirname(__file__), "local_disputes.json")

_DISPUTES_DB: Dict[str, Dict[str, Any]] = {}

def load_disputes():
    global _DISPUTES_DB
    if os.path.exists(DISPUTES_FILE):
        try:
            with open(DISPUTES_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                for item in data:
                    dispute_id = item.get("id") or item.get("dispute_id")
                    if dispute_id:
                        _DISPUTES_DB[dispute_id] = item
        except Exception as e:
            print(f"[Disputes] Load error: {e}")
    if not _DISPUTES_DB:
        # Default seed dispute
        _DISPUTES_DB["PP-D-1094821"] = {
            "id": "PP-D-1094821",
            "dispute_id": "PP-D-1094821",
            "status": "WAITING_FOR_SELLER_RESPONSE",
            "dispute_amount": {"currency": "USD", "value": "849.50"},
            "reason": "MERCHANDISE_OR_SERVICE_NOT_RECEIVED",
            "seller_response_due_date": "2026-11-20T18:00:00Z",
            "order_id": "ORD-99321",
            "transaction_id": "TRX-71049281A",
            "buyer": {
                "name": "Marcus Vance",
                "email": "m.vance@example.com",
                "shipping_address": {
                    "line1": "742 Evergreen Terrace",
                    "city": "Springfield",
                    "state": "OR",
                    "postal_code": "97477",
                    "country_code": "US"
                }
            },
            "carrier_proof": {
                "carrier": "UPS Ground",
                "tracking_number": "1Z9999999999999999",
                "status": "DELIVERED",
                "delivery_date": "2026-11-10T14:22:00Z",
                "signed_by": "M. VANCE",
                "has_signature": True,
                "carrier_verified": True,
                "kernel_audit_id": "KERNEL-CERT-9921",
                "delivery_address_verified": True
            },
            "evidence_draft": {
                "text": "The ordered item was fulfilled via UPS Ground (Tracking: 1Z9999999999999999) and confirmed delivered on November 10, 2026 with recipient signature 'M. VANCE'. Per PayPal Seller Protection Policy Section 11.2, seller liability is discharged.",
                "proofs": []
            },
            "seller_approval": {"approved": False, "conceded": False}
        }

load_disputes()

def save_disputes():
    try:
        with open(DISPUTES_FILE, "w", encoding="utf-8") as f:
            json.dump(list(_DISPUTES_DB.values()), f, indent=2)
    except Exception as e:
        print(f"[Disputes] Save error: {e}")


class EvidenceUpdateRequest(BaseModel):
    evidence_text: str

class ApproveRequest(BaseModel):
    approver_id: Optional[str] = "Authorized Seller Representative"
    approval_secret: Optional[str] = None
    note: Optional[str] = None

class RejectRequest(BaseModel):
    reason: Optional[str] = "Seller accepted claim liability"


@router.get("/api/disputes")
@router.get("/disputes")
def get_disputes(status: Optional[str] = None):
    items = list(_DISPUTES_DB.values())
    if status:
        items = [d for d in items if d.get("status") == status]
    return {"success": True, "count": len(items), "disputes": items}


@router.get("/api/disputes/{dispute_id}")
@router.get("/disputes/{dispute_id}")
def get_dispute_by_id(dispute_id: str):
    dispute = _DISPUTES_DB.get(dispute_id)
    if not dispute:
        raise HTTPException(status_code=404, detail=f"Dispute '{dispute_id}' not found")
    return {"success": True, "dispute": dispute}


@router.post("/api/disputes/{dispute_id}/evidence")
@router.post("/disputes/{dispute_id}/evidence")
def update_dispute_evidence(dispute_id: str, req: EvidenceUpdateRequest):
    dispute = _DISPUTES_DB.get(dispute_id)
    if not dispute:
        raise HTTPException(status_code=404, detail="Dispute not found")
    if "evidence_draft" not in dispute or not isinstance(dispute["evidence_draft"], dict):
        dispute["evidence_draft"] = {}
    dispute["evidence_draft"]["text"] = req.evidence_text
    dispute["ai_drafted_evidence"] = req.evidence_text
    save_disputes()
    return {"success": True, "dispute": dispute}


@router.post("/api/disputes/{dispute_id}/redraft")
@router.post("/disputes/{dispute_id}/redraft")
def redraft_dispute(dispute_id: str):
    dispute = _DISPUTES_DB.get(dispute_id)
    if not dispute:
        raise HTTPException(status_code=404, detail="Dispute not found")
    tracking = dispute.get("carrier_proof", {}).get("tracking_number", "1Z9999999999999999")
    signed = dispute.get("carrier_proof", {}).get("signed_by", "M. VANCE")
    new_text = (
        f"Official Carrier Delivery Certification: Package was dispatched under certified bill of lading "
        f"and successfully delivered with verified recipient signature '{signed}'. Carrier tracking ({tracking}) "
        f"confirms exact match to registered buyer delivery coordinates. Requesting immediate case closure."
    )
    if "evidence_draft" not in dispute or not isinstance(dispute["evidence_draft"], dict):
        dispute["evidence_draft"] = {}
    dispute["evidence_draft"]["text"] = new_text
    dispute["ai_drafted_evidence"] = new_text
    save_disputes()
    return {"success": True, "dispute": dispute, "redrafted_text": new_text}


@router.post("/api/disputes/{dispute_id}/approve")
@router.post("/disputes/{dispute_id}/approve")
def approve_dispute_endpoint(dispute_id: str, req: Optional[ApproveRequest] = None):
    dispute = _DISPUTES_DB.get(dispute_id)
    if not dispute:
        raise HTTPException(status_code=404, detail="Dispute not found")

    approver = req.approver_id if req and req.approver_id else "Authorized Seller Representative"
    dispute["status"] = "RESOLVED"
    dispute["approval_state"] = "approved"
    dispute["seller_approval"] = {
        "approved": True,
        "conceded": False,
        "approved_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "approver_id": approver
    }
    save_disputes()
    return {
        "success": True,
        "dispute": dispute,
        "audit": {"hash": f"aud_{dispute_id[:8]}_{int(time.time())}"}
    }


@router.post("/api/disputes/{dispute_id}/reject")
@router.post("/disputes/{dispute_id}/reject")
def reject_dispute_endpoint(dispute_id: str, req: Optional[RejectRequest] = None):
    dispute = _DISPUTES_DB.get(dispute_id)
    if not dispute:
        raise HTTPException(status_code=404, detail="Dispute not found")
    reason = req.reason if req and req.reason else "Seller conceded claim"
    dispute["status"] = "RESOLVED"
    dispute["approval_state"] = "rejected"
    dispute["seller_approval"] = {
        "approved": False,
        "conceded": True,
        "rejection_reason": reason
    }
    save_disputes()
    return {"success": True, "dispute": dispute}


@router.post("/api/sync")
@router.post("/sync")
def sync_disputes_endpoint():
    return {"success": True, "count": len(_DISPUTES_DB), "disputes": list(_DISPUTES_DB.values())}


@router.get("/api/timeline")
@router.get("/timeline")
def get_timeline():
    items = list(_DISPUTES_DB.values())
    return {"timeline": items}


@router.get("/api/audit")
@router.get("/audit")
def get_audit():
    return {"audit_trail": []}


class WebhookSimRequest(BaseModel):
    event_type: str = "CUSTOMER_DISPUTE_CREATED"
    dispute_type: Optional[str] = "MERCHANDISE_OR_SERVICE_NOT_RECEIVED"
    amount: Optional[float] = 349.00
    currency: Optional[str] = "USD"
    buyer_name: Optional[str] = "Priya Sundaram"
    carrier: Optional[str] = "BlueDart Express"


@router.post("/api/disputes/simulate-webhook")
@router.post("/disputes/simulate-webhook")
def simulate_dispute_webhook(req: WebhookSimRequest):
    new_id = f"PP-D-{int(time.time()) % 10000000}"
    tracking_num = f"BLR{int(time.time()) % 1000000}"
    
    new_dispute = {
        "id": new_id,
        "dispute_id": new_id,
        "status": "WAITING_FOR_SELLER_RESPONSE",
        "dispute_amount": {"currency": req.currency or "USD", "value": f"{req.amount:.2f}"},
        "reason": req.dispute_type or "MERCHANDISE_OR_SERVICE_NOT_RECEIVED",
        "seller_response_due_date": "2026-11-25T18:00:00Z",
        "order_id": f"ORD-{int(time.time()) % 100000}",
        "transaction_id": f"TRX-{int(time.time()) % 10000000}X",
        "buyer": {
            "name": req.buyer_name or "Priya Sundaram",
            "email": "priya.sundaram@example.com",
            "shipping_address": {
                "line1": "100 Feet Road, Indiranagar",
                "city": "Bengaluru",
                "state": "KA",
                "postal_code": "560038",
                "country_code": "IN"
            }
        },
        "carrier_proof": {
            "carrier": req.carrier or "BlueDart Express",
            "tracking_number": tracking_num,
            "status": "DELIVERED",
            "delivery_date": "2026-11-18T16:45:12Z",
            "signed_by": (req.buyer_name or "P. Sundaram").upper(),
            "has_signature": True,
            "carrier_verified": True,
            "kernel_audit_id": f"KERNEL-CERT-{int(time.time()) % 10000}",
            "delivery_address_verified": True,
            "gps_coordinates": {
                "latitude": 12.9716,
                "longitude": 77.5946,
                "geo_fence_radius_meters": 15,
                "geo_fence_status": "WITHIN_DELIVERY_ZONE",
                "dropoff_point": "Front Porch / Handed to Resident"
            }
        },
        "evidence_draft": {
            "text": f"Autonomous defense generated: Item was dispatched via {req.carrier or 'BlueDart Express'} (Tracking: {tracking_num}) and delivered inside confirmed geo-fence (12.9716, 77.5946). Buyer signature recorded. In accordance with PayPal Seller Protection §11.2, claim is refuted.",
            "proofs": ["GPS_GEO_FENCE_CERT", "CARRIER_SIGNATURE_SLIP", "DISPATCH_MANIFEST"]
        },
        "seller_approval": {"approved": False, "conceded": False}
    }
    
    _DISPUTES_DB[new_id] = new_dispute
    save_disputes()
    return {"success": True, "event": req.event_type, "dispute": new_dispute}

