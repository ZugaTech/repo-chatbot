import os
import openai
import json
from typing import List, Dict
from .vectorstore import query as vector_query

# Ensure OpenAI API key is set
openai.api_key = os.getenv("OPENAI_API_KEY")

SYSTEM_PROMPT = "You are an expert code analyst for the specified repository. Answer the user's question using only the provided context. Cite sources with file path and line numbers. If you are unsure, say so."

def _format_citations(chunks: List[Dict]) -> str:
    citations = []
    for i, chunk in enumerate(chunks, start=1):
        meta = chunk.get("metadata", {})
        filepath = meta.get("filepath", "")
        start_line = meta.get("start_line", 0)
        end_line = meta.get("end_line", 0)
        citations.append(f"[{i}] {filepath} lines {start_line}-{end_line}")
    return "\n".join(citations)

async def generate_answer(query: str, repo_id: str, top_k: int = 8):
    # Retrieve relevant chunks
    hits = vector_query(repo_id, query, top_k=top_k)
    # Prepare context string
    context_str = "\n\n---\n\n".join([f"[File: {hit['metadata'].get('filepath')} Lines {hit['metadata'].get('start_line')}-{hit['metadata'].get('end_line')}]\n{hit['content']}" for hit in hits])
    # Build user prompt
    user_prompt = f"Question: {query}\n\nContext:\n{context_str}\n\nProvide a concise answer and list citations using the format [i] as shown."
    # Call OpenAI chat completion with streaming
    response = await openai.ChatCompletion.acreate(
        model="gpt-4o",
        messages=[{"role": "system", "content": SYSTEM_PROMPT}, {"role": "user", "content": user_prompt}],
        stream=True,
        temperature=0.2,
    )
    # Yield tokens as they arrive
    async for chunk in response:
        if "content" in chunk["choices"][0]["delta"]:
            yield chunk["choices"][0]["delta"]["content"]
    # After streaming, yield citations block
    citations_block = "\n[CITATIONS]\n" + _format_citations(hits)
    yield citations_block
