
import React, { useState } from 'react';
import { BookCard } from './BookCard.js';
import { GoogleDrivePicker } from './GoogleDrivePicker.js';
import { GoogleDriveIcon } from './icons/GoogleDriveIcon.js';
import { TrashIcon } from './icons/TrashIcon.js';

export const Library = ({ 
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


  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      "div",
      { className: "mb-8 bg-gray-800/50 border border-gray-700 rounded-xl p-4 sm:p-6 shadow-sm" },
      React.createElement(
        "div",
        { className: "flex flex-col lg:flex-row lg:items-center justify-between gap-6" },
        React.createElement(
          "div",
          { className: "flex-grow space-y-4" },
          React.createElement(
            "div",
            null,
            React.createElement(
              "div",
              { className: "flex justify-between items-center mb-1" },
              React.createElement(
                "label",
                { className: "block text-xs font-bold text-gray-500 uppercase tracking-widest" },
                "OAuth Client ID"
              ),
              saveIdSuccess && React.createElement(
                "span",
                { className: "text-xs text-green-400 font-bold" },
                "\u2713 Updated!"
              )
            ),
            isEditingId ? (
              React.createElement(
                "div",
                { className: "flex gap-2" },
                React.createElement("input", { type: "text", value: newIdInput, onChange: (e) => setNewIdInput(e.target.value), className: "flex-grow bg-gray-900 border border-indigo-500/50 rounded-lg px-3 py-2 text-sm font-mono text-indigo-200 focus:outline-none ring-2 ring-indigo-500/20" }),
                React.createElement(
                  "button",
                  { onClick: handleUpdateId, className: "bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors" },
                  "Save"
                ),
                React.createElement(
                  "button",
                  { onClick: () => { setIsEditingId(false); setNewIdInput(googleClientId); }, className: "bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors" },
                  "Cancel"
                )
              )
            ) : (
              React.createElement(
                "div",
                { className: "flex items-center gap-3" },
                React.createElement(
                  "code",
                  { className: "bg-gray-900/80 px-3 py-2 rounded-lg text-indigo-300 font-mono text-xs overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px] sm:max-w-md border border-gray-700" },
                  googleClientId
                ),
                React.createElement(
                  "button",
                  { onClick: () => setIsEditingId(true), className: "text-xs text-indigo-400 hover:text-indigo-300 font-bold underline decoration-dotted" },
                  "Change"
                )
              )
            )
          ),
          React.createElement(
            "div",
            null,
            React.createElement(
              "div",
              { className: "flex justify-between items-center mb-1" },
              React.createElement(
                "label",
                { className: "block text-xs font-bold text-gray-500 uppercase tracking-widest" },
                "Google Cloud API Key"
              ),
              saveApiKeySuccess && React.createElement(
                "span",
                { className: "text-xs text-green-400 font-bold" },
                "\u2713 Updated!"
              )
            ),
            isEditingApiKey ? (
              React.createElement(
                "div",
                { className: "flex gap-2" },
                React.createElement("input", { type: "text", value: newApiKeyInput, onChange: (e) => setNewApiKeyInput(e.target.value), className: "flex-grow bg-gray-900 border border-indigo-500/50 rounded-lg px-3 py-2 text-sm font-mono text-indigo-200 focus:outline-none ring-2 ring-indigo-500/20" }),
                React.createElement(
                  "button",
                  { onClick: handleUpdateApiKey, className: "bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors" },
                  "Save"
                ),
                React.createElement(
                  "button",
                  { onClick: () => { setIsEditingApiKey(false); setNewApiKeyInput(googleApiKey); }, className: "bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors" },
                  "Cancel"
                )
              )
            ) : (
              React.createElement(
                "div",
                { className: "flex items-center gap-3" },
                React.createElement(
                  "code",
                  { className: "bg-gray-900/80 px-3 py-2 rounded-lg text-indigo-300 font-mono text-xs overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px] sm:max-w-md border border-gray-700" },
                  googleApiKey
                ),
                React.createElement(
                  "button",
                  { onClick: () => setIsEditingApiKey(true), className: "text-xs text-indigo-400 hover:text-indigo-300 font-bold underline decoration-dotted" },
                  "Change"
                )
              )
            )
          )
        ),
        React.createElement(
          "div",
          { className: "flex items-center gap-2 border-t lg:border-t-0 lg:border-l border-gray-700 pt-4 lg:pt-0 lg:pl-6" },
          React.createElement(
            "button",
            { onClick: () => setIsPickerOpen(true), className: "flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-lg shadow-indigo-500/10 active:scale-95" },
            React.createElement(GoogleDriveIcon, { className: "h-5 w-5" }),
            React.createElement(
              "span",
              null,
              "Import from Drive"
            )
          ),
          books.length > 0 &&
            React.createElement(
              "button",
              { onClick: handleConfirmClear, className: "bg-red-900/20 hover:bg-red-600 text-red-500 hover:text-white border border-red-900/50 p-2.5 rounded-xl transition-all", title: "Clear Library" },
              React.createElement(TrashIcon, { className: "h-5 w-5" })
            )
        )
      )
    ),
    React.createElement(
      "div",
      { className: "flex items-center justify-between mb-6" },
      React.createElement(
        "h2",
        { className: "text-3xl font-bold text-gray-100" },
        "My Library"
      ),
      React.createElement(
        "span",
        { className: "text-sm text-gray-500 font-medium bg-gray-800 px-3 py-1 rounded-full border border-gray-700" },
        books.length,
        " ",
        books.length === 1 ? 'Book' : 'Books'
      )
    ),
    books.length > 0 ? (
      React.createElement(
        "div",
        { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6" },
        books.map((book) =>
          React.createElement(BookCard, { key: book.id, book: book, onSelect: onSelectBook, onDelete: onDeleteBook })
        )
      )
    ) : (
      React.createElement(
        "div",
        { className: "text-center py-20 px-6 border-2 border-dashed border-gray-800 rounded-2xl bg-gray-800/20" },
        React.createElement(
          "div",
          { className: "bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700" },
          React.createElement(GoogleDriveIcon, { className: "h-8 w-8 text-gray-600" })
        ),
        React.createElement(
          "h3",
          { className: "text-xl font-semibold text-gray-400" },
          "Library is Empty"
        ),
        React.createElement(
          "p",
          { className: "text-gray-500 mt-2 max-w-sm mx-auto" },
          "Import your EPUB, PDF, or TXT files from Google Drive to start building your collection."
        )
      )
    ),
    isPickerOpen &&
      React.createElement(GoogleDrivePicker, {
        clientId: googleClientId,
        apiKey: googleApiKey,
        onClose: () => setIsPickerOpen(false),
        onFileSelect: onAddBook
      })
  );
};