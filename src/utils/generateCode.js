// utils/generateCode.js (CommonJS)
function generateCode() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}
module.exports = { generateCode };
