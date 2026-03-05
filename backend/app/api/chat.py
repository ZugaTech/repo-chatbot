from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional

from ..services.generator import generate_answer
from .repo import repo_statuses

router = APIRouter()

class ChatRequest(BaseModel):
    query: str
    repo_id: str

@router.post("/chat")
async def chat_with_repo(request: ChatRequest):
    if repo_statuses.get(request.repo_id) != "ready":
        raise HTTPException(status_code=400, detail="Repository not indexed or still indexing.")
    
    # We return a StreamingResponse to handle Server-Sent Events (SSE) or simple streaming text
    async def event_generator():
        async for chunk in generate_answer(request.query, request.repo_id):
            yield chunk

    return StreamingResponse(event_generator(), media_type="text/plain")
