const mongoose = require('mongoose');

const dbConfig = require('../../config/db');

function connection() {
  return new Promise((resolve, reject) => {
    mongoose.connect(dbConfig.url + dbConfig.db);

    const db = mongoose.connection;

    db.on('error', () => {
      // @TODO ErrorHandling!
      throw new Error('Error Handling!')
    });

    db.once('open', () => {
        resolve(db);
    });
  });
}

module.exports = {
  connect: connection
}
