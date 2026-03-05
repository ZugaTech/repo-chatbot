import { useState } from 'react';
import { chatWithRepo } from '../api/client';

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    citations?: any[];
}

export const useChat = (repoId: string | null) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isStreaming, setIsStreaming] = useState(false);

    const sendMessage = async (query: string) => {
        if (!repoId) return;

        const userMessage: Message = { id: Date.now().toString(), role: 'user', content: query };
        setMessages((prev) => [...prev, userMessage]);

        const assistantId = (Date.now() + 1).toString();
        const assistantMessage: Message = { id: assistantId, role: 'assistant', content: '' };
        setMessages((prev) => [...prev, assistantMessage]);

        setIsStreaming(true);
        let fullContent = '';

        try {
            await chatWithRepo(query, repoId, (token) => {
                fullContent += token;
                setMessages((prev) =>
                    prev.map((m) => (m.id === assistantId ? { ...m, content: fullContent } : m))
                );
            });
        } catch (err) {
            console.error('Chat error:', err);
            setMessages((prev) =>
                prev.map((m) =>
                    m.id === assistantId ? { ...m, content: 'Error: Failed to get response.' } : m
                )
            );
        } finally {
            setIsStreaming(false);
            // Parse citations if present in fullContent
            if (fullContent.includes('[CITATIONS]')) {
                const parts = fullContent.split('[CITATIONS]');
                const mainContent = parts[0].trim();
                // Here we could parse the JSON if the backend sent JSON,
                // but currently it sends a text block.
                // Let's just keep it as text for now.
            }
        }
    };

    return { messages, isStreaming, sendMessage };
};
