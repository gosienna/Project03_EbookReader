
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
}

export const Library: React.FC<LibraryProps> = ({ books, onSelectBook, onAddBook, onDeleteBook, onClearLibrary }) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleConfirmClear = () => {
    if (window.confirm('Are you sure you want to delete all books from your local library? This action cannot be undone.')) {
        onClearLibrary();
    }
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-gray-100">My Library</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPickerOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-transform duration-200 transform hover:scale-105"
          >
            <GoogleDriveIcon className="h-5 w-5" />
            <span>Add from Drive</span>
          </button>
          {books.length > 0 && (
            <button
                onClick={handleConfirmClear}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-transform duration-200 transform hover:scale-105"
                title="Clear entire library"
            >
                <TrashIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} onSelect={onSelectBook} onDelete={onDeleteBook} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-6 border-2 border-dashed border-gray-700 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-400">Your library is empty.</h3>
          <p className="text-gray-500 mt-2">Click "Add from Drive" to import your first e-book.</p>
        </div>
      )}

      {isPickerOpen && (
        <GoogleDrivePicker
          onClose={() => setIsPickerOpen(false)}
          onFileSelect={onAddBook}
        />
      )}
    </>
  );
};
