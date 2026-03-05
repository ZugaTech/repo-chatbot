import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import MessageBubble from './MessageBubble';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

interface ChatWindowProps {
    messages: Message[];
    onSendMessage: (query: string) => void;
    isStreaming: boolean;
    disabled: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage, isStreaming, disabled }) => {
    const [query, setQuery] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim() && !disabled && !isStreaming) {
            onSendMessage(query.trim());
            setQuery('');
        }
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="terminal-window" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div className="terminal-header">
                <span>REPOCB://CHAT_SESSION</span>
                <span>{isStreaming ? '[STREAMING...]' : '[READY]'}</span>
            </div>

            <div
                ref={scrollRef}
                style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem', paddingRight: '0.5rem' }}
            >
                {messages.length === 0 && (
                    <div style={{ opacity: 0.3, textAlign: 'center', marginTop: '2rem' }}>
                        Enter a query to start analyzing the repository...
                    </div>
                )}
                {messages.map((m) => (
                    <MessageBubble key={m.id} message={m} />
                ))}
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent-color)' }}>{'>'}</span>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask about the code..."
                    disabled={disabled || isStreaming}
                    autoFocus
                />
                <button type="submit" disabled={disabled || isStreaming || !query.trim()}>
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;
