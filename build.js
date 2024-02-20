const fs = require('fs');
const path = require('path');

const pdfDirectory = './pdfs/';
const imageDirectory = './images/';
const outputHtml = './netWork.html';

const formatPathForUrl = (filePath) => {
  return filePath.split(path.sep).join('/').split(' ').join('%20');
};

const escapeSingleQuotes = (str) => {
    return str.replace(/'/g, "\\'");
};

const normalizeFileName = (fileName) => {
    return fileName.toLowerCase().replace(/[\(\)""',:&`~]/g, '');
};

const pdfFiles = fs.readdirSync(pdfDirectory).map(file => ({ original: file, normalized: normalizeFileName(file) }));
const imageFiles = fs.readdirSync(imageDirectory).map(file => ({ original: file, normalized: normalizeFileName(file) }));

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

for (const [name, files] of Object.entries(links)) {
  const escapedName = escapeSingleQuotes(name);
  const escapedPdfPath = escapeSingleQuotes(files.pdf);
  const escapedImagePath = escapeSingleQuotes(files.image);
  htmlContent += `
    <img class="pdf-thumbnail" src="${escapedImagePath}" alt="${escapedName}" onclick="openPDF('${escapedPdfPath}')">`;
}

htmlContent += `
</div>
<div id="pdf-display" class="pdf-display">
    <!-- This area will be updated with the PDF content -->
</div>
<script src="netWork.js"></script>
</body>
</html>`;

fs.writeFileSync(outputHtml, htmlContent);
