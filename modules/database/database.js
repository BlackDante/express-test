const mongoose = require('mongoose');

const dbConfig = require('../../config/db');

/**
 * Metoda służąca do połączenia się z bazą danych.
 *
 * @method connection
 *
 * @return {Promise} Instancja obiektu Promise.
 */
function connection() {
  return new Promise((resolve, reject) => {
    mongoose.connect(dbConfig.url + dbConfig.db);

    const db = mongoose.connection;

    db.on('error', (error) => {
      reject(error);
    });

    db.once('open', () => {
      resolve(db);
    });
  });
}

module.exports = {
  connect: connection
}
