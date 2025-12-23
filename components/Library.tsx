
import React, { useState } from 'react';
import type { Book } from '../types';
import { BookCard } from './BookCard';
import { GoogleDrivePicker } from './GoogleDrivePicker';
import { GoogleDriveIcon } from './icons/GoogleDriveIcon';
import { TrashIcon } from './icons/TrashIcon';

interface LibraryProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
  onAddBook: (name: string, type: string, data: Blob) => Promise<void>;
  onDeleteBook: (id: number) => void;
  onClearLibrary: () => void;
  googleClientId: string;
  googleApiKey: string;
  onUpdateCredential: (type: 'clientId' | 'apiKey', value: string) => void;
}

export const Library: React.FC<LibraryProps> = ({ 
  books, 
  onSelectBook, 
  onAddBook, 
  onDeleteBook, 
  onClearLibrary, 
  googleClientId,
  googleApiKey,
  onUpdateCredential,
}) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [newIdInput, setNewIdInput] = useState(googleClientId);
  const [isEditingId, setIsEditingId] = useState(false);
  const [saveIdSuccess, setSaveIdSuccess] = useState(false);

  const [newApiKeyInput, setNewApiKeyInput] = useState(googleApiKey);
  const [isEditingApiKey, setIsEditingApiKey] = useState(false);
  const [saveApiKeySuccess, setSaveApiKeySuccess] = useState(false);


  const handleConfirmClear = () => {
    if (window.confirm('Are you sure you want to delete all books from your local library? This action cannot be undone.')) {
        onClearLibrary();
    }
  }

  const handleUpdateId = () => {
    const trimmedId = newIdInput.trim();
    if (trimmedId && trimmedId !== googleClientId) {
        onUpdateCredential('clientId', trimmedId);
        setIsEditingId(false);
        setSaveIdSuccess(true);
        setTimeout(() => setSaveIdSuccess(false), 2500);
    } else {
        setIsEditingId(false);
    }
  };
  
  const handleUpdateApiKey = () => {
    const trimmedApiKey = newApiKeyInput.trim();
    if (trimmedApiKey && trimmedApiKey !== googleApiKey) {
        onUpdateCredential('apiKey', trimmedApiKey);
        setIsEditingApiKey(false);
        setSaveApiKeySuccess(true);
        setTimeout(() => setSaveApiKeySuccess(false), 2500);
    } else {
        setIsEditingApiKey(false);
    }
  };


  return (
    <>
      <div className="mb-8 bg-gray-800/50 border border-gray-700 rounded-xl p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex-grow space-y-4">
                {/* Client ID Section */}
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">OAuth Client ID</label>
                        {saveIdSuccess && <span className="text-xs text-green-400 font-bold">✓ Updated!</span>}
                    </div>
                    {isEditingId ? (
                        <div className="flex gap-2">
                            <input type="text" value={newIdInput} onChange={(e) => setNewIdInput(e.target.value)} className="flex-grow bg-gray-900 border border-indigo-500/50 rounded-lg px-3 py-2 text-sm font-mono text-indigo-200 focus:outline-none ring-2 ring-indigo-500/20"/>
                            <button onClick={handleUpdateId} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">Save</button>
                            <button onClick={() => { setIsEditingId(false); setNewIdInput(googleClientId); }} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">Cancel</button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <code className="bg-gray-900/80 px-3 py-2 rounded-lg text-indigo-300 font-mono text-xs overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px] sm:max-w-md border border-gray-700">{googleClientId}</code>
                            <button onClick={() => setIsEditingId(true)} className="text-xs text-indigo-400 hover:text-indigo-300 font-bold underline decoration-dotted">Change</button>
                        </div>
                    )}
                </div>
                {/* API Key Section */}
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Google Cloud API Key</label>
                        {saveApiKeySuccess && <span className="text-xs text-green-400 font-bold">✓ Updated!</span>}
                    </div>
                     {isEditingApiKey ? (
                        <div className="flex gap-2">
                            <input type="text" value={newApiKeyInput} onChange={(e) => setNewApiKeyInput(e.target.value)} className="flex-grow bg-gray-900 border border-indigo-500/50 rounded-lg px-3 py-2 text-sm font-mono text-indigo-200 focus:outline-none ring-2 ring-indigo-500/20"/>
                            <button onClick={handleUpdateApiKey} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">Save</button>
                            <button onClick={() => { setIsEditingApiKey(false); setNewApiKeyInput(googleApiKey); }} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">Cancel</button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <code className="bg-gray-900/80 px-3 py-2 rounded-lg text-indigo-300 font-mono text-xs overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px] sm:max-w-md border border-gray-700">{googleApiKey}</code>
                            <button onClick={() => setIsEditingApiKey(true)} className="text-xs text-indigo-400 hover:text-indigo-300 font-bold underline decoration-dotted">Change</button>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="flex items-center gap-2 border-t lg:border-t-0 lg:border-l border-gray-700 pt-4 lg:pt-0 lg:pl-6">
                <button onClick={() => setIsPickerOpen(true)} className="flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-lg shadow-indigo-500/10 active:scale-95">
                    <GoogleDriveIcon className="h-5 w-5" />
                    <span>Import from Drive</span>
                </button>
                {books.length > 0 && (
                    <button onClick={handleConfirmClear} className="bg-red-900/20 hover:bg-red-600 text-red-500 hover:text-white border border-red-900/50 p-2.5 rounded-xl transition-all" title="Clear Library">
                        <TrashIcon className="h-5 w-5" />
                    </button>
                )}
            </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-100">My Library</h2>
        <span className="text-sm text-gray-500 font-medium bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
          {books.length} {books.length === 1 ? 'Book' : 'Books'}
        </span>
      </div>

      {books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} onSelect={onSelectBook} onDelete={onDeleteBook} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 px-6 border-2 border-dashed border-gray-800 rounded-2xl bg-gray-800/20">
          <div className="bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700">
            <GoogleDriveIcon className="h-8 w-8 text-gray-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-400">Library is Empty</h3>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto">Import your EPUB, PDF, or TXT files from Google Drive to start building your collection.</p>
        </div>
      )}

      {isPickerOpen && (
        <GoogleDrivePicker
          clientId={googleClientId}
          apiKey={googleApiKey}
          onClose={() => setIsPickerOpen(false)}
          onFileSelect={onAddBook}
        />
      )}
    </>
  );
};
