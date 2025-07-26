import jwt from 'jsonwebtoken';
import { createTransport } from 'nodemailer';

const secret = process.env.JWT_SECRET;

export function generateResetToken(email) {
  return jwt.sign({ email }, secret, { expiresIn: '1h' });
}

export function verifyResetToken(token) {
  try {
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
}

export async function sendResetEmail(email, token) {
  const transport = createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const link = `http://localhost:8080/reset-password/${token}`;
  const result = await transport.sendMail({
    from: 'CoderProject <no-reply@coder.com>',
    to: email,
    subject: 'Reset your password',
    html: `<p>Click the button below to reset your password. This link expires in 1 hour.</p>
           <a href="${link}"><button>Reset Password</button></a>`
  });

  return result;
}
