const fs = require('fs');
const path = require('path');

const pdfDirectory = './pdfs/';
const imageDirectory = './images/';
const outputHtml = './netWork.html';

// Helper to format file paths for URL
const formatPathForUrl = (filePath) => {
  return filePath.split(path.sep).join('/').split(' ').join('%20');
};

// Helper to escape single quotes in file names
const escapeSingleQuotes = (str) => {
    return str.replace(/'/g, "\\'");
};

// Helper to normalize file names by removing specified characters and making lowercase
const normalizeFileName = (fileName) => {
    return fileName.toLowerCase().replace(/[\(\)""',:&`~]/g, '');
};

// Read files from PDF and images directories
const pdfFiles = fs.readdirSync(pdfDirectory).map(file => ({ original: file, normalized: normalizeFileName(file) }));
const imageFiles = fs.readdirSync(imageDirectory).map(file => ({ original: file, normalized: normalizeFileName(file) }));

// Map image files to their corresponding PDF
const links = imageFiles.reduce((acc, { original: image, normalized: normalizedImage }) => {
  const baseName = normalizedImage.split('.')[0];
  const pdfFile = pdfFiles.find(({ normalized }) => normalized.startsWith(baseName));
  if (pdfFile) {
    const formattedPdfPath = formatPathForUrl(pdfDirectory + pdfFile.original);
    const formattedImagePath = formatPathForUrl(imageDirectory + image);
    acc[baseName] = {
      image: formattedImagePath,
      pdf: formattedPdfPath
    };
  }
  return acc;
}, {});

// Start building the HTML content
let htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PDF Gallery</title>
    <link rel="stylesheet" href="netWork.css">
</head>
<body>
<div id="sidebar" class="sidebar">`;

// Add thumbnails to the sidebar
for (const [name, files] of Object.entries(links)) {
  const escapedName = escapeSingleQuotes(name);
  const escapedPdfPath = escapeSingleQuotes(files.pdf);
  const escapedImagePath = escapeSingleQuotes(files.image);
  htmlContent += `
    <img class="pdf-thumbnail" src="${escapedImagePath}" alt="${escapedName}" onclick="openPDF('${escapedPdfPath}')">`;
}

// Finish the sidebar and start the PDF display area
htmlContent += `
</div>
<div id="pdf-display" class="pdf-display">
    <!-- This area will be updated with the PDF content -->
</div>
<script src="netWork.js"></script>
</body>
</html>`;

// Write the HTML content to the index.html file
fs.writeFileSync(outputHtml, htmlContent);
