
import React, { useState, useEffect, FormEvent } from 'react';
import { Header } from './components/Header';
import { Library } from './components/Library';
import { Reader } from './components/Reader';
import { useIndexedDB } from './hooks/useIndexedDB';
import type { Book } from './types';
import { BookIcon } from './components/icons/BookIcon';

const CLIENT_ID_STORAGE_KEY = 'google_client_id';
const API_KEY_STORAGE_KEY = 'google_api_key';

const App: React.FC = () => {
  const { books, addBook, deleteBook, clearBooks, isInitialized } = useIndexedDB();
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [view, setView] = useState<'library' | 'reader'>('library');
  const [googleClientId, setGoogleClientId] = useState<string | null>(null);
  const [googleApiKey, setGoogleApiKey] = useState<string | null>(null);
  const [clientIdInput, setClientIdInput] = useState('');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  useEffect(() => {
    const savedClientId = localStorage.getItem(CLIENT_ID_STORAGE_KEY);
    const savedApiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (savedClientId && savedApiKey) {
      setGoogleClientId(savedClientId);
      setClientIdInput(savedClientId);
      setGoogleApiKey(savedApiKey);
      setApiKeyInput(savedApiKey);
    }
  }, []);

  const handleSaveCredentials = (e: FormEvent) => {
    e.preventDefault();
    const clientIdToSave = clientIdInput.trim();
    const apiKeyToSave = apiKeyInput.trim();
    if (clientIdToSave && apiKeyToSave) {
      try {
        localStorage.setItem(CLIENT_ID_STORAGE_KEY, clientIdToSave);
        localStorage.setItem(API_KEY_STORAGE_KEY, apiKeyToSave);
        setGoogleClientId(clientIdToSave);
        setGoogleApiKey(apiKeyToSave);
      } catch (error) {
        console.error("Failed to save credentials to localStorage:", error);
        alert("Error: Could not save credentials. Your browser's storage might be full or restricted.");
      }
    }
  };
  
  const handleUpdateCredential = (type: 'clientId' | 'apiKey', value: string) => {
    const trimmedValue = value.trim();
    if (!trimmedValue) return;

    try {
        if (type === 'clientId') {
            localStorage.setItem(CLIENT_ID_STORAGE_KEY, trimmedValue);
            setGoogleClientId(trimmedValue);
            setClientIdInput(trimmedValue);
        } else {
            localStorage.setItem(API_KEY_STORAGE_KEY, trimmedValue);
            setGoogleApiKey(trimmedValue);
            setApiKeyInput(trimmedValue);
        }
    } catch (error) {
        console.error(`Failed to save ${type} to localStorage:`, error);
        alert(`Error: Could not save ${type}. Your browser's storage might be full or restricted.`);
    }
};

  const handleResetCredentials = () => {
    if (window.confirm('Reset Google Credentials? This will return you to the setup screen.')) {
      localStorage.removeItem(CLIENT_ID_STORAGE_KEY);
      localStorage.removeItem(API_KEY_STORAGE_KEY);
      setGoogleClientId(null);
      setGoogleApiKey(null);
      setClientIdInput('');
      setApiKeyInput('');
    }
  };

  const copyOrigin = () => {
    const origin = window.location.origin;
    navigator.clipboard.writeText(origin);
    setShowCopySuccess(true);
    setTimeout(() => setShowCopySuccess(false), 2000);
  };

  const handleSelectBook = (book: Book) => {
    setCurrentBook(book);
    setView('reader');
  };

  const handleBackToLibrary = () => {
    setCurrentBook(null);
    setView('library');
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          <p className="text-gray-400">Initializing Database...</p>
        </div>
      </div>
    );
  }

  if (!googleClientId || !googleApiKey) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4 font-sans">
        <div className="w-full max-w-xl bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700">
          <div className="text-center mb-8">
            <BookIcon className="h-16 w-16 text-indigo-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Setup Zenith Reader</h1>
            <p className="text-gray-400">Enter your Google credentials to start importing books.</p>
          </div>
          
          <form onSubmit={handleSaveCredentials} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">OAuth Client ID</label>
              <input
                type="text"
                value={clientIdInput}
                onChange={(e) => setClientIdInput(e.target.value)}
                placeholder="000000000000-xxxxxxxx.apps.googleusercontent.com"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Google Cloud API Key</label>
              <input
                type="text"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="AIzaSyXXXXXXXXXXXXXXXXXXX"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono text-sm"
              />
            </div>

            <div className="bg-indigo-900/20 border border-indigo-500/30 p-5 rounded-xl text-sm text-indigo-100">
              <h4 className="font-bold mb-3 flex items-center gap-2 text-indigo-300 uppercase tracking-wider text-xs">
                Important Setup Instructions
              </h4>
              <ul className="list-disc list-inside space-y-2 opacity-80">
                <li>Both credentials must come from the <strong>same Google Cloud project</strong>.</li>
                <li>The <strong>Google Drive API</strong> must be enabled in that project.</li>
                <li>You must add this app's URL to your project's <strong>Authorized JavaScript origins</strong>:</li>
              </ul>
              
              <div className="mt-4 bg-gray-900/50 p-3 rounded-lg flex items-center justify-between border border-indigo-500/20">
                <code className="text-indigo-300 text-xs font-mono">{window.location.origin}</code>
                <button 
                  type="button"
                  onClick={copyOrigin}
                  className="text-xs bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded transition-colors"
                >
                  {showCopySuccess ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-indigo-500/20 disabled:opacity-50"
              disabled={!clientIdInput.trim() || !apiKeyInput.trim()}
            >
              Connect Drive
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col">
      <Header
        onBack={view === 'reader' ? handleBackToLibrary : undefined}
        onResetCredentials={handleResetCredentials}
      />
      <main className="flex-grow p-4 sm:p-6 md:p-8">
        {view === 'library' && googleClientId && googleApiKey ? (
          <Library
            books={books}
            onSelectBook={handleSelectBook}
            onAddBook={addBook}
            onDeleteBook={deleteBook}
            onClearLibrary={clearBooks}
            googleClientId={googleClientId}
            googleApiKey={googleApiKey}
            onUpdateCredential={handleUpdateCredential}
          />
        ) : currentBook ? (
          <Reader book={currentBook} />
        ) : (
          <div className="flex flex-col items-center justify-center h-64">
             <p className="text-gray-400">No book selected.</p>
             <button onClick={handleBackToLibrary} className="mt-4 text-indigo-400 hover:underline">Return to Library</button>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
