
import React, { useState, useEffect } from 'react';
import { Spinner } from './Spinner';

interface TxtViewerProps {
  data: Blob;
}

export const TxtViewer: React.FC<TxtViewerProps> = ({ data }) => {
  const [text, setText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      setText(e.target?.result as string);
      setIsLoading(false);
    };
    reader.onerror = () => {
      setText('Error reading file.');
      setIsLoading(false);
    }
    reader.readAsText(data);
  }, [data]);

  return (
    <div className="w-full h-full bg-gray-800 p-6 rounded-lg shadow-lg overflow-y-auto">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
            <Spinner />
        </div>
      ) : (
        <pre className="whitespace-pre-wrap text-gray-200 font-serif text-lg leading-relaxed">
          {text}
        </pre>
      )}
    </div>
  );
};
