import admin from '../firebaseAdmin.js';
import { db } from '../db.js';

export const verifyToken = async (req, res, next) => {
  try {
    console.log('[AUTH] Starting authentication...');
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('[AUTH] Missing or invalid auth header');
      return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }

    const token = authHeader.split(' ')[1];
    console.log('[AUTH] Verifying Firebase token...');
    const decodedToken = await admin.auth().verifyIdToken(token);
    const email = decodedToken.email;
    console.log('[AUTH] Firebase token verified for email:', email);

    const [[user]] = await db.query(
      'SELECT user_id, role FROM Users WHERE email = ?',
      [email]
    );

    if (!user) {
      console.log('[AUTH] User not found in database');
      return res.status(404).json({ message: 'User not found in database' });
    }

    console.log('[AUTH] User found:', { userId: user.user_id, role: user.role });

    let ownerId = null;
    if (user.role === 'business_owner') {
      console.log('[AUTH] Checking BusinessOwners table...');
      const [[owner]] = await db.query(
        'SELECT owner_id FROM BusinessOwners WHERE user_id = ?',
        [user.user_id]
      );

      if (owner) {
        ownerId = owner.owner_id;
        console.log('[AUTH] Business owner found with owner_id:', ownerId);
      } else {
        console.log('[AUTH] No BusinessOwners record found (this is normal for pending registrations)');
      }
    }

    req.user = {
      userId: user.user_id,
      role: user.role,
      owner_id: ownerId 
    };

    console.log('[AUTH] Authentication successful, proceeding to next middleware');
    next();
  } catch (err) {
    console.error('[AUTH] Authentication error:', err);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};


export const requireSuperAdmin = (req, res, next) => {
  if (req.user?.role !== 'super_admin') {
    return res.status(403).json({ message: 'Access denied: super admin only' });
  }
  next();
};
