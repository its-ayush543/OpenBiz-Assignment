import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { aadhaarSchema, panSchema } from './lib/validation.js';

dotenv.config();

const prisma = new PrismaClient();
const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'https://open-biz-assignment.vercel.app'
]



// Improved CORS setup
app.use(cors({
  origin: 'https://open-biz-assignment.vercel.app',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  optionsSuccessStatus: 200,
  credentials: true
}));

app.use(express.json());

// Handle preflight requests
app.options('*', cors());

// Root health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running 🚀' });
});

// Database health check
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).send('DB Connected');
  } catch (e) {
    res.status(500).send('DB Connection Failed');
  }
});

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
    console.log("Step 2 payload:", req.body);
    await panSchema.validate(req.body, { abortEarly: false });
    const saved = await prisma.submission.create({
      data: req.body,
    });
    res.json({ message: 'PAN validated and saved', data: saved });
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError' && err.errors) {
      res.status(400).json({ message: err.errors.join(', ') });
    } else {
      res.status(500).json({ message: err.message || 'Server error' });
    }
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

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
