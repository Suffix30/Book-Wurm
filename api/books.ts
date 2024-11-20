import { readdir } from 'fs/promises';
import { join } from 'path';
import type { Request, Response } from 'express';

function normalizeFilename(filename: string): string {
  return filename
    .replace(/\.[^/.]+$/, '')
    .toLowerCase()
    .trim();
}

export default async function handler(
  req: Request,
  res: Response
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const pdfsDir = join(process.cwd(), 'pdfs');
    const imagesDir = join(process.cwd(), 'images');

    const [pdfs, images] = await Promise.all([
      readdir(pdfsDir),
      readdir(imagesDir)
    ]);

    const books = pdfs
      .filter(file => file.endsWith('.pdf'))
      .map((pdf, index) => {
        const baseName = normalizeFilename(pdf);
        const thumbnail = images.find(img => 
          normalizeFilename(img) === baseName
        );

        return {
          id: String(index + 1),
          title: pdf.replace('.pdf', ''),
          path: `/pdfs/${pdf}`,
          thumbnail: thumbnail ? `/images/${thumbnail}` : null,
          author: 'Unknown'
        };
      });

    res.status(200).json(books);
  } catch (error) {
    console.error('Error reading files:', error);
    res.status(500).json({ error: 'Failed to read files' });
  }
}