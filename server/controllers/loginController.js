import bcrypt from 'bcrypt';
import { db } from '../../server/db.js';
import { SignJWT } from 'jose';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginUser = async (req, res) => {
  const parseResult = loginSchema.safeParse(req.body);

  if (!parseResult.success) {
    console.log('[LOGIN] Invalid input:', req.body);
    res.status(400).json({ errors: parseResult.error.flatten().fieldErrors });
    return;
  }

  const { email, password } = parseResult.data;
  console.log('[LOGIN] Attempt:', email);

  try {
    const [[user]] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
    if (!user) {
      console.log('[LOGIN] No user found for:', email);
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      console.log('[LOGIN] Password mismatch for:', email);
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    if (!user.is_verified) {
      console.log('[LOGIN] User not verified:', email);
      res.status(403).json({ message: 'Please verify your email before logging in' });
      return;
    }

    const token = await new SignJWT({ user_id: user.user_id })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1h')
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));

    console.log('[LOGIN] Success:', email);
    res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; SameSite=Strict`);
    res.status(200).json({
  message: 'Login successful',
  role: user.role,
});
  } catch (error) {
    console.error('[LOGIN] Server error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
