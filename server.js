require('dotenv').config();
// server.js (CommonJS)
const app = require('./src/app');

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
});
