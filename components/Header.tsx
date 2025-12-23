
import React from 'react';
import { BookIcon } from './icons/BookIcon';
import { CogIcon } from './icons/CogIcon';

interface HeaderProps {
  onBack?: () => void;
  onResetCredentials?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onBack, onResetCredentials }) => {
  return (
    <header className="relative z-[100] bg-gray-800 shadow-xl p-4 flex items-center justify-between border-b border-gray-700/50">
      <div className="flex items-center space-x-3">
        {onBack && (
          <button
            onClick={() => onBack()}
            className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors duration-200 rounded-full hover:bg-gray-700 cursor-pointer"
            aria-label="Back to Library"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <div className="flex items-center space-x-2">
            <BookIcon className="h-8 w-8 text-indigo-400 pointer-events-none" />
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight pointer-events-none">Zenith Reader</h1>
        </div>
      </div>
      <div className="flex items-center">
        {onResetCredentials && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onResetCredentials();
            }}
            className="relative z-[110] flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200 p-3 rounded-full hover:bg-gray-700 bg-gray-700/30 border border-gray-600/50 cursor-pointer shadow-inner active:scale-95"
            title="Reset Credentials"
            aria-label="Reset Google Credentials"
          >
            <CogIcon className="h-6 w-6 pointer-events-none" />
          </button>
        )}
      </div>
    </header>
  );
};
