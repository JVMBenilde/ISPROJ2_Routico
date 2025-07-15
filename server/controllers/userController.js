import { db } from '../db.js';

export const getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT user_id, full_name, role, created_at, account_status, role_id FROM Users'
    );
    console.log('All users from database:', rows);
    console.log('Users with role_id 0:', rows.filter(user => user.role_id === 0));
    console.log('Users with role_id 1:', rows.filter(user => user.role_id === 1));
    res.json(rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};