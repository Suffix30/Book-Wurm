import { FileSystemBook } from '../types';

export const BOOKS: FileSystemBook[] = [];

export async function scanBooks(): Promise<FileSystemBook[]> {
  try {
    if (window.location.hostname.includes('github.io')) {
      return BOOKS;
    }

    const response = await fetch('/api/books');
    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }
    const books = await response.json();
    return books;
  } catch (error) {
    console.error('Error scanning books:', error);
    return BOOKS;
  }
}

export type { FileSystemBook };