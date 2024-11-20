export function normalizeFilename(filename: string): string {
    return filename
      .replace(/\.[^/.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  
  export function findMatchingImage(pdfName: string, images: string[]): string | null {
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