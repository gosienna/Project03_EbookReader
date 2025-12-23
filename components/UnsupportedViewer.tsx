
import React from 'react';
import { getFileExtension } from '../utils/fileUtils';

interface UnsupportedViewerProps {
  filename: string;
}

export const UnsupportedViewer: React.FC<UnsupportedViewerProps> = ({ filename }) => {
  const extension = getFileExtension(filename).toUpperCase();

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-gray-800 p-8 rounded-lg text-center">
      <h2 className="text-2xl font-bold text-red-400">Unsupported File Format</h2>
      <p className="mt-2 text-gray-300">
        Sorry, we can't display <span className="font-mono bg-gray-700 px-2 py-1 rounded">{extension}</span> files.
      </p>
      <p className="mt-4 text-gray-400 text-sm">
        Supported formats are EPUB, PDF, and TXT.
      </p>
    </div>
  );
};
