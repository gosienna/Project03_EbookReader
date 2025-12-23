
import React, { useEffect, useRef, useState } from 'react';

// epubjs is loaded from a CDN, so we declare it as any
declare const ePub: any;

interface EpubViewerProps {
  data: Blob;
}

export const EpubViewer: React.FC<EpubViewerProps> = ({ data }) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const renditionRef = useRef<any>(null);
  const bookRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (data && viewerRef.current) {
      setIsLoading(true);
      const arrayBufferPromise = data.arrayBuffer();

      arrayBufferPromise.then(arrayBuffer => {
        const book = ePub(arrayBuffer);
        bookRef.current = book;
        const rendition = book.renderTo(viewerRef.current!, {
          width: '100%',
          height: '100%',
          spread: 'auto',
          flow: "paginated",
        });
        renditionRef.current = rendition;
        
        rendition.display().then(() => {
          setIsLoading(false);
        });

      }).catch(err => {
        console.error("Error loading epub: ", err);
        setIsLoading(false);
      });

      return () => {
        if(bookRef.current) {
            bookRef.current.destroy();
        }
      };
    }
  }, [data]);

  const goToNextPage = () => {
    if (renditionRef.current) {
      renditionRef.current.next();
    }
  };

  const goToPrevPage = () => {
    if (renditionRef.current) {
      renditionRef.current.prev();
    }
  };

  return (
    <div className="w-full h-full flex flex-col relative bg-gray-900">
      {isLoading && <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-20"><p>Loading E-book...</p></div>}
      <div ref={viewerRef} className="flex-grow w-full h-full bg-white text-black overflow-hidden" style={{ height: 'calc(100% - 4rem)' }}></div>
      <div className="flex justify-center items-center h-16 bg-gray-800 gap-4">
        <button onClick={goToPrevPage} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors">Previous</button>
        <button onClick={goToNextPage} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors">Next</button>
      </div>
    </div>
  );
};
