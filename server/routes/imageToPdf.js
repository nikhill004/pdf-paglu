import express from 'express';
import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/', upload.array('images', 20), async (req, res) => {
  try {
    const pdfDoc = await PDFDocument.create();
    
    for (const file of req.files) {
      // Convert image to JPEG if needed
      const imageBuffer = await sharp(file.path)
        .jpeg({ quality: 90 })
        .toBuffer();
      
      const image = await pdfDoc.embedJpg(imageBuffer);
      const { width, height } = image.scale(1);
      
      // Create page with image dimensions
      const page = pdfDoc.addPage([width, height]);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width,
        height
      });
      
      await fs.unlink(file.path);
    }
    
    const pdfBytes = await pdfDoc.save();
    const outputPath = path.join(path.dirname(req.files[0].path), `images-${Date.now()}.pdf`);
    await fs.writeFile(outputPath, pdfBytes);
    
    res.json({ 
      success: true, 
      downloadUrl: `/uploads/${path.basename(outputPath)}` 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
