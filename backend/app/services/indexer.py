import asyncio
from typing import List, Dict
from .cloner import clone_repo
from .parser import parse_repository
from .chunker import chunk_repository_files
from .embedder import embed_texts
from .vectorstore import upsert_chunks

async def index_repository(repo_url: str, repo_id: str) -> str:
    """Full indexing pipeline: clone, parse, chunk, embed, store.
    Returns the repo_id.
    """
    # Clone repository
    repo_path = clone_repo(repo_url, repo_id)
    # Parse files
    parsed_files = parse_repository(repo_path)
    # Chunk files
    chunks = chunk_repository_files(parsed_files)
    # Prepare data for vectorstore
    vector_chunks = []
    for i, chunk in enumerate(chunks):
        vector_chunks.append({
            "id": f"{repo_id}_chunk_{i}",
            "content": chunk["chunk_text"],
            "metadata": {
                "repo_id": repo_id,
                "filepath": chunk["filepath"],
                "relative_path": chunk["relative_path"],
                "language": chunk["language"],
                "start_line": chunk["start_line"],
                "end_line": chunk["end_line"]
            }
        })
    # Embed and upsert
    texts = [vc["content"] for vc in vector_chunks]
    embeddings = embed_texts(texts)
    for vc, emb in zip(vector_chunks, embeddings):
        vc["embedding"] = emb
    upsert_chunks(repo_id, vector_chunks)
    return repo_id
