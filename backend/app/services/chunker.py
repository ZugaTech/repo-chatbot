import os
import tiktoken
from typing import List, Dict

# Tokenizer for cl100k_base (compatible with OpenAI embeddings)
TOKENIZER = tiktoken.get_encoding("cl100k_base")

CHUNK_SIZE = 400  # tokens
CHUNK_OVERLAP = 80  # tokens

def _token_count(text: str) -> int:
    return len(TOKENIZER.encode(text))

def _split_text(text: str) -> List[str]:
    """Split text into token-aware chunks with overlap.
    Returns a list of chunk strings.
    """
    tokens = TOKENIZER.encode(text)
    chunks = []
    start = 0
    while start < len(tokens):
        end = min(start + CHUNK_SIZE, len(tokens))
        chunk_tokens = tokens[start:end]
        chunk_text = TOKENIZER.decode(chunk_tokens)
        chunks.append(chunk_text)
        # Move start by chunk size minus overlap
        start += CHUNK_SIZE - CHUNK_OVERLAP
    return chunks

def chunk_repository_files(parsed_files: List[Dict]) -> List[Dict]:
    """Given parsed file metadata, produce chunk metadata.
    Each input dict should contain keys: filepath, relative_path, language, content.
    Returns list of dicts with additional keys: start_line, end_line, chunk_text, token_count.
    """
    chunked = []
    for file in parsed_files:
        content = file["content"]
        # Simple line split for line numbers
        lines = content.splitlines()
        # Build full text for tokenization (preserve newlines)
        full_text = "\n".join(lines)
        chunks = _split_text(full_text)
        # Approximate line numbers for each chunk by counting newlines in chunk
        line_offset = 0
        for chunk in chunks:
            chunk_lines = chunk.splitlines()
            start_line = line_offset + 1
            end_line = line_offset + len(chunk_lines)
            chunked.append({
                "filepath": file["filepath"],
                "relative_path": file["relative_path"],
                "language": file["language"],
                "start_line": start_line,
                "end_line": end_line,
                "chunk_text": chunk,
                "token_count": _token_count(chunk),
            })
            line_offset = end_line
    return chunked
