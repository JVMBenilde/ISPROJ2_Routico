import bcrypt from 'bcrypt';
import { db } from '../db.js';
import { sendEmail } from '../utils/mail.js';

export const registerUser = async (req, res) => {
  const { fullName, email, phone, password, role } = req.body;

  if (!fullName || !email || !phone || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const [existing] = await db.query('SELECT email FROM Users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const createdAt = new Date();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry

    const [result] = await db.query(
      `INSERT INTO Users (full_name, email, phone, password_hash, role, created_at, account_status, active_status, is_verified)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, false)`,
      [fullName, email, phone, passwordHash, role, createdAt, 'active', 'active']
    );

    const userId = result.insertId;

    await db.query(
      `INSERT INTO UserToken (user_id, token, token_type, expires_at)
       VALUES (?, ?, 'email_verification', ?)`,
      [userId, otp, expiresAt]
    );

    await sendEmail(email, otp);
    res.status(201).json({ message: 'OTP sent. Please verify your email.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};