# BookWurm

A PDF library viewer and intelligent book organization.

## Features

-  Cyberpunk-inspired UI design
-  Automatic book categorization
-  Search by title, author, or category
-  Built-in PDF viewer
-  Smart thumbnail matching
-  Responsive layout
-  Smooth mouse-controlled scrolling
-  PDF metadata extraction

## Tech Stack

- React 18
- Vite
- Express
- TypeScript
- Tailwind CSS
- PDF Parse
- Lucide Icons

## Development

1. Install dependencies:
```bash
npm install
```

2. Place your PDFs and cover images:
- Add PDF files to the `pdfs/` directory
- Add cover images to the `images/` directory
  - Images should share similar names to their PDF counterparts
  - Supports partial matching for flexibility

3. Start the development server:
```bash
npm run dev
```

## Project Structure

```
bookwurm/
├── src/
│   ├── components/     # React components
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main application
│   └── index.css       # Global styles
├── server/
│   └── index.js        # Express server
├── pdfs/              # PDF storage
└── images/            # Cover image storage
```

## Features in Detail

### Smart Image Matching
The application uses an intelligent algorithm to match PDF files with their cover images, allowing for flexible naming conventions.

### Category System
Books are automatically categorized into:
- Programming
- Security
- Networking
- Hardware
- Other

### Smooth Scrolling
Features an intuitive mouse-controlled scrolling system:
- Move mouse to scroll through books
- Speed varies based on cursor position
- Smooth acceleration and deceleration

### Search Functionality
- Search by book title
- Search by author name
- Search by category
- Real-time filtering

## License

MIT