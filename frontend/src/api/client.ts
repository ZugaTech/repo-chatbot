import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

export const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface RepoStatus {
    repo_id: str;
    status: 'unknown' | 'indexing' | 'ready' | 'failed';
}

export const indexRepo = async (repoUrl: string) => {
    const { data } = await apiClient.post('/api/repo/index', { repo_url: repoUrl });
    return data;
};

export const getRepoStatus = async (repoId: string) => {
    const { data } = await apiClient.get(`/api/repo/${repoId}/status`);
    return data;
};

export const chatWithRepo = async (query: string, repoId: string, onToken: (token: string) => void) => {
    const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, repo_id: repoId }),
    });

    if (!response.ok) {
        throw new Error('Failed to start chat');
    }

    const reader = response.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        onToken(chunk);
    }
};
