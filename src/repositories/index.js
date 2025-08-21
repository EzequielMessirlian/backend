// repositories/index.js (CommonJS)
const path = require('path');
const UserDAO = require('../dao/user.dao');
const UserRepository = require('./user.repository');

const userDAO = new UserDAO();
const userRepository = new UserRepository(userDAO);

module.exports = {
  userRepository
};
