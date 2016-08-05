/*eslint global-require: 0*/

const request = require('supertest');
const STATUS_OK = 200;

describe('loading express', () => {
  let server;

  beforeEach(() => {
    server = require('../../bin/www');
  });

  afterEach(() => {
    server.close();
  });

  it('responds to /', (done) => {
    request(server)
      .get('/')
      .expect(STATUS_OK, done);
  });
});
