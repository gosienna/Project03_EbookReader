
import React, { useMemo } from 'react';

interface PdfViewerProps {
  data: Blob;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ data }) => {
  const objectUrl = useMemo(() => URL.createObjectURL(data), [data]);

  return (
    <div className="w-full h-full bg-gray-800 rounded-lg shadow-lg">
      <iframe
        src={objectUrl}
        title="PDF Viewer"
        className="w-full h-full border-none rounded-lg"
      />
    </div>
  );
};
