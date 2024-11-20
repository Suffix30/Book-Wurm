import React from 'react';
import { BookOpen } from 'lucide-react';
import type { FileSystemBook } from '../utils/fileSystem';

interface BookGridProps {
  books: FileSystemBook[];
  onSelect: (book: FileSystemBook) => void;
}

export const BookGrid: React.FC<BookGridProps> = ({ books, onSelect }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {books.map((book) => (
        <div
          key={book.id}
          className="cyber-card cursor-pointer"
          onClick={() => onSelect(book)}
        >
          <div className="aspect-[3/4] relative bg-cyber-black/50 overflow-hidden">
            {book.thumbnail ? (
              <img
                src={book.thumbnail || ''}
                alt={book.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.style.display = 'none';
                  const parent = img.parentElement;
                  if (parent) {
                    parent.classList.add('flex', 'items-center', 'justify-center');
                    const icon = document.createElement('div');
                    icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" class="w-12 h-12 text-cyber-cyan/30"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>';
                    parent.appendChild(icon);
                  }
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-cyber-cyan/30" />
              </div>
            )}
          </div>
          <div className="p-3 space-y-1">
            <p className="cyber-text text-sm line-clamp-2">{book.title}</p>
            <p className="text-cyber-cyan/60 text-xs line-clamp-1">{book.author}</p>
          </div>
        </div>
      ))}
    </div>
  );
};