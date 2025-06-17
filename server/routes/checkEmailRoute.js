import express from 'express';
import { db } from '../db.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const [rows] = await db.query('SELECT email FROM Users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Email not registered' });
    }
    res.status(200).json({ message: 'Email exists' });
  } catch (err) {
    console.error('Error checking email:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
