
import React from 'react';
import { CodexEntry } from '../types';
import RepoCard from './RepoCard';

interface CodexListProps {
  entries: CodexEntry[];
}

const CodexList: React.FC<CodexListProps> = ({ entries }) => {
  if (entries.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        <p>The Codex is awaiting new directives.</p>
        <p className="text-sm">Add a new entry to enhance JAI's protocols.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto px-4 space-y-3">
      {entries.map((entry) => (
        <RepoCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
};

export default CodexList;
