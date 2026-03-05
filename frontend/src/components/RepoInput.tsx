import React, { useState } from 'react';
import { Search } from 'lucide-react';
import StatusBadge from './StatusBadge';

interface RepoInputProps {
    onIndex: (url: string) => void;
    status: string;
}

const RepoInput: React.FC<RepoInputProps> = ({ onIndex, status }) => {
    const [url, setUrl] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (url.trim()) {
            onIndex(url.trim());
        }
    };

    return (
        <div className="repo-input-container" style={{ marginBottom: '1rem' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <div style={{ color: 'var(--accent-color)', whiteSpace: 'nowrap' }}>$ git clone</div>
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://github.com/owner/repo"
                    disabled={status === 'indexing'}
                />
                <button type="submit" disabled={status === 'indexing'}>
                    {status === 'indexing' ? '...' : <Search size={18} />}
                </button>
                <StatusBadge status={status} />
            </form>
        </div>
    );
};

export default RepoInput;
