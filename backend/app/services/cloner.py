import os
import subprocess
import re
import uuid
import shutil
from pathlib import Path

# Simple regex to validate GitHub repo URL
GITHUB_URL_REGEX = re.compile(r"^https?://github\.com/[^/]+/[^/]+/?$")

def _validate_url(url: str) -> bool:
    return bool(GITHUB_URL_REGEX.match(url))

def _repo_path(repo_id: str) -> Path:
    base_dir = Path(os.getenv("REPO_BASE_DIR", "/tmp/repos"))
    return base_dir / repo_id

def clone_repo(url: str, repo_id: str) -> str:
    """Shallow clone a GitHub repository.

    Args:
        url: The HTTPS GitHub repository URL.
        repo_id: A unique identifier for the repository.
    Returns:
        The absolute path to the cloned repository.
    Raises:
        ValueError: If the URL is invalid or cloning fails.
    """
    if not _validate_url(url):
        raise ValueError(f"Invalid GitHub repository URL: {url}")

    dest_path = _repo_path(repo_id)
    dest_path.mkdir(parents=True, exist_ok=True)

    # Perform a shallow clone with depth=1
    try:
        subprocess.run(
            ["git", "clone", "--depth", "1", url, str(dest_path)],
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
    except subprocess.CalledProcessError as e:
        # Cleanup on failure
        shutil.rmtree(dest_path, ignore_errors=True)
        raise ValueError(f"Git clone failed: {e.stderr.decode().strip()}")

    return str(dest_path)
