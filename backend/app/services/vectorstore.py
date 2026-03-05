import os
from typing import List, Dict, Any
import chromadb
from chromadb.config import Settings as ChromaSettings

# Initialize Chroma client
CHROMA_HOST = os.getenv("CHROMA_HOST", "chromadb")
CHROMA_PORT = int(os.getenv("CHROMA_PORT", "8000"))
client = chromadb.HttpClient(host=CHROMA_HOST, port=CHROMA_PORT, settings=ChromaSettings(allow_reset=True))

def get_collection(repo_id: str):
    collection_name = f"repo_{repo_id}"
    return client.get_collection(name=collection_name, metadata={"repo_id": repo_id})

def upsert_chunks(repo_id: str, chunks: List[Dict[str, Any]]):
    """Upsert a list of chunk dicts into Chroma.
    Each chunk dict should contain keys: id, content, metadata.
    """
    collection = get_collection(repo_id)
    ids = [chunk["id"] for chunk in chunks]
    documents = [chunk["content"] for chunk in chunks]
    metadatas = [chunk.get("metadata", {}) for chunk in chunks]
    collection.upsert(ids=ids, documents=documents, metadatas=metadatas)

def query(repo_id: str, query_text: str, top_k: int = 8) -> List[Dict[str, Any]]:
    collection = get_collection(repo_id)
    results = collection.query(query_texts=[query_text], n_results=top_k, include=['documents', 'metadatas', 'distances', 'ids'])
    # Flatten results
    hits = []
    for i in range(len(results['ids'][0])):
        hits.append({
            "id": results['ids'][0][i],
            "content": results['documents'][0][i],
            "metadata": results['metadatas'][0][i],
            "distance": results['distances'][0][i]
        })
    return hits

def delete_collection(repo_id: str):
    collection_name = f"repo_{repo_id}"
    client.delete_collection(name=collection_name)

def list_collections():
    return client.list_collections()
