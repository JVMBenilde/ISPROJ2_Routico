import { db } from '../db.js';

export const getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT user_id, full_name, role, created_at, account_status, role_id FROM Users WHERE role_id = 2'
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};