export function normalizeFilename(filename: string): string {
  return filename
    .replace(/\.[^/.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/handbook|edition|volume|vol|part|by|and|the/g, '')
    .trim();
}

export function findMatchingImage(pdfName: string, images: string[]): string | null {
  const normalizedPdf = normalizeFilename(pdfName);
  const pdfWords = normalizedPdf
    .split(' ')
    .filter(word => word.length > 2)
    .map(word => word.replace(/[^a-z0-9]/g, ''));
  
  const scoredImages = images.map(img => {
    const normalizedImg = normalizeFilename(img);
    const imgWords = normalizedImg
      .split(' ')
      .filter(word => word.length > 2)
      .map(word => word.replace(/[^a-z0-9]/g, ''));
    
    let score = 0;
    
    pdfWords.forEach(pdfWord => {
      if (imgWords.includes(pdfWord)) {
        score += 2;
      } else {
        imgWords.forEach(imgWord => {
          if (pdfWord.includes(imgWord) || imgWord.includes(pdfWord)) {
            score += 1;
          }
        });
      }
    });

    const longestCommonSubstring = findLongestCommonSubstring(normalizedPdf, normalizedImg);
    score += longestCommonSubstring.length > 5 ? 2 : 0;
    
    return {
      image: img,
      score,
      normalizedImg
    };
  });

  const bestMatch = scoredImages.sort((a, b) => {
    if (b.score === a.score) {
      return a.normalizedImg.length - b.normalizedImg.length;
    }
    return b.score - a.score;
  })[0];
  
  return bestMatch && bestMatch.score >= 2 ? bestMatch.image : null;
}

function findLongestCommonSubstring(str1: string, str2: string): string {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  const matrix = Array(s1.length + 1).fill(null).map(() => Array(s2.length + 1).fill(0));
  let maxLength = 0;
  let endIndex = 0;

  for (let i = 1; i <= s1.length; i++) {
    for (let j = 1; j <= s2.length; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1] + 1;
        if (matrix[i][j] > maxLength) {
          maxLength = matrix[i][j];
          endIndex = i;
        }
      }
    }
  }

  return s1.slice(endIndex - maxLength, endIndex);
}