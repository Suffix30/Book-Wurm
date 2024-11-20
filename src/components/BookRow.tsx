import React, { useRef, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import type { FileSystemBook } from '../utils/fileSystem';

interface BookRowProps {
  title: string;
  books: FileSystemBook[];
  onSelect: (book: FileSystemBook) => void;
}

export const BookRow: React.FC<BookRowProps> = ({ title, books, onSelect }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollingRef = useRef<{ isScrolling: boolean; rafId: number | null }>({
    isScrolling: false,
    rafId: null,
  });

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const localScrollingRef = scrollingRef.current;

    const updateScroll = (mouseX: number) => {
      if (!container || !localScrollingRef.isScrolling) return;

      const rect = container.getBoundingClientRect();
      const containerWidth = rect.width;
      const relativeX = mouseX - rect.left;

      const center = containerWidth / 2;
      const distanceFromCenter = (relativeX - center) / center;
      const baseSpeed = 40;

      const speed =
        Math.sign(distanceFromCenter) *
        Math.pow(Math.abs(distanceFromCenter), 2) *
        baseSpeed;

      container.scrollLeft += speed;
      localScrollingRef.rafId = requestAnimationFrame(() => updateScroll(mouseX));
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!localScrollingRef.isScrolling) {
        localScrollingRef.isScrolling = true;
      }
      if (localScrollingRef.rafId) {
        cancelAnimationFrame(localScrollingRef.rafId);
      }
      updateScroll(e.clientX);
    };

    const handleMouseLeave = () => {
      localScrollingRef.isScrolling = false;
      if (localScrollingRef.rafId) {
        cancelAnimationFrame(localScrollingRef.rafId);
        localScrollingRef.rafId = null;
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('mouseup', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('mouseup', handleMouseLeave);
      if (localScrollingRef.rafId) {
        cancelAnimationFrame(localScrollingRef.rafId);
      }
    };
  }, []);

  if (books.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-cyber-cyan text-xl cyber-text">{title}</h2>
        <span className="text-cyber-cyan/60 text-sm">{books.length} items</span>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto space-x-4 scrollbar-hide pb-4"
        style={{ scrollBehavior: 'auto' }}
      >
        {books.map((book) => (
          <div
            key={book.id}
            className="flex-none w-48 cyber-card transform transition-all duration-300 hover:scale-105 hover:shadow-cyber"
            onClick={() => onSelect(book)}
          >
            <div className="aspect-[3/4] relative bg-cyber-black/50 overflow-hidden">
              {book.thumbnail ? (
                <img
                  src={book.thumbnail}
                  alt={book.title}
                  className="w-full h-full object-contain hover:object-cover transition-all duration-500"
                  loading="lazy"
                  style={{
                    imageRendering: 'auto',
                    backfaceVisibility: 'hidden',
                    pointerEvents: 'none',
                  }}
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.style.display = 'none';
                    const parent = img.parentElement;
                    if (parent) {
                      parent.classList.add('flex', 'items-center', 'justify-center');
                      const icon = document.createElement('div');
                      icon.innerHTML =
                        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" class="w-12 h-12 text-cyber-cyan/30"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>';
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
              <p className="cyber-text text-sm line-clamp-2 min-h-[2.5rem]">{book.title}</p>
              <div className="flex items-center justify-between text-xs">
                <p className="text-cyber-cyan/60 line-clamp-1">{book.author}</p>
                <span className="text-cyber-cyan/40">{book.pageCount}p</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
