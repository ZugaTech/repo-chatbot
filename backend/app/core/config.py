import os
from pydantic import BaseSettings, Field

class Settings(BaseSettings):
    openai_api_key: str = Field(..., env="OPENAI_API_KEY")
    chroma_host: str = Field(default="chromadb", env="CHROMA_HOST")
    chroma_port: int = Field(default=8000, env="CHROMA_PORT")
    delete_after_index: bool = Field(default=True, env="DELETE_AFTER_INDEX")
    # Add any additional settings here

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
