import os
import openai
from typing import List

# Ensure OpenAI API key is set via environment or settings
openai.api_key = os.getenv("OPENAI_API_KEY")

def embed_texts(texts: List[str]) -> List[List[float]]:
    """Generate embeddings for a list of texts using OpenAI text-embedding-3-small.
    Returns a list of embedding vectors.
    """
    response = openai.embeddings.create(model="text-embedding-3-small", input=texts)
    return [e.embedding for e in response.data]

def embed_query(query: str) -> List[float]:
    """Generate an embedding for a single query string."""
    return embed_texts([query])[0]
