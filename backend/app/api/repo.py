from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
import asyncio

from ..services.indexer import index_repository

router = APIRouter()

class RepoRequest(BaseModel):
    repo_url: str

class RepoResponse(BaseModel):
    repo_id: str
    status: str

# In-memory status tracker (for simplicity)
repo_statuses = {}

async def async_bg_index_task(repo_url: str, repo_id: str):
    repo_statuses[repo_id] = "indexing"
    try:
        await index_repository(repo_url, repo_id)
        repo_statuses[repo_id] = "ready"
    except Exception as e:
        repo_statuses[repo_id] = f"failed: {str(e)}"

@router.post("/index", response_model=RepoResponse)
async def index_repo(request: RepoRequest, background_tasks: BackgroundTasks):
    repo_url = request.repo_url
    if not repo_url.startswith("https://github.com/"):
        raise HTTPException(status_code=400, detail="Only GitHub URLs are supported.")

    # Generate a simple repo_id from URL
    repo_id = repo_url.rstrip('/').split('/')[-1]
    
    # If already indexing or ready, just return
    if repo_statuses.get(repo_id) in ["indexing", "ready"]:
        return RepoResponse(repo_id=repo_id, status=repo_statuses[repo_id])

    # Start background indexing
    background_tasks.add_task(async_bg_index_task, repo_url, repo_id)
    
    return RepoResponse(repo_id=repo_id, status="indexing started")

@router.get("/{repo_id}/status")
async def get_repo_status(repo_id: str):
    status = repo_statuses.get(repo_id, "unknown")
    return {"repo_id": repo_id, "status": status}
