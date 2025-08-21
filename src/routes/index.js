// src/routes/index.js (CommonJS)
const express = require('express');
const router = express.Router();

try { router.use('/products', require('./products')); } catch {}
try { router.use('/carts', require('./carts')); } catch {}
try { router.use('/users', require('./user.router')); } catch {}

try { router.use('/auth', require('./auth')); } catch {}

module.exports = router;
