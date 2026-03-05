import React, { useState } from 'react';
import { FileCode, ChevronDown, ChevronUp, Copy } from 'lucide-react';

interface CitationCardProps {
    filepath: string;
    startLine: number;
    endLine: number;
    content?: string;
}

const CitationCard: React.FC<CitationCardProps> = ({ filepath, startLine, endLine, content }) => {
    const [expanded, setExpanded] = useState(false);

    const copyPath = () => {
        navigator.clipboard.writeText(filepath);
    };

    return (
        <div className="citation-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileCode size={16} />
                    <span style={{ fontSize: '0.9rem' }}>{filepath}</span>
                    <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>Lines {startLine}-{endLine}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={copyPath} style={{ border: 'none', padding: '2px' }} title="Copy path">
                        <Copy size={14} />
                    </button>
                    {content && (
                        <button onClick={() => setExpanded(!expanded)} style={{ border: 'none', padding: '2px' }}>
                            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                    )}
                </div>
            </div>
            {expanded && content && (
                <pre style={{ marginTop: '0.5rem', fontSize: '0.8rem', overflowX: 'auto', background: 'var(--bg-color)', padding: '0.5rem' }}>
                    {content}
                </pre>
            )}
        </div>
    );
};

export default CitationCard;
