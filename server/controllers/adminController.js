import { db } from '../db.js';
import bcrypt from 'bcrypt';
import admin from '../firebaseAdmin.js';

// ✅ Get all admin accounts
export const listAdmins = async (req, res) => {
  try {
    const [admins] = await db.query(
      `SELECT user_id, full_name, email, phone, active_status AS status 
       FROM Users 
       WHERE role = 'admin'`
    );
    res.status(200).json(admins);
  } catch (err) {
    console.error('Error listing admins:', err);
    res.status(500).json({ message: 'Server error in listing admins' });
  }
};

// ✅ Create a new admin
export const createAdmin = async (req, res) => {
  const { fullName, email, phone, password } = req.body;

  if (!fullName || !email || !phone || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const [[existing]] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
    if (existing) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    // ✅ Firebase Auth user creation (without phone)
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: fullName
    });

    await admin.auth().setCustomUserClaims(userRecord.uid, { role: 'admin', role_id: 1 });

    const hash = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO Users (
        firebase_uid, full_name, email, phone, password_hash, 
        role, role_id, active_status, is_verified, account_status, created_at
      ) VALUES (?, ?, ?, ?, ?, 'admin', 1, 'active', 1, 'active', NOW())`,
      [userRecord.uid, fullName, email, phone, hash]
    );

    res.status(201).json({ message: 'Admin created successfully' });
  } catch (err) {
    console.error('Error creating admin:', err);
    res.status(500).json({ message: 'Server error in creating admin' });
  }
};

// ✅ Update admin info
export const updateAdmin = async (req, res) => {
  const { userId } = req.params;
  const { fullName, email, phone } = req.body;

  try {
    await db.query(
      `UPDATE Users SET full_name = ?, email = ?, phone = ? 
       WHERE user_id = ? AND role = 'admin'`,
      [fullName, email, phone, userId]
    );
    res.status(200).json({ message: 'Admin updated successfully' });
  } catch (err) {
    console.error('Error updating admin:', err);
    res.status(500).json({ message: 'Server error in updating admin' });
  }
};

// ✅ Delete admin
export const deleteAdmin = async (req, res) => {
  const { userId } = req.params;

  try {
    await db.query(`DELETE FROM Users WHERE user_id = ? AND role = 'admin'`, [userId]);
    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (err) {
    console.error('Error deleting admin:', err);
    res.status(500).json({ message: 'Server error in deleting admin' });
  }
};
