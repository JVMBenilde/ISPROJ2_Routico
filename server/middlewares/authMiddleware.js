import admin from '../firebaseAdmin.js';
import { db } from '../db.js';

// Middleware to verify Firebase token and attach user info
export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    const email = decodedToken.email;

    const [[user]] = await db.query(
      'SELECT user_id, role FROM Users WHERE email = ?',
      [email]
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found in database' });
    }

    req.user = { userId: user.user_id, role: user.role };
    next();
  } catch (err) {
    console.error('Auth error:', err);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Middleware to check if user is a super admin
export const requireSuperAdmin = (req, res, next) => {
  if (req.user?.role !== 'super_admin') {
    return res.status(403).json({ message: 'Access denied: super admin only' });
  }
  next();
};