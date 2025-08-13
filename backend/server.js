import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { aadhaarSchema, panSchema } from './lib/validation.js';

dotenv.config();

const prisma = new PrismaClient();
const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

// ------------------- Routes -------------------

// Step 1: Aadhaar Validation
app.post('/api/step1', async (req, res) => {
  try {
    await aadhaarSchema.validate(req.body, { abortEarly: false });
    res.json({ message: 'Aadhaar validated successfully' });
  } catch (err) {
    res.status(400).json({ message: err.errors.join(', ') });
  }
});

// Step 2: PAN Validation + Save to DB
app.post('/api/step2', async (req, res) => {
  try {
    await panSchema.validate(req.body, { abortEarly: false });
    const saved = await prisma.submission.create({
      data: req.body,
    });
    res.json({ message: 'PAN validated and saved', data: saved });
  } catch (err) {
    res.status(400).json({ message: err.errors.join(', ') });
  }
});

// Get All Submissions
app.get('/api/submissions', async (req, res) => {
  try {
    const submissions = await prisma.submission.findMany({
      orderBy: { id: 'desc' },
    });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching submissions' });
  }
});

// ------------------- Server Start -------------------
app.listen(process.env.PORT || 4000, () => {
  console.log(`✅ Backend running on port ${process.env.PORT || 4000}`);
});
