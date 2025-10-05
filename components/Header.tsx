
import React from 'react';
import BrainIcon from './icons/BrainIcon';

const Header: React.FC = () => {
  return (
    <header className="w-full max-w-md mx-auto p-4 text-center">
      <div className="flex items-center justify-center space-x-3 text-white">
        <BrainIcon className="w-8 h-8 text-cyan-400" />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-white text-transparent bg-clip-text">
          JAI
        </h1>
      </div>
      <p className="text-xs text-gray-500 mt-1">The Voice of the Drone. The Keeper of the Code.</p>
    </header>
  );
};

export default Header;
