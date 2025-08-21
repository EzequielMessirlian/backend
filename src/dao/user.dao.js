// dao/user.dao.js (CommonJS) -- file-based DAO using JSON
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_PATH = path.join(__dirname, '..', 'data', 'users.json');

function ensureFile() {
  try {
    if (!fs.existsSync(DATA_PATH)) {
      fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
      fs.writeFileSync(DATA_PATH, JSON.stringify([]), 'utf-8');
    }
  } catch {}
}

function readAll() {
  ensureFile();
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(raw || '[]');
}

function writeAll(list) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(list, null, 2), 'utf-8');
}

class UserDAO {
  getByEmail(email) {
    const users = readAll();
    return users.find(u => u.email === email) || null;
  }
  getById(id) {
    const users = readAll();
    return users.find(u => u.id === id) || null;
  }
  create(data) {
    const users = readAll();
    const id = (Date.now()).toString(36);
    const hashed = bcrypt.hashSync(data.password, 10);
    const user = { id, ...data, password: hashed, role: data.role || 'user' };
    users.push(user);
    writeAll(users);
    return user;
  }
  update(id, data) {
    const users = readAll();
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...data };
    writeAll(users);
    return users[idx];
  }
}
module.exports = UserDAO;
