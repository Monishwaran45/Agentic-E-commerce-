# Agentic E-Commerce Platform

> Autonomous AI-powered e-commerce shopping, recovery operations, and dispute resolution platform driven by specialized multi-agent systems, deterministic guardrails, and cryptographic auditability.

---

## Overview

Agentic E-Commerce unifies conversational natural language shopping with autonomous financial operations. Built upon an enterprise multi-agent architecture, Gnani.ai voice intelligence, carrier telemetry verification, and non-bypassable guardrails, the platform enables shoppers to discover catalog items, negotiate deals, and complete checkouts, while equipping operators with dispute defense automation, cryptographic audit ledgers, and human-in-the-loop governance.

---

## Architecture

```text
                           Shopper Client & Unified Console
                    (Dynamic RBAC Workspace: React + Vite SPA)
                                       |
                                       v
                              Agent Gateway API
                            (FastAPI Orchestrator)
                                       |
        +------------------------------+------------------------------+
        |                              |                              |
        v                              v                              v
Product & Checkout Agent    Vasool Recovery Engine        PayPal Dispute Copilot
- Multimodal Visual Search  - 6-Phase Execution Pipeline  - Carrier GPS Geo-Fence Map
- Price Negotiation Bot     - Gnani Indic Voice Engine    - AI Legal Precedent Defense
- Spend-Cap Guardrail Engine- HITL Dual-Key Approval      - Webhook Simulation Engine
- Razorpay Payment Sync     - Omnichannel Messaging Hub   - One-Click PDF Certification
        |                              |                              |
        +------------------------------+------------------------------+
                                       |
                                       v
                     Unified Canonical Cryptographic Ledger
                    (SHA-256 Hash Chaining & WebCrypto Audit)
```

---

## Enterprise Role-Based Access Control (RBAC)

The application enforces unified, role-based workspace views directly within a single application frame:

1. Customer / Shopper (`shopper`):
   - Conversational product search and comparison with zero hallucination.
   - Multimodal visual search ("Snap to Shop") with instant embeddings matching.
   - Gnani Indic voice input with live audio waveforms across 5 languages (English, Hindi, Tamil, Telugu, Kannada).
   - Autonomous price negotiation bot with dynamic manager concession vouchers (e.g. BARGAIN15).
   - Shopping cart and checkout with hard-enforced Rs. 10,000 spend-cap guardrail.
   - Instant over-budget spend elevation request flow.

2. Merchant Operations Manager (`merchant`):
   - Catalog inventory stock management and replenishment controls.
   - Spend ceiling policy governance and concession margin limits.
   - Security audit log inspection and session tracking.

3. PayPal Dispute & Risk Analyst (`dispute_analyst`):
   - PayPal Dispute Center with active dispute pipeline.
   - Interactive Carrier GPS Geo-Fence Verification Map with 15m radius circles, courier breadcrumbs, and recipient signature canvas.
   - AI legal defense draft generator citing statutory precedents and Seller Protection Section 11.2.
   - Simulated PayPal webhook ingestion engine (Item Not Received, Fraud Dispute).
   - Multi-Agent Consensus War Room for chargeback deliberations.
   - One-click exportable Cryptographic Arbitration Certificate (PDF / Print).

4. Vasool Recovery Admin (`admin`):
   - Full access across all storefront and recovery modules.
   - Autonomous Recovery Pipeline Telemetry Console with 6-phase stepper and live agent reasoning logs.
   - Multi-Agent Collaborative War Room featuring FraudSentinel, LogisticsAuditor, PricingStrategist, and LegalArbitrator.
   - Omnichannel WhatsApp and SMS Recovery Simulator with interactive smartphone interface and outbound voice call briefings.
   - Human-in-the-Loop (HITL) Approvals Inbox with cryptographic dual-key signing and voice read-backs.
   - SHA-256 Chained Cryptographic Ledger Explorer with interactive Tamper Attack simulation sandbox.
   - Enterprise Red-Team Security Penetration Sandbox testing prompt injection, replay, and race condition attacks.

---

## Key Capabilities

1. Conversational & Multimodal Product Discovery:
   Natural language querying, clarifying questions, side-by-side product comparisons, and camera/image visual embeddings search.

2. Deterministic Code-Enforced Guardrails:
   Non-bypassable checks for inventory stock, single-use 10-minute token TTLs, and a strict Rs. 10,000 spend ceiling that fails closed against bypass attempts.

3. Autonomous Multi-Agent Recovery Pipeline:
   Deterministic 6-phase recovery workflow: Signal Ingestion, Evidence Mining, AI Legal Defense, Cryptographic Policy Gate, HITL Guardrail Gate, and Ledger Settlement.

4. Gnani.ai Indic Voice Intelligence:
   Deep integration with Gnani.ai Vach/Prisma ASR and Timbre TTS supporting English, Hindi, Tamil, Telugu, and Kannada with live frequency visualizers.

5. Carrier GPS Geo-Fence Verification:
   Interactive vector radar and dark satellite maps rendering delivery drop-off coordinates, 15m geo-fence zones, carrier tracking receipts, and recipient digital signatures.

6. Unified SHA-256 Cryptographic Ledger:
   Tamper-evident transaction logging where each block hash depends on the previous block hash and canonical JSON payloads, complete with client-side WebCrypto validation and an interactive tamper sandbox.

7. Real-Time Cross-Window Synchronization:
   Lightweight browser event bus utilizing BroadcastChannel for instantaneous toast alerts across tabs when orders, disputes, or spend elevation requests occur.

---

## Project Structure

```text
Agentic-E-commerce/
  backend/
     app/
        __init__.py
        main.py                   # FastAPI application entrypoint with RBAC routing
        config.py                 # Configuration and environment management
        recovery.py               # Vasool debt recovery endpoints, ledger, and HITL
        gnani_service.py          # Gnani.ai speech synthesis, ASR, and briefings
        disputes_router.py        # PayPal dispute inspection, GPS proof, and webhooks
        local_disputes.json       # Seed dispute records and carrier telemetry
        catalog.json              # Canonical 10,000+ SKU product catalog
        test_recovery.py          # Comprehensive pytest test suite (20/20 passing)
        test_shopping.py          # Shopping agent and catalog unit tests
        agents/                   # Specialized autonomous agents
        guardrails/               # Financial and data protection checks
        models/                   # Pydantic schemas and database models
     requirements.txt             # Python dependencies
  frontend/
     src/
        components/
           ArbitrationCertificateModal.jsx  # Printable legal arbitration certificate
           AudioWaveformVisualizer.jsx      # Animated audio equalizer bars
           AutonomousPipelineTelemetry.jsx   # 6-phase pipeline stepper and live logs
           CryptographicBlockExplorer.jsx   # SHA-256 blockchain explorer and tamper sandbox
           GpsGeoFenceMap.jsx               # Interactive GPS delivery geo-fence map
           MultiAgentWarRoom.jsx            # 4-agent peer-to-peer consensus war room
           OmnichannelPhoneSimulator.jsx    # Interactive WhatsApp and SMS phone mockup
           RedTeamSecuritySandbox.jsx       # Adversarial cyber attack simulator
           VisualSearchModal.jsx            # Snap to Shop computer vision search
           ToastNotification.jsx            # Real-time event toast alerts
           Header.jsx                       # RBAC role selector and status bar
           ChatPanel.jsx                    # Conversational assistant and voice dock
           CatalogPanel.jsx                 # Product catalog grid and category filters
           PurchaseSummaryPanel.jsx         # Checkout drawer and spend elevation flow
           VasoolConsole.jsx                # Unified operations console
        services/
           api.js                 # Network client with RBAC auth header injection
           eventBus.js            # BroadcastChannel real-time event dispatcher
        App.jsx                   # Single unified workspace shell
     package.json                 # Frontend dependencies and Vite configuration
  README.md                       # System documentation
```

---

## API Specification

### 1. System Health & RBAC Authentication
- `GET /api/health` - Service heartbeat, database connection, and operational status.
- `GET /api/auth/roles` - Returns available RBAC roles, metadata, and permission arrays.
- `GET /api/auth/me` - Resolves active role profile and permissions via X-User-Role header.

### 2. Product Catalog & Chat
- `GET /api/catalog` - Query full product catalog with optional SKU, keyword, or category filters.
- `POST /api/chat` - Natural language shopping assistant turn with intent and guardrail parsing.
- `POST /api/chat-history/consent` - Set privacy consent for session history persistence.

### 3. Gnani Voice Intelligence
- `POST /api/voice/turn` - Process spoken audio through Gnani ASR and return conversational audio.
- `POST /api/voice/brief` - Synthesize executive operations briefings in English or Indic languages.
- `POST /api/voice/transcribe` - Transcribe raw WAV/PCM audio via Gnani ASR.
- `POST /api/voice/synthesize` - Convert text to natural speech using Gnani Timbre TTS.

### 4. Autonomous Recovery & Financial Operations
- `POST /api/recovery/agent/run` - Trigger autonomous recovery pipeline for a target debt case.
- `POST /api/recovery/orders` - Issue signed Razorpay recovery order.
- `GET /api/recovery/pay/:token` - Retrieve validated debtor payment details.
- `POST /api/recovery/verify-payment` - Verify payment signature and record on ledger.
- `POST /api/recovery/hitl-request` - Submit customer spend elevation or manager concession request.
- `GET /api/recovery/ledger` - Fetch canonical cryptographic audit trail.
- `GET /api/recovery/ledger/verify` - Validate cryptographic hash chain integrity.

### 5. PayPal Dispute Defense Edge
- `GET /api/disputes` - List active chargebacks and dispute cases.
- `GET /api/disputes/:id` - Retrieve dispute details, evidence drafts, and carrier proofs.
- `POST /api/disputes/:id/evidence` - Update defense evidence text.
- `POST /api/disputes/:id/approve` - Approve and submit legal defense to PayPal.
- `POST /api/disputes/:id/reject` - Concede buyer dispute claim.
- `POST /api/disputes/:id/redraft` - Regenerate AI evidence citing statutory precedents.
- `POST /api/disputes/simulate-webhook` - Simulate incoming PayPal webhook events.

---

## Quick Start Guide

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 2. Backend Setup

```bash
cd backend
python -m venv .venv

# On Windows:
.venv\Scripts\activate

# On Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Backend will be available at `http://localhost:8000` (Swagger documentation at `http://localhost:8000/docs`).

### 3. Run Backend Test Suite

```bash
cd backend
python -m pytest app/test_recovery.py
```

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

Access the unified portal at `http://localhost:5173`. Switch between Customer, Merchant, Dispute Analyst, and Vasool Admin roles using the header dropdown.

---

## License

This project is licensed under the MIT License.
