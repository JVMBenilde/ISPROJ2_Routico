// File: controllers/authRoleController.js

import admin from '../firebaseAdmin.js';
import { db } from '../db.js';

export const getUserRole = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    const email = decodedToken.email;

    if (!email) {
      return res.status(400).json({ message: 'Email not found in token' });
    }

    const [[user]] = await db.query('SELECT role FROM Users WHERE email = ?', [email]);

    if (!user) {
      return res.status(404).json({ message: 'User not found in database' });
    }

    res.status(200).json({ role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
