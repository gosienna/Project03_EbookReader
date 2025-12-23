
import React from 'react';
import { formatBytes, getFileExtension } from '../utils/fileUtils.js';
import { BookIcon } from './icons/BookIcon.js';
import { TrashIcon } from './icons/TrashIcon.js';

export const BookCard = ({ book, onSelect, onDelete }) => {
  const fileExtension = getFileExtension(book.name);

  const handleDelete = (e) => {
    e.stopPropagation();
    if(window.confirm(`Are you sure you want to delete "${book.name}"?`)){
        onDelete(book.id);
    }
  }

  return React.createElement(
    "div",
    {
      className: "bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer group transition-all duration-300 transform hover:-translate-y-1 hover:shadow-indigo-500/30",
      onClick: () => onSelect(book)
    },
    React.createElement(
      "div",
      { className: "relative p-4 bg-gray-700 h-40 flex items-center justify-center" },
      React.createElement(BookIcon, { className: "h-20 w-20 text-gray-500 group-hover:text-indigo-400 transition-colors duration-300" }),
      React.createElement(
        "span",
        { className: "absolute top-2 right-2 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded" },
        fileExtension.toUpperCase()
      ),
      React.createElement(
        "button",
        {
          onClick: handleDelete,
          className: "absolute bottom-2 right-2 p-2 rounded-full bg-red-600/50 text-white opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all duration-300",
          title: "Delete Book"
        },
        React.createElement(TrashIcon, { className: "h-4 w-4" })
      )
    ),
    React.createElement(
      "div",
      { className: "p-4" },
      React.createElement(
        "h3",
        { className: "font-bold text-md text-gray-100 truncate", title: book.name },
        book.name
      ),
      React.createElement(
        "p",
        { className: "text-sm text-gray-400" },
        formatBytes(book.size)
      )
    )
  );
};