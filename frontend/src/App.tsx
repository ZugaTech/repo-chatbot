import React from 'react';
import { Terminal } from 'lucide-react';
import RepoInput from './components/RepoInput';
import ChatWindow from './components/ChatWindow';
import { useRepoIndexer } from './hooks/useRepoIndexer';
import { useChat } from './hooks/useChat';

function App() {
  const { repoId, status, error, startIndexing } = useRepoIndexer();
  const { messages, isStreaming, sendMessage } = useChat(repoId);

  return (
    <div className="terminal-window" style={{ display: 'flex', flexDirection: 'column', height: '100vh', margin: 0, border: 'none' }}>
      <header className="terminal-header" style={{ padding: '0.5rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Terminal size={20} />
          <span>REPO-CHATBOT v1.0.0</span>
        </div>
        <div style={{ opacity: 0.5, fontSize: '0.8rem' }}>
          {new Date().toLocaleString()}
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1rem', overflow: 'hidden' }}>
        <RepoInput onIndex={startIndexing} status={status} />

        {error && (
          <div style={{ color: 'var(--error-color)', border: '1px solid var(--error-color)', padding: '0.5rem', marginBottom: '1rem' }}>
            [ERROR] {error}
          </div>
        )}

        <ChatWindow
          messages={messages}
          onSendMessage={sendMessage}
          isStreaming={isStreaming}
          disabled={status !== 'ready'}
        />
      </main>

      <footer style={{ borderTop: '1px solid var(--accent-color)', padding: '0.3rem 1rem', fontSize: '0.7rem', opacity: 0.5 }}>
        CONNECTED_TO: {import.meta.env.VITE_API_URL || 'http://localhost:8001'} | TYPE: RAG_ENGINE_GPT4O
      </footer>
    </div>
  );
}

export default App;
