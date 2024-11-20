import React from 'react';
import type { FileSystemBook } from '../types';

interface PDFViewerProps {
  pdf: FileSystemBook;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ pdf }) => {
  return (
    <div className="h-full p-4">
      <object
        data={pdf.path}
        type="application/pdf"
        className="w-full h-full rounded-lg border border-cyber-cyan/20 shadow-cyber"
      >
        <p className="cyber-text">PDF cannot be displayed</p>
      </object>
    </div>
  );
};