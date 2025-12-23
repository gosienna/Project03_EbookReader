
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Library } from './components/Library';
import { Reader } from './components/Reader';
import { useIndexedDB } from './hooks/useIndexedDB';
import type { Book } from './types';

const App: React.FC = () => {
  const { books, addBook, deleteBook, clearBooks, isInitialized } = useIndexedDB();
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [view, setView] = useState<'library' | 'reader'>('library');

  const handleSelectBook = (book: Book) => {
    setCurrentBook(book);
    setView('reader');
  };

  const handleBackToLibrary = () => {
    setCurrentBook(null);
    setView('library');
  };

  useEffect(() => {
    if (view === 'library') {
      document.title = 'Zenith Reader - Library';
    } else if (currentBook) {
      document.title = `Reading: ${currentBook.name}`;
    }
  }, [view, currentBook]);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <p>Initializing Book Database...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header onBack={view === 'reader' ? handleBackToLibrary : undefined} />
      <main className="p-4 sm:p-6 md:p-8">
        {view === 'library' ? (
          <Library
            books={books}
            onSelectBook={handleSelectBook}
            onAddBook={addBook}
            onDeleteBook={deleteBook}
            onClearLibrary={clearBooks}
          />
        ) : currentBook ? (
          <Reader book={currentBook} />
        ) : (
          <p>No book selected.</p>
        )}
      </main>
    </div>
  );
};

export default App;
