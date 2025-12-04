# PDF PAGLU

A modern, full-featured PDF manipulation web application with a clean and intuitive UI.

## Features

✅ **Split PDF** - Extract specific pages from PDFs
✅ **Merge PDF** - Combine multiple PDFs into one
✅ **Word to PDF** - Convert DOCX files to PDF
✅ **PDF to Word** - Extract text from PDFs
✅ **Add Page Numbers** - Number your PDF pages
✅ **Compress PDF** - Reduce file size
✅ **Add Watermark** - Protect documents with watermarks
✅ **Images to PDF** - Convert multiple images to PDF

## Tech Stack

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express
- **PDF Processing**: pdf-lib, Sharp
- **File Upload**: Multer
- **Auto Cleanup**: Cron jobs (files deleted after 1 hour)

## Installation

1. Install all dependencies:
```bash
npm run install-all
```

2. Start development servers:
```bash
npm run dev
```

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Manual Setup

If you prefer to run servers separately:

### Backend
```bash
cd server
npm install
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

## Optional: LibreOffice for Word Conversion

For better Word to PDF conversion, install LibreOffice:
- **Windows**: Download from https://www.libreoffice.org/
- **Mac**: `brew install libreoffice`
- **Linux**: `sudo apt-get install libreoffice`

## How It Works

1. User uploads files through the web interface
2. Files are processed on the backend using pdf-lib
3. Processed files are stored temporarily in `/uploads`
4. User downloads the result
5. Files are automatically deleted after 1 hour

## Security Features

- 50MB file size limit
- Automatic file cleanup
- CORS enabled
- No permanent storage

## Project Structure

```
pdf-app/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── App.jsx      # Main app
│   │   └── main.jsx     # Entry point
│   └── package.json
├── server/              # Express backend
│   ├── routes/          # API endpoints
│   ├── uploads/         # Temporary storage
│   └── server.js        # Server entry
└── package.json         # Root config
```

## API Endpoints

- `POST /api/split` - Split PDF pages
- `POST /api/merge` - Merge multiple PDFs
- `POST /api/convert/word-to-pdf` - Convert Word to PDF
- `POST /api/convert/pdf-to-word` - Convert PDF to text
- `POST /api/page-number` - Add page numbers
- `POST /api/compress` - Compress PDF
- `POST /api/watermark` - Add watermark
- `POST /api/image-to-pdf` - Convert images to PDF


