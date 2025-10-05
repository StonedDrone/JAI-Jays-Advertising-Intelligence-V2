
import React from 'react';
import { CodexEntry } from '../types';

interface CodexCardProps {
  entry: CodexEntry;
}

const CodexCard: React.FC<CodexCardProps> = ({ entry }) => {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-5 transform transition-transform duration-300 hover:scale-105 hover:border-cyan-500/50">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-cyan-400 truncate" title={entry.protocolName}>
            {entry.protocolName}
          </p>
          <p className="text-xs text-gray-500 mt-1 truncate" title={entry.source}>{entry.source}</p>
          <p className="text-sm text-gray-300 mt-2">
            {entry.capabilityDescription}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CodexCard;
