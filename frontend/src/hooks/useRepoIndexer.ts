import { useState, useEffect, useRef } from 'react';
import { indexRepo, getRepoStatus } from '../api/client';

export interface IndexingStatus {
    repo_id: string;
    status: string;
    error?: string;
}

export const useRepoIndexer = () => {
    const [repoId, setRepoId] = useState<string | null>(null);
    const [status, setStatus] = useState<string>('idle');
    const [error, setError] = useState<string | null>(null);
    const pollInterval = useRef<number | null>(null);

    const startIndexing = async (repoUrl: string) => {
        setError(null);
        setStatus('initiating');
        try {
            const data = await indexRepo(repoUrl);
            setRepoId(data.repo_id);
            setStatus(data.status);
            startPolling(data.repo_id);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to start indexing');
            setStatus('failed');
        }
    };

    const startPolling = (rid: string) => {
        if (pollInterval.current) clearInterval(pollInterval.current);
        pollInterval.current = window.setInterval(async () => {
            try {
                const data = await getRepoStatus(rid);
                setStatus(data.status);
                if (data.status === 'ready' || data.status.startsWith('failed')) {
                    stopPolling();
                }
            } catch (err) {
                console.error('Polling error:', err);
            }
        }, 2000);
    };

    const stopPolling = () => {
        if (pollInterval.current) {
            clearInterval(pollInterval.current);
            pollInterval.current = null;
        }
    };

    useEffect(() => {
        return () => stopPolling();
    }, []);

    return { repoId, status, error, startIndexing };
};
