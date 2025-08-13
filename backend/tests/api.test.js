import request from 'supertest';
import express from 'express';
import { aadhaarSchema, panSchema } from '../lib/validation.js';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// mock express app
const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/step1', async (req, res) => {
  try {
    await aadhaarSchema.validate(req.body, { abortEarly: false });
    res.json({ message: 'Aadhaar validated successfully' });
  } catch (err) {
    res.status(400).json({ message: err.errors.join(', ') });
  }
});

app.post('/api/step2', async (req, res) => {
  try {
    await panSchema.validate(req.body, { abortEarly: false });
    const saved = await prisma.submission.create({ data: req.body });
    res.json({ message: 'PAN validated and saved', data: saved });
  } catch (err) {
    res.status(400).json({ message: err.errors.join(', ') });
  }
});

describe('API Tests', () => {
  test('POST /api/step1 should validate Aadhaar', async () => {
    const res = await request(app)
      .post('/api/step1')
      .send({
        aadhaarNumber: '123456789012',
        nameAsPerAadhaar: 'Test User',
        consent: true
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Aadhaar validated successfully/);
  });

  test('POST /api/step2 should validate PAN and save', async () => {
    const res = await request(app)
      .post('/api/step2')
      .send({
        aadhaarNumber: '123456789012',
        nameAsPerAadhaar: 'Test User',
        consent: true,
        pan: 'ABCDE1234F',
        itrFiled: 'Yes',
        gstRegistered: 'No'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/PAN validated and saved/);
  });
});
