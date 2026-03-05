import os
import pathlib
import json
from typing import List, Dict

# Supported file extensions for code extraction
SUPPORTED_EXTENSIONS = {".py", ".js", ".ts", ".tsx", ".jsx", ".java", ".go", ".rs", ".cpp", ".c", ".h", ".cs", ".php", ".swift", ".kt", ".md", ".yaml", ".yml", ".json", ".toml", ".env"}

MAX_FILE_SIZE_BYTES = 200 * 1024  # 200KB limit

def _is_supported(file_path: pathlib.Path) -> bool:
    return file_path.suffix.lower() in SUPPORTED_EXTENSIONS and file_path.stat().st_size <= MAX_FILE_SIZE_BYTES

def parse_repository(repo_path: str) -> List[Dict]:
    """Parse a cloned repository and return a list of file metadata.

    Each entry contains:
        - filepath: absolute path
        - relative_path: path relative to repo root
        - language: inferred from extension
        - content: file text
    """
    repo_root = pathlib.Path(repo_path)
    parsed_files = []
    for root, dirs, files in os.walk(repo_root):
        # Skip common unwanted directories
        dirs[:] = [d for d in dirs if d not in {".git", "node_modules", "__pycache__", "dist", "build", ".next", "vendor"}]
        for filename in files:
            file_path = pathlib.Path(root) / filename
            if not _is_supported(file_path):
                continue
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()
            except Exception:
                continue
            parsed_files.append({
                "filepath": str(file_path),
                "relative_path": str(file_path.relative_to(repo_root)),
                "language": file_path.suffix.lstrip('.'),
                "content": content,
            })
    return parsed_files
