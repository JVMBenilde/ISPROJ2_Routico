import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const sendEmail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,            // ✅ force SSL
    secure: true,         // ✅ use SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Routico" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Your OTP Code',
      text: `Your OTP is: ${otp}`,
      html: `<p>Your OTP is: <b>${otp}</b></p>`,
    });
  } catch (err) {
    console.error('Failed to send email:', err);
    throw err;
  }
};
