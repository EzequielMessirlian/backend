// services/passwordReset.service.js (CommonJS)
const jwt = require('jsonwebtoken');
const { createTransport } = require('nodemailer');

const secret = process.env.JWT_SECRET;

function generateResetToken(email) {
  return jwt.sign({ email }, secret, { expiresIn: '1h' });
}

function verifyResetToken(token) {
  try {
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
}

async function sendResetEmail(toEmail, resetUrl) {
  const transporter = createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const info = await transporter.sendMail({
    from: `"Soporte" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: 'Restablecer contraseña',
    html: `<p>Hacé clic en el botón para restablecer tu contraseña. El enlace expira en 1 hora.</p>
           <p><a href="${resetUrl}" style="background:#0d6efd;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;">Restablecer contraseña</a></p>`
  });
  return info;
}

module.exports = { generateResetToken, verifyResetToken, sendResetEmail };
