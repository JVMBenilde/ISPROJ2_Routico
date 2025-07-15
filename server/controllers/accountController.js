
import { db } from '../db.js';
import bcrypt from 'bcrypt';
import admin from '../firebaseAdmin.js'; 

export const getAllAccounts = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT user_id, full_name, role, email, phone, firebase_uid, account_status AS status
       FROM Users
       ORDER BY full_name ASC`
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching accounts:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const addAdminAccount = async (req, res) => {
  const { fullName, email, password, phone } = req.body;

  if (!fullName || !email || !password || !phone) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const [existing] = await db.query('SELECT user_id FROM Users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email already exists.' });
    }

    // ✅ Create new Firebase Auth user
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: fullName,
    });

    const firebaseUid = userRecord.uid;
    const hashed = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO Users (full_name, email, password_hash, phone, firebase_uid, created_at, role, account_status, active_status, role_id, is_verified)
       VALUES (?, ?, ?, ?, ?, ?, 'admin', 'active', 'active', 1, true)`,
      [fullName, email, hashed, phone, firebaseUid, new Date()]
    );

    res.status(201).json({ message: 'Admin account created.' });
  } catch (err) {
    console.error('Error creating admin:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateAccount = async (req, res) => {
  const { id } = req.params;
  const { fullName, email, phone, password, status } = req.body;

  try {
    const fields = [];
    const values = [];

    if (fullName) {
      fields.push('full_name = ?');
      values.push(fullName);
    }
    if (email) {
      fields.push('email = ?');
      values.push(email);
    }
    if (phone) {
      fields.push('phone = ?');
      values.push(phone);
    }
    if (status) {
      fields.push('account_status = ?');
      values.push(status);
    }
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      fields.push('password_hash = ?');
      values.push(hashed);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: 'No fields to update.' });
    }

    values.push(id);
    await db.query(`UPDATE Users SET ${fields.join(', ')} WHERE user_id = ?`, values);

    res.json({ message: 'Account updated successfully.' });
  } catch (err) {
    console.error('Error updating account:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteAccount = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM Users WHERE user_id = ?', [id]);
    res.json({ message: 'Account deleted successfully.' });
  } catch (err) {
    console.error('Error deleting account:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
