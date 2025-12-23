
import React, { useState, useCallback } from 'react';
import type { MockFile } from '../types';
import { Spinner } from './Spinner';

interface GoogleDrivePickerProps {
  onClose: () => void;
  onFileSelect: (name: string, type: string, data: Blob) => Promise<void>;
}

const mockFiles: MockFile[] = [
    { id: '1', name: 'Moby Dick.epub', mimeType: 'application/epub+zip', url: 'https://www.gutenberg.org/ebooks/2701.epub3.images', size: '5.2 MB' },
    { id: '2', name: 'Alice in Wonderland.epub', mimeType: 'application/epub+zip', url: 'https://www.gutenberg.org/ebooks/11.epub3.images', size: '3.4 MB' },
    { id: '3', name: 'The Art of War.pdf', mimeType: 'application/pdf', url: 'https://www.gutenberg.org/files/132/132-pdf.pdf', size: '0.5 MB' },
    { id: '4', name: 'A Tale of Two Cities.txt', mimeType: 'text/plain', url: 'https://www.gutenberg.org/files/98/98-0.txt', size: '0.8 MB' },
    { id: '5', name: 'Frankenstein.mobi', mimeType: 'application/x-mobipocket-ebook', url: '#', size: '0.6 MB' },
    { id: '6', name: 'Dracula.djvu', mimeType: 'image/vnd.djvu', url: '#', size: '12.1 MB' }
];

export const GoogleDrivePicker: React.FC<GoogleDrivePickerProps> = ({ onClose, onFileSelect }) => {
  const [loadingFile, setLoadingFile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (file: MockFile) => {
    if (file.url === '#') {
        alert(`Sorry, the format .${file.name.split('.').pop()} is not supported for rendering.`);
        return;
    }

    setLoadingFile(file.id);
    setError(null);

    try {
      // Using a CORS proxy for fetching, as Gutenberg may block direct client-side requests.
      const response = await fetch(`https://cors-anywhere.herokuapp.com/${file.url}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch book: ${response.statusText}`);
      }
      const blob = await response.blob();
      await onFileSelect(file.name, file.mimeType, blob);
      onClose();
    } catch (err) {
      console.error(err);
      setError('Could not download file. Please try again. Note: A CORS proxy is used for this demo, which may be rate-limited.');
    } finally {
      setLoadingFile(null);
    }
  }, [onFileSelect, onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Select a Book from Drive</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
        </div>
        
        {error && <div className="p-4 bg-red-800 text-white text-center">{error}</div>}

        <div className="p-4 overflow-y-auto">
          <div className="divide-y divide-gray-700">
            {mockFiles.map(file => (
              <div key={file.id} 
                   onClick={() => !loadingFile && handleFileSelect(file)}
                   className={`flex items-center justify-between p-3 rounded-md transition-colors duration-200 ${loadingFile ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-gray-700'}`}>
                <div className="flex items-center gap-4">
                  <div className="text-indigo-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-100">{file.name}</p>
                    <p className="text-sm text-gray-400">{file.size}</p>
                  </div>
                </div>
                {loadingFile === file.id && <Spinner />}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-gray-700 text-center">
            <p className="text-xs text-gray-500">This is a simulated file picker with public domain books from Project Gutenberg.</p>
        </div>
      </div>
    </div>
  );
};
