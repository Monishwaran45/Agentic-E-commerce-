from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings

app = FastAPI(
    title="Agentic E-Commerce API",
    description="Autonomous Agentic Shopping and Checkout Engine",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS if hasattr(settings, "CORS_ORIGINS") else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Vasool Recovery Router (Spec v0.2)
try:
    from app.recovery import router as recovery_router
    app.include_router(recovery_router)
except ImportError:
    try:
        from recovery import router as recovery_router
        app.include_router(recovery_router)
    except Exception:
        pass

# Gnani Voice Service & LangGraph Router
try:
    from app.gnani_service import router as voice_router
    app.include_router(voice_router)
except ImportError:
    try:
        from gnani_service import router as voice_router
        app.include_router(voice_router)
    except Exception:
        pass

# PayPal Dispute Copilot Defense Router
try:
    from app.disputes_router import router as disputes_router
    app.include_router(disputes_router)
except ImportError:
    try:
        from disputes_router import router as disputes_router
        app.include_router(disputes_router)
    except Exception:
        pass


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "Agentic E-Commerce Backend"}


@app.get("/")
def root():
    return {
        "message": "Welcome to Agentic E-Commerce API",
        "docs": "/docs",
        "version": "0.1.0",
    }
