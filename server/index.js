import express from 'express';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const app = express();
const port = process.env.PORT || 3000;

const pdfsDir = join(__dirname, '../pdfs');
const imagesDir = join(__dirname, '../images');

const PDF_PARSE_OPTIONS = {
  max: 1,
  pagerender: () => null,
  version: 'v2.0.550',
  suppressConsoleOutput: true
};

function normalizeFilename(filename) {
  return filename
    .replace(/\.[^/.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function findMatchingImage(pdfName, images) {
  const normalizedPdf = normalizeFilename(pdfName);
  const pdfWords = normalizedPdf.split(' ').filter(word => word.length > 2);
  
  const scoredImages = images.map(img => {
    const normalizedImg = normalizeFilename(img);
    const imgWords = normalizedImg.split(' ');
    
    const matchingWords = pdfWords.filter(word => 
      imgWords.some(imgWord => imgWord.includes(word) || word.includes(imgWord))
    );
    
    return {
      image: img,
      score: matchingWords.length
    };
  });

  const bestMatch = scoredImages.sort((a, b) => b.score - a.score)[0];
  return bestMatch && bestMatch.score >= 2 ? bestMatch.image : null;
}

function categorizeBook(title) {
  const lowerTitle = title.toLowerCase();
  
  if (/python|programming|code|assembly|javascript/.test(lowerTitle)) {
    return 'programming';
  }
  if (/hack|security|penetration|exploit|cyber|ceh|ethical/.test(lowerTitle)) {
    return 'security';
  }
  if (/network|cisco|protocol|routing|ss7|voip/.test(lowerTitle)) {
    return 'networking';
  }
  if (/hardware|device|mobile|android|ios/.test(lowerTitle)) {
    return 'hardware';
  }
  return 'other';
}

function extractAuthorFromFilename(filename) {
  const byMatch = filename.match(/by\s+([^\.]+)/i);
  return byMatch ? byMatch[1].trim() : 'Unknown';
}

async function extractPDFMetadata(filePath) {
  try {
    const dataBuffer = await readFile(filePath);
    const data = await pdfParse(dataBuffer, PDF_PARSE_OPTIONS);
    
    return {
      author: data.info?.Author || extractAuthorFromFilename(filePath),
      pageCount: data.numpages || 0,
      title: data.info?.Title || ''
    };
  } catch (error) {
    return {
      author: extractAuthorFromFilename(filePath),
      pageCount: 0,
      title: ''
    };
  }
}

app.get('/api/books', async (req, res) => {
  try {
    console.log('Scanning directories...');
    const [pdfs, images] = await Promise.all([
      readdir(pdfsDir),
      readdir(imagesDir)
    ]);

    console.log(`Found ${pdfs.length} PDFs and ${images.length} images`);

    const books = await Promise.all(
      pdfs
        .filter(file => file.endsWith('.pdf'))
        .map(async (pdf, index) => {
          const pdfPath = join(pdfsDir, pdf);
          const metadata = await extractPDFMetadata(pdfPath);
          const thumbnail = findMatchingImage(pdf, images);
          const title = pdf.replace('.pdf', '');

          if (!thumbnail) {
            console.log(`No thumbnail found for PDF: ${pdf}`);
          }

          return {
            id: String(index + 1),
            title: metadata.title || title,
            path: `/pdfs/${pdf}`,
            thumbnail: thumbnail ? `/images/${thumbnail}` : null,
            category: categorizeBook(title),
            author: metadata.author,
            pageCount: metadata.pageCount
          };
        })
    );

    console.log(`Processed ${books.length} books`);
    res.json(books);
  } catch (error) {
    console.error('Error reading files:', error);
    res.status(500).json({ error: 'Failed to read files' });
  }
});

app.use('/pdfs', express.static(pdfsDir));
app.use('/images', express.static(imagesDir));

const vite = await createViteServer({
  server: { middlewareMode: true },
  appType: 'spa'
});

app.use(vite.middlewares);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Using PDFs from: ${pdfsDir}`);
  console.log(`Using images from: ${imagesDir}`);
});