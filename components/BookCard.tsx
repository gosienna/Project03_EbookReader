
import React from 'react';
import type { Book } from '../types';
import { formatBytes, getFileExtension } from '../utils/fileUtils';
import { BookIcon } from './icons/BookIcon';
import { TrashIcon } from './icons/TrashIcon';

interface BookCardProps {
  book: Book;
  onSelect: (book: Book) => void;
  onDelete: (id: number) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onSelect, onDelete }) => {
  const fileExtension = getFileExtension(book.name);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if(window.confirm(`Are you sure you want to delete "${book.name}"?`)){
        onDelete(book.id);
    }
  }

  return (
    <div
      className="bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer group transition-all duration-300 transform hover:-translate-y-1 hover:shadow-indigo-500/30"
      onClick={() => onSelect(book)}
    >
      <div className="relative p-4 bg-gray-700 h-40 flex items-center justify-center">
        <BookIcon className="h-20 w-20 text-gray-500 group-hover:text-indigo-400 transition-colors duration-300" />
        <span className="absolute top-2 right-2 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded">
          {fileExtension.toUpperCase()}
        </span>
         <button 
            onClick={handleDelete}
            className="absolute bottom-2 right-2 p-2 rounded-full bg-red-600/50 text-white opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all duration-300"
            title="Delete Book"
        >
            <TrashIcon className="h-4 w-4" />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-md text-gray-100 truncate" title={book.name}>
          {book.name}
        </h3>
        <p className="text-sm text-gray-400">{formatBytes(book.size)}</p>
      </div>
    </div>
  );
};
