import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function copyDir(src, dest) {
  try {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        await copyDir(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  } catch (error) {
    console.error(`Error copying ${src} to ${dest}:`, error);
    throw error;
  }
}

async function copyStaticAssets() {
  const rootDir = path.join(__dirname, '..');
  const docsDir = path.join(rootDir, 'docs');

  try {
    await fs.mkdir(docsDir, { recursive: true });

    console.log('Copying PDFs...');
    await copyDir(
      path.join(rootDir, 'pdfs'),
      path.join(docsDir, 'pdfs')
    );

    console.log('Copying images...');
    await copyDir(
      path.join(rootDir, 'images'),
      path.join(docsDir, 'images')
    );

    console.log('Static assets copied successfully!');
  } catch (error) {
    console.error('Error copying static assets:', error);
    process.exit(1);
  }
}

copyStaticAssets();