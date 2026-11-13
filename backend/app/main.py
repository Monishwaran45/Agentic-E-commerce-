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
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
