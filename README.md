# Agentic E-Commerce

> Autonomous AI-powered e-commerce shopping, recovery, and dispute resolution platform driven by intelligent agents, verified guardrails, and cryptographic auditability.

---

## Overview

Agentic E-Commerce bridges the gap between natural language consumer intent and transactional commerce actions. Powered by multi-agent orchestration, Gnani.ai voice intelligence, LangGraph state machines, and strict execution guardrails, this platform enables users to discover products, negotiate and compare options, manage recovery links, resolve disputes, and securely complete checkouts autonomously.

---

## Architecture

```text
                   Shopper Client UI / Vasool Console
             (Interactive Conversational Chat & Web Voice)
                                  |
                                  v
                        Agent Gateway API
                      (FastAPI Orchestrator)
                                  |
       +--------------------------+--------------------------+
       |                          |                          |
       v                          v                          v
Product & Checkout Agent    LangGraph Recovery Agent   PayPal Dispute Copilot
- Catalog Vector Search     - StateGraph Workflow      - Carrier Proof Verification
- Spend-Cap Guardrails      - Gnani Voice Read-Back    - LLM Legal Defense Draft
- Razorpay Payment Sync     - Human-in-the-Loop Sign   - Automated Concede / Appeal
       |                          |                          |
       +--------------------------+--------------------------+
                                  |
                                  v
              Unified Canonical Cryptographic Ledger
             (SHA-256 Hash Chaining & WebCrypto Audit)
```

---

## Key Capabilities

1. Conversational Product Discovery: Intent recognition and semantic search over merchant catalogs with zero price hallucination.
2. Code-Enforced Guardrails: Non-bypassable checks for stock availability, merchant spend caps (Rs. 10,000 threshold), and session isolation.
3. LangGraph Autonomous Recovery: StateGraph state machine managing automated debt recovery, risk evaluation, voice briefings, and authorization token signing.
4. Gnani.ai Voice Intelligence: Deep integration with Gnani.ai Vach/Prisma ASR and Timbre TTS for real-time voice read-backs, debtor communication, and executive briefings.
5. PayPal Dispute Defense Edge: Carrier tracking ingestion, signature verification, AI-generated legal defense packages, and seamless dispute status tracking.
6. Unified Cryptographic Ledger: Tamper-evident SHA-256 chained transaction logging compliant with financial audit specifications.

---

## Project Structure

```text
Agentic-E-commerce/
 backend/
    app/
       __init__.py
       main.py                   # FastAPI application entrypoint
       config.py                 # Configuration and environment management
       recovery.py               # Vasool debt recovery endpoints and ledger
       recovery_langgraph.py     # LangGraph recovery workflow state machine
       gnani_service.py          # Gnani.ai speech synthesis, ASR, and briefings
       disputes_router.py        # PayPal dispute inspection and defense API
       local_disputes.json       # Seed dispute cases and carrier proofs
       test_recovery.py          # Comprehensive test suite (20/20 passing)
       agents/                   # Specialized autonomous agents
       guardrails/               # Financial and data protection checks
       models/                   # Pydantic schemas and database models
    requirements.txt             # Python dependencies
 frontend/                       # Interactive React + Vite SPA
 README.md                       # System documentation
```

---

## API Specification

### 1. Checkout & Health
- `GET /health` - Service heartbeat and operational status.
- `GET /` - Root discovery endpoint.

### 2. Gnani Voice Intelligence
- `POST /api/voice/turn` - Process spoken audio through Gnani ASR and generate conversational audio response.
- `POST /api/voice/brief` - Synthesize executive portfolio briefings in English or Indic languages.
- `POST /api/voice/transcribe` - Transcribe raw WAV/PCM audio via Gnani ASR.
- `POST /api/voice/synthesize` - Convert text to natural audio using Gnani Timbre TTS.

### 3. LangGraph Autonomous Recovery
- `POST /api/recovery/agent/run` - Trigger LangGraph state graph recovery workflow for a debtor case.
- `POST /api/recovery/orders` - Issue signed Razorpay recovery order.
- `GET /api/recovery/pay/:token` - Retrieve validated debtor payment details.
- `POST /api/recovery/verify` - Verify payment signature and record on ledger.
- `GET /api/recovery/ledger` - Fetch canonical cryptographic audit trail.
- `GET /api/recovery/ledger/verify` - Execute server-side cryptographic ledger chain verification.

### 4. PayPal Dispute Defense Edge
- `GET /api/disputes/` - List active chargebacks and dispute cases.
- `GET /api/disputes/:id` - Retrieve dispute details, evidence drafts, and carrier proofs.
- `POST /api/disputes/:id/approve` - Approve and submit legal defense to PayPal.
- `POST /api/disputes/:id/reject` - Concede buyer dispute claim.
- `POST /api/disputes/:id/redraft` - Regenerate AI evidence with legal precedents.

---

## Quick Start Guide

### 1. Backend Setup

```bash
cd backend
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 2. Run Test Suite

```bash
cd backend
python -m pytest app/test_recovery.py
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev -- --port 5173
```

Access the UI at `http://localhost:5173` and the Vasool Console at `http://localhost:5173/console`.

---

## License

This project is licensed under the MIT License.
