// src/app.js (CommonJS)
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const routes = require('./routes');

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Healthcheck simple
app.get('/health', (_, res) => res.json({ ok: true }));

// Montar rutas bajo /api
app.use('/api', routes);

module.exports = app;
