const db = require('../config/db');

exports.testConnection = (callback) => {
  db.query('SELECT 1', callback);
};
