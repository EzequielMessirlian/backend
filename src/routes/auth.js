// routes/auth.js (CommonJS)
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateResetToken, verifyResetToken, sendResetEmail } = require('../services/passwordReset.service');
const { userRepository } = require('../repositories');
const UserDTO = require('../dtos/user.dto');

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password are required' });
  const user = userRepository.getByEmail(email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = bcrypt.compareSync(password, user.password);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, user: new UserDTO(user) });
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'email is required' });
  const user = userRepository.getByEmail(email);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const token = generateResetToken(email);
  const base = process.env.BASE_URL || 'http://localhost:5173';
  const resetUrl = `${base}/reset-password?token=${token}`;
  try {
    await sendResetEmail(email, resetUrl);
  } catch (e) {
    // Si el mail falla, igualmente devolvemos el link para verificación manual
    return res.json({ status: 'sent-dev', resetUrl });
  }
  res.json({ status: 'sent' });
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) return res.status(400).json({ error: 'token and newPassword are required' });

  const payload = verifyResetToken(token);
  if (!payload) return res.status(400).json({ error: 'Invalid or expired token' });

  const user = userRepository.getByEmail(payload.email);
  if (!user) return res.status(404).json({ error: 'User not found' });

  // Evitar que sea igual a la anterior
  const same = bcrypt.compareSync(newPassword, user.password || '');
  if (same) return res.status(400).json({ error: 'New password must differ from the previous one' });

  const hashed = bcrypt.hashSync(newPassword, 10);
  userRepository.update(user.id, { password: hashed });

  res.json({ status: 'ok' });
});

module.exports = router;
