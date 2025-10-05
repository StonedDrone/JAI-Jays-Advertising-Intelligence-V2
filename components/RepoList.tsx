
import React from 'react';
import { RepoEntry } from '../types';
import RepoCard from './RepoCard';

interface RepoListProps {
  entries: RepoEntry[];
}

const RepoList: React.FC<RepoListProps> = ({ entries }) => {
  if (entries.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        <p>The knowledge base is awaiting new directives.</p>
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

export default RepoList;
