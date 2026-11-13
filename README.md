# Agentic E-Commerce

> An autonomous AI-powered e-commerce shopping and checkout platform driven by intelligent agents, verified guardrails, and seamless transactional workflows.

---

## 🌟 Overview

**Agentic E-Commerce** bridges the gap between natural language consumer intent and transactional retail actions. Powered by multi-agent orchestration and strict execution guardrails, this platform enables users to discover products, negotiate and compare options, manage shopping carts, and securely complete checkouts autonomously.

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────┐
│                   Shopper Client UI                    │
│            (Interactive Conversational Chat)           │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                   Agent Gateway API                    │
│                 (FastAPI Orchestrator)                 │
└───────────────┬────────────────────────┬───────────────┘
                │                        │
                ▼                        ▼
┌───────────────────────────────┐ ┌───────────────────────────────┐
│     Product Discovery Agent   │ │      Checkout & Cart Agent    │
│  - Catalog Vector Search      │ │  - Price & Stock Validation   │
│  - Multi-Criteria Filtering   │ │  - Spend-Cap Guardrails       │
│  - Structured JSON Output     │ │  - Payment Gateway Sync       │
└───────────────────────────────┘ └───────────────────────────────┘
```

---

## 🚀 Key Features

- **Conversational Product Discovery:** Intent recognition and semantic search over merchant catalogs.
- **Structured Data Contracts:** Enforced JSON outputs preventing price hallucination and rendering native UI cards.
- **Deterministic Guardrails:** Hard code checks for stock availability, coupon fraud prevention, and session isolation.
- **Secure Checkout Flow:** Automated cart assembly and payment verification with Human-In-The-Loop approval gates.

---

## 📂 Project Structure

```
Agentic-E-commerce/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py            # FastAPI application entrypoint
│   │   ├── config.py          # Configuration and environment management
│   │   ├── agents/            # Specialized autonomous agents
│   │   │   ├── __init__.py
│   │   │   ├── shopping.py    # Product discovery and recommendation agent
│   │   │   └── checkout.py    # Guardrail-enforced checkout agent
│   │   ├── guardrails/        # Financial & data protection checks
│   │   │   └── __init__.py
│   │   └── models/            # Pydantic schemas and database models
│   │       └── __init__.py
│   └── requirements.txt       # Python dependencies
├── frontend/                  # Web interface / SPA
├── .env.example               # Template environment configuration
├── .gitignore
└── README.md
```

---

## ⚙️ Quick Start

### Backend Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Monishwaran45/Agentic-E-commerce-.git
   cd Agentic-E-commerce-/backend
   ```

2. **Create and activate a virtual environment:**
   ```bash
   python -m venv .venv
   # Windows:
   .venv\Scripts\activate
   # Linux/macOS:
   source .venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the API server:**
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

---

## 🛡️ License

This project is licensed under the MIT License.
