
import React, { useState } from 'react';
import Header from './components/Header';
import RepoForm from './components/RepoForm';
import RepoList from './components/RepoList';
import ChatView from './components/ChatView';
import SystemView from './components/SystemView';
import useLocalStorage from './hooks/useLocalStorage';
import { assimilateRepoEntry } from './services/geminiService';
import { RepoEntry, AppView } from './types';
import BrainIcon from './components/icons/BrainIcon';
import ChatIcon from './components/icons/ChatIcon';
import CodeIcon from './components/icons/CodeIcon';

const App: React.FC = () => {
  const [repoEntries, setRepoEntries] = useLocalStorage<RepoEntry[]>('jai-repo-entries', []);
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<AppView>(AppView.REPOS);

  const handleAddRepoEntry = async (source: string, summary: string) => {
    setIsLoading(true);
    try {
      const newProtocol = await assimilateRepoEntry(source, summary);
      const newEntry: RepoEntry = {
        id: new Date().toISOString(),
        source,
        summary,
        protocolName: newProtocol.protocolName,
        capabilityDescription: newProtocol.capabilityDescription,
      };
      setRepoEntries(prevEntries => [newEntry, ...prevEntries]);
    } catch (error) {
      console.error("Failed to add repo entry:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderView = () => {
    switch (view) {
      case AppView.CHAT:
        return <ChatView repos={repoEntries} />;
      case AppView.SYSTEM:
        return <SystemView />;
      case AppView.REPOS:
      default:
        return (
          <>
            <RepoForm onAddRepoEntry={handleAddRepoEntry} isLoading={isLoading} />
            <div className="w-full max-w-md mx-auto px-4 pb-4">
              <h2 className="text-lg font-semibold text-gray-300 mb-3">Integrated Protocols</h2>
              <RepoList entries={repoEntries} />
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
            <span className="text-xs mt-1">Repos</span>
          </button>
          <button
            onClick={() => setView(AppView.CHAT)}
            className={`flex flex-col items-center px-4 py-2 rounded-lg transition-colors ${view === AppView.CHAT ? 'text-cyan-400' : 'text-gray-500 hover:text-cyan-400'}`}
          >
            <ChatIcon className="w-6 h-6" />
            <span className="text-xs mt-1">Chat</span>
          </button>
           <button
            onClick={() => setView(AppView.SYSTEM)}
            className={`flex flex-col items-center px-4 py-2 rounded-lg transition-colors ${view === AppView.SYSTEM ? 'text-cyan-400' : 'text-gray-500 hover:text-cyan-400'}`}
          >
            <CodeIcon className="w-6 h-6" />
            <span className="text-xs mt-1">System</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default App;
