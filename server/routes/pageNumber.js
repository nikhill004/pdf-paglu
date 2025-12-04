import express from 'express';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/', upload.single('pdf'), async (req, res) => {
  try {
    const { position = 'bottom-center', startPage = 1 } = req.body;
    const pdfBytes = await fs.readFile(req.file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    const pages = pdfDoc.getPages();
    let pageNum = parseInt(startPage);
    
    pages.forEach(page => {
      const { width, height } = page.getSize();
      const text = `${pageNum}`;
      const textWidth = font.widthOfTextAtSize(text, 12);
      
      let x, y;
      if (position === 'bottom-center') {
        x = (width - textWidth) / 2;
        y = 30;
      } else if (position === 'bottom-right') {
        x = width - textWidth - 50;
        y = 30;
      } else {
        x = 50;
        y = 30;
      }
      
      page.drawText(text, {
        x, y, size: 12, font, color: rgb(0, 0, 0)
      });
      
      pageNum++;
    });
    
    const numberedPdfBytes = await pdfDoc.save();
    const outputPath = path.join(path.dirname(req.file.path), `numbered-${Date.now()}.pdf`);
    await fs.writeFile(outputPath, numberedPdfBytes);
    await fs.unlink(req.file.path);
    
    res.json({ 
      success: true, 
      downloadUrl: `/uploads/${path.basename(outputPath)}` 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
