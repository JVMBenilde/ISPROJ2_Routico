import bcrypt from 'bcrypt';
import { db } from '../db.js';
import { sendEmail } from '../utils/mail.js';
import admin from '../firebaseAdmin.js';

export const sendOtp = async (req, res) => {
  const { fullName, email, phone, password, role, googleUser, resend } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    if (!resend) {
      if (!fullName || !phone || !role) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      const [existing] = await db.query('SELECT email FROM Users WHERE email = ?', [email]);
      if (existing.length > 0) {
        return res.status(409).json({ message: 'Email already registered' });
      }

      const [pending] = await db.query('SELECT email FROM PendingRegistrations WHERE email = ?', [email]);
      if (pending.length > 0) {
        return res.status(409).json({ message: 'OTP already sent. Please verify your email.' });
      }

      const otp = generateOtp();
      const expiresAt = getExpiry();

      await db.query(
        `INSERT INTO PendingRegistrations (full_name, email, phone, password, role, otp, otp_expires_at, google_user)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [fullName, email, phone, password || null, role, otp, expiresAt, googleUser || false]
      );

      await sendEmail(email, otp);
    } else {
      const [pending] = await db.query('SELECT * FROM PendingRegistrations WHERE email = ?', [email]);
      if (pending.length === 0) {
        return res.status(404).json({ message: 'No pending registration found for resend.' });
      }

      const otp = generateOtp();
      const expiresAt = getExpiry();

      await db.query(
        `UPDATE PendingRegistrations SET otp = ?, otp_expires_at = ? WHERE email = ?`,
        [otp, expiresAt, email]
      );

      await sendEmail(email, otp);
    }

    res.status(201).json({ message: 'OTP sent. Please verify your email.' });
  } catch (err) {
    console.error('Error sending OTP:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  try {
    const currentTime = new Date().toISOString();

    const [rows] = await db.query(
      'SELECT * FROM PendingRegistrations WHERE email = ? AND otp = ? AND otp_expires_at > ?',
      [email, otp, currentTime]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const pending = rows[0];
    const createdAt = new Date();

    let passwordHash = null;

    if (!pending.google_user && pending.password) {
      passwordHash = await bcrypt.hash(pending.password, 10);
    }

    let userRecord;

    if (!pending.google_user) {
      userRecord = await admin.auth().createUser({
        email: pending.email,
        password: pending.password,
      });
    } else {
      userRecord = await admin.auth().getUserByEmail(pending.email);
    }

    const firebaseUid = userRecord.uid;

    // ✅ Assign role_id based on role
    let roleId;
    if (pending.role === 'driver' || pending.role === 'business_owner') {
      roleId = 2;
    } else {
      return res.status(400).json({ message: 'Invalid role during verification' });
    }

    await db.query(
      `INSERT INTO Users (firebase_uid, full_name, email, phone, password_hash, role, role_id, created_at, account_status, active_status, is_verified)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, true)`,
      [
        firebaseUid,
        pending.full_name,
        pending.email,
        pending.phone,
        passwordHash,
        pending.role,
        roleId,
        createdAt,
        'active',
        'active'
      ]
    );

    await db.query('DELETE FROM PendingRegistrations WHERE email = ?', [email]);

    res.status(200).json({ message: 'Email verified and account created.', role: pending.role });
  } catch (err) {
    console.error('Error verifying OTP:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ✅ Utility helpers
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();
const getExpiry = () => new Date(Date.now() + 10 * 60 * 1000).toISOString();
