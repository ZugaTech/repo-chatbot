from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import repo, chat, status

app = FastAPI(title="Repo Chatbot API", version="1.0.0")

# Allow CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(status.router, tags=["status"])
app.include_router(repo.router, prefix="/api/repo", tags=["repo"])
app.include_router(chat.router, prefix="/api", tags=["chat"])

@app.on_event("startup")
async def startup_event():
    import logging
    logging.info("Starting up Repo Chatbot API...")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
