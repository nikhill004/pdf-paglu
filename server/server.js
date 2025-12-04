import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import cron from 'node-cron';
import splitRouter from './routes/split.js';
import mergeRouter from './routes/merge.js';
import convertRouter from './routes/convert.js';
import pageNumberRouter from './routes/pageNumber.js';
import compressRouter from './routes/compress.js';
import watermarkRouter from './routes/watermark.js';
import imageToPdfRouter from './routes/imageToPdf.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Create uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
await fs.mkdir(uploadsDir, { recursive: true });

// Routes
app.use('/api/split', splitRouter);
app.use('/api/merge', mergeRouter);
app.use('/api/convert', convertRouter);
app.use('/api/page-number', pageNumberRouter);
app.use('/api/compress', compressRouter);
app.use('/api/watermark', watermarkRouter);
app.use('/api/image-to-pdf', imageToPdfRouter);

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// Cleanup old files every hour
cron.schedule('0 * * * *', async () => {
  try {
    const files = await fs.readdir(uploadsDir);
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    for (const file of files) {
      const filePath = path.join(uploadsDir, file);
      const stats = await fs.stat(filePath);
      if (now - stats.mtimeMs > oneHour) {
        await fs.unlink(filePath);
        console.log(`Deleted old file: ${file}`);
      }
    }
  } catch (error) {
    console.error('Cleanup error:', error);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
