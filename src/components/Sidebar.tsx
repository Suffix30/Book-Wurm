import React from 'react';
import { X, Loader2 } from 'lucide-react';
import { PDFDocument } from '../types';

interface SidebarProps {
  pdfs: PDFDocument[];
  selected: PDFDocument | null;
  onSelect: (pdf: PDFDocument) => void;
  onClose: () => void;
  isLoading: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ pdfs, selected, onSelect, onClose, isLoading }) => {
  if (isLoading) {
    return (
      <div className="w-72 bg-cyber-darkGray h-full border-r border-cyber-cyan/20 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyber-cyan animate-spin" />
        <p className="mt-2 text-cyber-cyan">ScoobyDoo Where are YOU...</p>
      </div>
    );
  }

  return (
    <div className="w-72 bg-cyber-darkGray h-full border-r border-cyber-cyan/20 flex flex-col">
      <div className="p-4 border-b border-cyber-cyan/20 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-cyber-cyan cyber-glow">Library</h2>
        <button
          onClick={onClose}
          className="lg:hidden p-2 rounded-md hover:bg-cyber-darkGray/50 text-cyber-cyan"
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid gap-4">
          {pdfs.map((pdf) => (
            <button
              key={pdf.id}
              onClick={() => onSelect(pdf)}
              className={`flex flex-col items-start rounded-lg overflow-hidden cyber-border
                ${selected?.id === pdf.id
                  ? 'border-cyber-cyan shadow-cyber-lg'
                  : 'border-cyber-cyan/30 hover:border-cyber-cyan/60 hover:shadow-cyber'
                } transition-all duration-200`}
            >
              <div className="relative w-full">
                <img
                  src={pdf.thumbnail}
                  alt={pdf.title}
                  className="w-full h-40 object-cover filter brightness-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cyber-darkGray/90 to-transparent" />
              </div>
              <div className="p-3 w-full bg-cyber-darkGray">
                <h3 className="font-medium text-cyber-cyan text-sm cyber-glow">{pdf.title}</h3>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};