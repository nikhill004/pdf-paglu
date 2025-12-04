import express from 'express';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import { upload } from '../middleware/upload.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

router.post('/', upload.array('pdfs', 10), async (req, res) => {
  try {
    const mergedPdf = await PDFDocument.create();
    
    for (const file of req.files) {
      const pdfBytes = await fs.readFile(file.path);
      const pdf = await PDFDocument.load(pdfBytes);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach(page => mergedPdf.addPage(page));
      await fs.unlink(file.path);
    }
    
    const mergedPdfBytes = await mergedPdf.save();
    const outputPath = path.join(path.dirname(req.files[0].path), `merged-${Date.now()}.pdf`);
    await fs.writeFile(outputPath, mergedPdfBytes);
    
    res.json({ 
      success: true, 
      downloadUrl: `/uploads/${path.basename(outputPath)}` 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
