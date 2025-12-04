import express from 'express';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/', upload.single('pdf'), async (req, res) => {
  try {
    const pdfBytes = await fs.readFile(req.file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    // Save with compression options
    const compressedPdfBytes = await pdfDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
      objectsPerTick: 50
    });
    
    const outputPath = path.join(path.dirname(req.file.path), `compressed-${Date.now()}.pdf`);
    await fs.writeFile(outputPath, compressedPdfBytes);
    
    const originalSize = (await fs.stat(req.file.path)).size;
    const compressedSize = (await fs.stat(outputPath)).size;
    const reduction = ((1 - compressedSize / originalSize) * 100).toFixed(1);
    
    await fs.unlink(req.file.path);
    
    res.json({ 
      success: true, 
      downloadUrl: `/uploads/${path.basename(outputPath)}`,
      originalSize,
      compressedSize,
      reduction: `${reduction}%`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
