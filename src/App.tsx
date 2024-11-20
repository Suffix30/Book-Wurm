import { useState, useEffect } from 'react';
import { Terminal, RefreshCw } from 'lucide-react';
import { scanBooks } from './utils/fileSystem';
import type { FileSystemBook } from './types';
import { BookRow } from './components/BookRow';
import { PDFViewer } from './components/PDFViewer';

const categories = [
  { id: 'programming', title: 'Programming_' },
  { id: 'security', title: 'Security_' },
  { id: 'networking', title: 'Networking_' },
  { id: 'hardware', title: 'Hardware_' },
  { id: 'other', title: 'Other_' }
];

export function App() {
  const [books, setBooks] = useState<FileSystemBook[]>([]);
  const [selectedPDF, setSelectedPDF] = useState<FileSystemBook | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadBooks = async () => {
    setIsLoading(true);
    try {
      const scannedBooks = await scanBooks();
      setBooks(scannedBooks);
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    // Add a small delay to show the loading state
    setTimeout(() => {
      loadBooks();
    }, 500);
  };

  const filteredBooks = books.filter(book => {
    const query = searchQuery.toLowerCase();
    return (
      book.title?.toLowerCase().includes(query) ||
      book.author?.toLowerCase().includes(query) ||
      book.category?.toLowerCase().includes(query)
    );
  });

  const categorizedBooks = categories.map(category => ({
    ...category,
    books: filteredBooks.filter(book => book.category === category.id)
  }));

  return (
    <div className="min-h-screen bg-cyber-black">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-cyber-black/90 border-b border-cyber-cyan/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="h-6 w-6 text-cyber-cyan" />
            <h1 className="cyber-title text-xl">BookWurm_</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-96">
              <input
                type="text"
                placeholder="Search by title or author//"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="cyber-input w-full"
              />
            </div>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="cyber-button flex items-center gap-2"
            >
              <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'SCANNING_' : 'REFRESH_'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 pb-8">
        {selectedPDF ? (
          <div className="fixed inset-0 z-50 bg-cyber-black/95 pt-16">
            <div className="absolute top-4 right-4 z-10">
              <button 
                onClick={() => setSelectedPDF(null)}
                className="cyber-button"
              >
                [CLOSE]
              </button>
            </div>
            <PDFViewer pdf={selectedPDF} />
          </div>
        ) : (
          <div className="container mx-auto px-4 space-y-8">
            {isLoading ? (
              <div className="flex items-center justify-center h-[50vh]">
                <div className="text-center space-y-4">
                  <RefreshCw className="h-12 w-12 animate-spin mx-auto text-cyber-cyan" />
                  <p className="cyber-text">Searching for ScoobySnacks...</p>
                </div>
              </div>
            ) : filteredBooks.length === 0 ? (
              <div className="flex items-center justify-center h-[50vh]">
                <div className="text-center space-y-4">
                  <p className="cyber-text">No ScoobySnacks Found</p>
                  {searchQuery ? (
                    <p className="text-cyber-cyan/60">Try a Snickers</p>
                  ) : (
                    <button onClick={handleRefresh} className="cyber-button">
                      Check the Fridge
                    </button>
                  )}
                </div>
              </div>
            ) : (
              categorizedBooks.map(category => (
                category.books.length > 0 && (
                  <BookRow
                    key={category.id}
                    title={category.title}
                    books={category.books}
                    onSelect={setSelectedPDF}
                  />
                )
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}