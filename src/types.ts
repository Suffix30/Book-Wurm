export interface FileSystemBook {
  id: string;
  title: string;
  path: string;
  thumbnail: string | null;
  author: string;
  category: string;
  pageCount: number;
}

// For backward compatibility
export type PDFDocument = FileSystemBook;