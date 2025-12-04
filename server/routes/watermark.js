import express from 'express';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/', upload.single('pdf'), async (req, res) => {
  try {
    const { text = 'WATERMARK', opacity = 0.3 } = req.body;
    const pdfBytes = await fs.readFile(req.file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    const pages = pdfDoc.getPages();
    const opacityValue = parseFloat(opacity);
    
    pages.forEach(page => {
      const { width, height } = page.getSize();
      const textSize = 60;
      const textWidth = font.widthOfTextAtSize(text, textSize);
      
      page.drawText(text, {
        x: (width - textWidth) / 2,
        y: height / 2,
        size: textSize,
        font,
        color: rgb(0.7, 0.7, 0.7),
        opacity: opacityValue,
        rotate: degrees(45)
      });
    });
    
    const watermarkedPdfBytes = await pdfDoc.save();
    const outputPath = path.join(path.dirname(req.file.path), `watermarked-${Date.now()}.pdf`);
    await fs.writeFile(outputPath, watermarkedPdfBytes);
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
