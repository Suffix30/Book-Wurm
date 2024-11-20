export interface FileSystemBook {
  id: string;
  title: string;
  path: string;
  thumbnail: string | null;
  author: string;
  category: string;
  pageCount: number;
}

export type PDFDocument = FileSystemBook;