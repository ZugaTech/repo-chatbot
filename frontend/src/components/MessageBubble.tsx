import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import CitationCard from './CitationCard';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface MessageBubbleProps {
    message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
    const isAssistant = message.role === 'assistant';

    // Basic citation parsing from text for demonstration
    // Real implementation might use pre-parsed citations
    const citations: any[] = [];
    let displayContent = message.content;
    if (isAssistant && displayContent.includes('[CITATIONS]')) {
        const parts = displayContent.split('[CITATIONS]');
        displayContent = parts[0];
        // Simple regex parsing for text citations if they were sent as text lines
        const citationLines = parts[1].trim().split('\n');
        citationLines.forEach(line => {
            const match = line.match(/\[\d+\]\s+(.+)\s+lines\s+(\d+)-(\d+)/);
            if (match) {
                citations.push({ filepath: match[1], startLine: parseInt(match[2]), endLine: parseInt(match[3]) });
            }
        });
    }

    return (
        <div style={{
            marginBottom: '1rem',
            padding: '0.8rem',
            borderLeft: isAssistant ? '2px solid var(--accent-color)' : '2px solid #555',
            background: isAssistant ? 'rgba(0, 255, 65, 0.03)' : 'transparent',
        }}>
            <div style={{ fontSize: '0.7rem', opacity: 0.5, marginBottom: '0.4rem' }}>
                {isAssistant ? 'ASSISTANT' : 'USER'}
            </div>
            <ReactMarkdown
                components={{
                    code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                            <SyntaxHighlighter
                                style={vscDarkPlus}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        ) : (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        );
                    },
                }}
            >
                {displayContent}
            </ReactMarkdown>
            {citations.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>CITATIONS:</div>
                    {citations.map((c, i) => (
                        <CitationCard key={i} {...c} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MessageBubble;
