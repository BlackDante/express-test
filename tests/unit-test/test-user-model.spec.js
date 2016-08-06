const assert = require('chai').assert;
const mongoose = require('mongoose');
const User = require('../../models/user');
let db;

describe('Account', function() {

  before(function(done) {
    db = mongoose.connect('mongodb://localhost/test');
      done();
  });

  after(function(done) {
    mongoose.connection.close();
    done();
  });

  beforeEach(function(done) {
    const user = new User({
      username: '12345',
      password: 'testy'
    });

    user.save(function(error) {
      if (error) console.log('error' + error.message);
      else console.log('no error');
      done();
    });
  });

  it('find a user by username', function(done) {
    User.findOne({ username: '12345' }, function(err, user) {
      assert.equal(user.username, '12345');
      done();
    });
  });

  afterEach(function(done) {
    User.remove({}, function() {
      done();
    });
  });

});
