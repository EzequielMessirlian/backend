// routes/user.router.js (CommonJS)
const express = require('express');
const { requireAuth } = require('../middlewares/auth.middleware');
const UserDTO = require('../dtos/user.dto');
const { userRepository } = require('../repositories');

const router = express.Router();

// GET /api/users/current
router.get('/current', requireAuth, (req, res) => {
  // req.user viene del token (id, email, role)
  const user = userRepository.getByEmail(req.user.email);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const dto = new UserDTO(user);
  res.json(dto);
});

module.exports = router;
