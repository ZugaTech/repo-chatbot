# Repo Chatbot (RAG)

A production-ready web application to chat with any public GitHub repository using natural language. Built with FastAPI, React, ChromaDB, and OpenAI.

## Features

- **Instant Indexing**: Clone and index any public GitHub repository in seconds.
- **Semantic Search**: Uses OpenAI `text-embedding-3-small` and ChromaDB for high-accuracy code retrieval.
- **Context-Aware Chat**: Powered by GPT-4o with streaming responses and precise file citations.
- **Terminal Aesthetic**: Sleek, hacker-style interface built with React and TypeScript.
- **Dockerized**: Entire stack runs with a single command.

## Architecture

```text
[ Frontend (React) ] <-> [ Backend (FastAPI) ] <-> [ ChromaDB ]
 |
 v
 [ GitHub Repo ]
 [ OpenAI API ]
```

## Quick Start

1. **Clone this repository**:
 ```bash
 git clone https://github.com/your-username/repo-chatbot.git
 cd repo-chatbot
 ```

2. **Configure Environment**:
 Copy `.env.example` to `.env` and add your OpenAI API key.
 ```bash
 cp.env.example.env
 ```

3. **Launch with Docker Compose**:
 ```bash
 docker-compose up --build
 ```

4. **Access the App**:
 Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Backend**: Python 3.11, FastAPI, ChromaDB, OpenAI SDK, Tiktoken, Git.
- **Frontend**: Vite, React, TypeScript, Axios, Lucide React, React Markdown.
- **Infrastructure**: Docker, Docker Compose, Nginx.

## Limitations

- Supports public GitHub repositories only.
- Repository size limit: 500MB.
- File size limit for indexing: 200KB per file.

## License

MIT