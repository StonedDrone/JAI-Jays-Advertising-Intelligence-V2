
import React, { useState } from 'react';
import PlusIcon from './icons/PlusIcon';
import LoadingSpinner from './icons/LoadingSpinner';

interface CodexFormProps {
  onAddCodexEntry: (source: string, summary: string) => Promise<void>;
  isLoading: boolean;
}

const CodexForm: React.FC<CodexFormProps> = ({ onAddCodexEntry, isLoading }) => {
  const [source, setSource] = useState('');
  const [summary, setSummary] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!source.trim() || !summary.trim() || isLoading) return;
    onAddCodexEntry(source, summary).then(() => {
      setSource('');
      setSummary('');
    });
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 space-y-4"
      >
        <div>
          <label htmlFor="codex-source" className="block text-sm font-medium text-gray-300 mb-1">
            Source / Title
          </label>
          <input
            id="codex-source"
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="e.g., FuX Script 001"
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow"
            required
          />
        </div>
        <div>
          <label htmlFor="codex-summary" className="block text-sm font-medium text-gray-300 mb-1">
            Content / Summary
          </label>
          <input
            id="codex-summary"
            type="text"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Core brand philosophy document"
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:from-cyan-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          {isLoading ? (
            <LoadingSpinner className="h-5 w-5" />
          ) : (
            <>
              <PlusIcon className="w-5 h-5 mr-2" />
              Assimilate into Codex
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CodexForm;
