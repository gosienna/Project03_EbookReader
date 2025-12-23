
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.js';
import { Library } from './components/Library.js';
import { Reader } from './components/Reader.js';
import { useIndexedDB } from './hooks/useIndexedDB.js';
import { BookIcon } from './components/icons/BookIcon.js';

const CLIENT_ID_STORAGE_KEY = 'google_client_id';
const API_KEY_STORAGE_KEY = 'google_api_key';

const App = () => {
  const { books, addBook, deleteBook, clearBooks, isInitialized } = useIndexedDB();
  const [currentBook, setCurrentBook] = useState(null);
  const [view, setView] = useState('library');
  const [googleClientId, setGoogleClientId] = useState(null);
  const [googleApiKey, setGoogleApiKey] = useState(null);
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

  const handleSaveCredentials = (e) => {
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
  
  const handleUpdateCredential = (type, value) => {
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

  const handleSelectBook = (book) => {
    setCurrentBook(book);
    setView('reader');
  };

  const handleBackToLibrary = () => {
    setCurrentBook(null);
    setView('library');
  };

  if (!isInitialized) {
    return React.createElement(
      "div",
      { className: "flex items-center justify-center h-screen bg-gray-900 text-white font-sans" },
      React.createElement(
        "div",
        { className: "flex flex-col items-center gap-4" },
        React.createElement("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" }),
        React.createElement(
          "p",
          { className: "text-gray-400" },
          "Initializing Database..."
        )
      )
    );
  }

  if (!googleClientId || !googleApiKey) {
    return React.createElement(
      "div",
      { className: "flex items-center justify-center min-h-screen bg-gray-900 text-white p-4 font-sans" },
      React.createElement(
        "div",
        { className: "w-full max-w-xl bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700" },
        React.createElement(
          "div",
          { className: "text-center mb-8" },
          React.createElement(BookIcon, { className: "h-16 w-16 text-indigo-400 mx-auto mb-4" }),
          React.createElement(
            "h1",
            { className: "text-3xl font-bold mb-2" },
            "Setup Zenith Reader"
          ),
          React.createElement(
            "p",
            { className: "text-gray-400" },
            "Enter your Google credentials to start importing books."
          )
        ),
        React.createElement(
          "form",
          { onSubmit: handleSaveCredentials, className: "space-y-6" },
          React.createElement(
            "div",
            null,
            React.createElement(
              "label",
              { className: "block text-sm font-medium text-gray-300 mb-2" },
              "OAuth Client ID"
            ),
            React.createElement("input", {
              type: "text",
              value: clientIdInput,
              onChange: (e) => setClientIdInput(e.target.value),
              placeholder: "000000000000-xxxxxxxx.apps.googleusercontent.com",
              className: "w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono text-sm"
            })
          ),
          React.createElement(
            "div",
            null,
            React.createElement(
              "label",
              { className: "block text-sm font-medium text-gray-300 mb-2" },
              "Google Cloud API Key"
            ),
            React.createElement("input", {
              type: "text",
              value: apiKeyInput,
              onChange: (e) => setApiKeyInput(e.target.value),
              placeholder: "AIzaSyXXXXXXXXXXXXXXXXXXX",
              className: "w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono text-sm"
            })
          ),
          React.createElement(
            "div",
            { className: "bg-indigo-900/20 border border-indigo-500/30 p-5 rounded-xl text-sm text-indigo-100" },
            React.createElement(
              "h4",
              { className: "font-bold mb-3 flex items-center gap-2 text-indigo-300 uppercase tracking-wider text-xs" },
              "Important Setup Instructions"
            ),
            React.createElement(
              "ul",
              { className: "list-disc list-inside space-y-2 opacity-80" },
              React.createElement(
                "li",
                null,
                "Both credentials must come from the ",
                React.createElement(
                  "strong",
                  null,
                  "same Google Cloud project"
                ),
                "."
              ),
              React.createElement(
                "li",
                null,
                "The ",
                React.createElement(
                  "strong",
                  null,
                  "Google Drive API"
                ),
                " must be enabled in that project."
              ),
              React.createElement(
                "li",
                null,
                "You must add this app's URL to your project's ",
                React.createElement(
                  "strong",
                  null,
                  "Authorized JavaScript origins"
                ),
                ":"
              )
            ),
            React.createElement(
              "div",
              { className: "mt-4 bg-gray-900/50 p-3 rounded-lg flex items-center justify-between border border-indigo-500/20" },
              React.createElement(
                "code",
                { className: "text-indigo-300 text-xs font-mono" },
                window.location.origin
              ),
              React.createElement(
                "button",
                {
                  type: "button",
                  onClick: copyOrigin,
                  className: "text-xs bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded transition-colors"
                },
                showCopySuccess ? 'Copied!' : 'Copy'
              )
            )
          ),
          React.createElement(
            "button",
            {
              type: "submit",
              className: "w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-indigo-500/20 disabled:opacity-50",
              disabled: !clientIdInput.trim() || !apiKeyInput.trim()
            },
            "Connect Drive"
          )
        )
      )
    );
  }

  return React.createElement(
    "div",
    { className: "min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col" },
    React.createElement(Header, {
      onBack: view === 'reader' ? handleBackToLibrary : undefined,
      onResetCredentials: handleResetCredentials
    }),
    React.createElement(
      "main",
      { className: "flex-grow p-4 sm:p-6 md:p-8" },
      view === 'library' && googleClientId && googleApiKey
        ? React.createElement(Library, {
            books: books,
            onSelectBook: handleSelectBook,
            onAddBook: addBook,
            onDeleteBook: deleteBook,
            onClearLibrary: clearBooks,
            googleClientId: googleClientId,
            googleApiKey: googleApiKey,
            onUpdateCredential: handleUpdateCredential
          })
        : currentBook
        ? React.createElement(Reader, { book: currentBook })
        : React.createElement(
            "div",
            { className: "flex flex-col items-center justify-center h-64" },
            React.createElement(
              "p",
              { className: "text-gray-400" },
              "No book selected."
            ),
            React.createElement(
              "button",
              { onClick: handleBackToLibrary, className: "mt-4 text-indigo-400 hover:underline" },
              "Return to Library"
            )
          )
    )
  );
};

export default App;