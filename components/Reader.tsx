
import React, { useMemo } from 'react';
import type { Book } from '../types';
import { getFileExtension } from '../utils/fileUtils';
import { EpubViewer } from './EpubViewer';
import { PdfViewer } from './PdfViewer';
import { TxtViewer } from './TxtViewer';
import { UnsupportedViewer } from './UnsupportedViewer';

interface ReaderProps {
  book: Book;
}

export const Reader: React.FC<ReaderProps> = ({ book }) => {
  const fileExtension = useMemo(() => getFileExtension(book.name), [book.name]);

  const renderBook = () => {
    switch (fileExtension) {
      case 'epub':
        return <EpubViewer data={book.data} />;
      case 'pdf':
        return <PdfViewer data={book.data} />;
      case 'txt':
        return <TxtViewer data={book.data} />;
      default:
        return <UnsupportedViewer filename={book.name} />;
    }
  };

  return (
    <div className="w-full h-[calc(100vh-140px)] flex flex-col items-center justify-center">
        {renderBook()}
    </div>
  );
};
