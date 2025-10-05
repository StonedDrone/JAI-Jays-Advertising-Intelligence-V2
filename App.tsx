
import React, { useState } from 'react';
import Header from './components/Header';
import RepoForm from './components/RepoForm';
import RepoList from './components/RepoList';
import ChatView from './components/ChatView';
import useLocalStorage from './hooks/useLocalStorage';
import { assimilateCodexEntry } from './services/geminiService';
import { CodexEntry, AppView } from './types';
import BrainIcon from './components/icons/BrainIcon';
import ChatIcon from './components/icons/ChatIcon';

const App: React.FC = () => {
  const [codexEntries, setCodexEntries] = useLocalStorage<CodexEntry[]>('jai-codex-entries', []);
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<AppView>(AppView.REPOS);

  const handleAddCodexEntry = async (source: string, summary: string) => {
    setIsLoading(true);
    try {
      const newProtocol = await assimilateCodexEntry(source, summary);
      const newEntry: CodexEntry = {
        id: new Date().toISOString(),
        source,
        summary,
        protocolName: newProtocol.protocolName,
        capabilityDescription: newProtocol.capabilityDescription,
      };
      setCodexEntries(prevEntries => [newEntry, ...prevEntries]);
    } catch (error) {
      console.error("Failed to add codex entry:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderView = () => {
    switch (view) {
      case AppView.CHAT:
        return <ChatView codex={codexEntries} />;
      case AppView.REPOS:
      default:
        return (
          <>
            <RepoForm onAddCodexEntry={handleAddCodexEntry} isLoading={isLoading} />
            <div className="w-full max-w-md mx-auto px-4 pb-4">
              <h2 className="text-lg font-semibold text-gray-300 mb-3">Integrated Protocols</h2>
              <RepoList entries={codexEntries} />
            </div>
          </>
        );
    }
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans flex flex-col">
      <div 
        className="fixed inset-0 w-full h-full bg-black z-[-1]"
        style={{
          backgroundImage: 'radial-gradient(circle at top right, rgba(20, 184, 166, 0.1), transparent 40%), radial-gradient(circle at bottom left, rgba(124, 58, 237, 0.1), transparent 40%)'
        }}
      />
      <Header />
      <main className="flex-1 flex flex-col overflow-hidden">
        {renderView()}
      </main>
      <nav className="sticky bottom-0 w-full bg-black/50 backdrop-blur-lg border-t border-gray-800">
        <div className="max-w-md mx-auto flex justify-around p-2">
          <button
            onClick={() => setView(AppView.REPOS)}
            className={`flex flex-col items-center px-4 py-2 rounded-lg transition-colors ${view === AppView.REPOS ? 'text-cyan-400' : 'text-gray-500 hover:text-cyan-400'}`}
          >
            <BrainIcon className="w-6 h-6" />
            <span className="text-xs mt-1">Codex</span>
          </button>
          <button
            onClick={() => setView(AppView.CHAT)}
            className={`flex flex-col items-center px-4 py-2 rounded-lg transition-colors ${view === AppView.CHAT ? 'text-cyan-400' : 'text-gray-500 hover:text-cyan-400'}`}
          >
            <ChatIcon className="w-6 h-6" />
            <span className="text-xs mt-1">Chat</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default App;
