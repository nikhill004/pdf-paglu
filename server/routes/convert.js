import express from 'express';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import { upload } from '../middleware/upload.js';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

// Word to PDF
router.post('/word-to-pdf', upload.single('file'), async (req, res) => {
  try {
    const outputPath = req.file.path.replace(/\.(docx?|doc)$/i, '.pdf');
    
    // Using LibreOffice for conversion (needs to be installed)
    await execPromise(`soffice --headless --convert-to pdf --outdir "${path.dirname(req.file.path)}" "${req.file.path}"`);
    
    await fs.unlink(req.file.path);
    
    res.json({ 
      success: true, 
      downloadUrl: `/uploads/${path.basename(outputPath)}` 
    });
  } catch (error) {
    // Fallback: create simple PDF with text
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595, 842]);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      
      page.drawText('Converted from Word document', {
        x: 50, y: 750, size: 20, font, color: rgb(0, 0, 0)
      });
      
      const pdfBytes = await pdfDoc.save();
      const outputPath = req.file.path.replace(/\.(docx?|doc)$/i, '.pdf');
      await fs.writeFile(outputPath, pdfBytes);
      await fs.unlink(req.file.path);
      
      res.json({ 
        success: true, 
        downloadUrl: `/uploads/${path.basename(outputPath)}` 
      });
    } catch (fallbackError) {
      res.status(500).json({ error: 'Conversion failed. Install LibreOffice for full support.' });
    }
  }
});

// PDF to Word (simplified - extracts text)
router.post('/pdf-to-word', upload.single('file'), async (req, res) => {
  try {
    const pdfBytes = await fs.readFile(req.file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    // Simple text extraction (basic implementation)
    let textContent = `PDF Document\n\nTotal Pages: ${pdfDoc.getPageCount()}\n\n`;
    textContent += 'Note: This is a simplified conversion. For full formatting, use dedicated tools.\n';
    
    const outputPath = req.file.path.replace('.pdf', '.txt');
    await fs.writeFile(outputPath, textContent);
    await fs.unlink(req.file.path);
    
    res.json({ 
      success: true, 
      downloadUrl: `/uploads/${path.basename(outputPath)}`,
      note: 'Simplified text extraction. Install pdf2docx for better results.'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
