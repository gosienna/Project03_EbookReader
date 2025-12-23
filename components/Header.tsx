
import React from 'react';
import { BookIcon } from './icons/BookIcon';

interface HeaderProps {
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onBack }) => {
  return (
    <header className="bg-gray-800 shadow-md p-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        {onBack && (
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-white transition-colors duration-200"
            aria-label="Back to Library"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <div className="flex items-center space-x-2">
            <BookIcon className="h-8 w-8 text-indigo-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Zenith Reader</h1>
        </div>
      </div>
    </header>
  );
};
