import { readdir } from 'fs/promises';
import { join } from 'path';

export default async function handler(req, res) {
  try {
    const pdfDir = join(process.cwd(), 'public', 'pdfs');
    const imageDir = join(process.cwd(), 'public', 'images');

    const [pdfs, images] = await Promise.all([
      readdir(pdfDir),
      readdir(imageDir)
    ]);

    res.json({
      pdfs: pdfs.filter(file => file.endsWith('.pdf')),
      images: images.filter(file => file.endsWith('.png'))
    });
  } catch (error) {
    console.error('Error reading files:', error);
    res.status(500).json({ error: 'Failed to read files' });
  }
}