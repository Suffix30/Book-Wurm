export function normalizeFilename(filename: string): string {
  return filename
    .replace(/\.[^/.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/handbook|edition|volume|vol|part|by|and|the|discovering|exploiting|security|holes/g, '')
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
        score += 3;
      } else {
        imgWords.forEach(imgWord => {
          if (pdfWord.includes(imgWord) || imgWord.includes(pdfWord)) {
            score += 1;
          }
          if (levenshteinDistance(pdfWord, imgWord) <= 2) {
            score += 1;
          }
        });
      }
    });

    const longestCommonSubstring = findLongestCommonSubstring(normalizedPdf, normalizedImg);
    score += longestCommonSubstring.length > 5 ? 3 : 0;
    
    return {
      image: img,
      score,
      normalizedImg,
      debug: {
        pdfName: normalizedPdf,
        imgName: normalizedImg,
        matchScore: score
      }
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

function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const substitutionCost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + substitutionCost
      );
    }
  }

  return matrix[str2.length][str1.length];
}