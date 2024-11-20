export interface FileSystemBook {
  id: string;
  title: string;
  path: string;
  thumbnail: string | null;
  category: string;
  author: string;
  pageCount: number;
}

export async function scanBooks(): Promise<FileSystemBook[]> {
  try {
    const response = await fetch('/api/books');
    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }
    const books = await response.json();
    return books;
  } catch (error) {
    console.error('Error scanning books:', error);
    return [];
  }
}