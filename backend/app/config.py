import os

try:
    from pydantic_settings import BaseSettings, SettingsConfigDict

    class Settings(BaseSettings):
        model_config = SettingsConfigDict(env_file=".env", extra="ignore")

        APP_NAME: str = "Agentic E-Commerce"
        ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
        OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
        GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
        CORS_ORIGINS: list = ["*"]
except ImportError:
    from pydantic import BaseModel

    class Settings(BaseModel):
        APP_NAME: str = "Agentic E-Commerce"
        ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
        OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
        GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
        CORS_ORIGINS: list = ["*"]


settings = Settings()
