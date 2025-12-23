
import React, { useState, useEffect } from 'react';
import { Spinner } from './Spinner.js';

export const TxtViewer = ({ data }) => {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      setText(e.target?.result);
      setIsLoading(false);
    };
    reader.onerror = () => {
      setText('Error reading file.');
      setIsLoading(false);
    }
    reader.readAsText(data);
  }, [data]);

  return React.createElement(
    "div",
    { className: "w-full h-full bg-gray-800 p-6 rounded-lg shadow-lg overflow-y-auto" },
    isLoading ? (
      React.createElement(
        "div",
        { className: "flex items-center justify-center h-full" },
        React.createElement(Spinner, null)
      )
    ) : (
      React.createElement(
        "pre",
        { className: "whitespace-pre-wrap text-gray-200 font-serif text-lg leading-relaxed" },
        text
      )
    )
  );
};