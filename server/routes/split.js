import express from 'express';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import { upload } from '../middleware/upload.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

router.post('/', upload.single('pdf'), async (req, res) => {
  try {
    const { ranges } = req.body; // e.g., "1-3,5,7-9"
    const pdfBytes = await fs.readFile(req.file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    const pageRanges = parseRanges(ranges, pdfDoc.getPageCount());
    const newPdf = await PDFDocument.create();
    
    for (const pageNum of pageRanges) {
      const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageNum - 1]);
      newPdf.addPage(copiedPage);
    }
    
    const newPdfBytes = await newPdf.save();
    const outputPath = path.join(path.dirname(req.file.path), `split-${Date.now()}.pdf`);
    await fs.writeFile(outputPath, newPdfBytes);
    
    // Cleanup original
    await fs.unlink(req.file.path);
    
    res.json({ 
      success: true, 
      downloadUrl: `/uploads/${path.basename(outputPath)}` 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function parseRanges(rangesStr, maxPages) {
  const pages = new Set();
  const parts = rangesStr.split(',');
  
  for (const part of parts) {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(Number);
      for (let i = start; i <= Math.min(end, maxPages); i++) {
        pages.add(i);
      }
    } else {
      const page = Number(part);
      if (page <= maxPages) pages.add(page);
    }
  }
  
  return Array.from(pages).sort((a, b) => a - b);
}

export default router;
