import { db } from '../db.js';

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  try {
    const [[user]] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const [tokens] = await db.query(
      `SELECT * FROM UserToken
       WHERE user_id = ? AND token = ? AND token_type = 'email_verification'
         AND expires_at > NOW() AND used_at IS NULL`,
      [user.user_id, otp]
    );

    if (tokens.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    await db.query('UPDATE Users SET is_verified = true WHERE user_id = ?', [user.user_id]);
    await db.query('UPDATE UserToken SET used_at = NOW() WHERE user_id = ? AND token = ?', [user.user_id, otp]);

    res.status(200).json({ message: 'Email verified and user activated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error verifying OTP' });
  }
};