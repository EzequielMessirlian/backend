// repositories/user.repository.js (CommonJS)
class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }
  getByEmail(email) { return this.dao.getByEmail(email); }
  getById(id) { return this.dao.getById(id); }
  create(data) { return this.dao.create(data); }
  update(id, data) { return this.dao.update(id, data); }
}
module.exports = UserRepository;
