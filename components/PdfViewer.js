
import React, { useMemo } from 'react';

export const PdfViewer = ({ data }) => {
  const objectUrl = useMemo(() => URL.createObjectURL(data), [data]);

  return React.createElement(
    "div",
    { className: "w-full h-full bg-gray-800 rounded-lg shadow-lg" },
    React.createElement("iframe", {
      src: objectUrl,
      title: "PDF Viewer",
      className: "w-full h-full border-none rounded-lg"
    })
  );
};