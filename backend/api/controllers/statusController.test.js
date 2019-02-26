const request = require('supertest');
const {app, disconnect} = require('../../app');
const {deleteAll} = require('./statusController');

afterAll(disconnect);

describe('Test the root of the status api', () => {
  beforeEach((done) => {
    deleteAll(done);
  });

  test('it should respond to the GET method', (done) => {
    request(app).get('/api/status').then((response) => {
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
      done();
    });
  });

  test('it should respond to the HEAD method', (done) => {
    request(app).head('/api/status').then((response) => {
      expect(response.statusCode).toBe(200);
      request(app).get('/api/status').then((response) => {
        expect(response.body.length > 0).toBe(true);
        expect(response.body[0]['_id']).toBe('000000000000000000000000');
        expect(response.body[0]['status']).toBe('open');
        done();
      });
    });
  });

  test('it should respond to the POST method', (done) => {
    request(app)
        .post('/api/status')
        .send({name: 'Test Section'})
        .then((response) => {
          expect(response.statusCode).toBe(200);
          expect(typeof response.body).toBe('object');
          expect(response.body['name']).toBe('Test Section');
          expect(response.body['status']).toBe('open');

          const id = response.body['_id'];

          request(app).get('/api/status').then((response) => {
            expect(response.statusCode).toBe(200);
            expect(response.body.length).toBe(1);
            expect(response.body[0]['_id']).toBe(id);
            expect(response.body[0]['name']).toBe('Test Section');
            expect(response.body[0]['status']).toBe('open');
            done();
          });
        });
  });
});

describe('Test the specific sections of the status api', () => {
  let id;
  beforeEach((done) => {
    // Clear data and Upload test status to the API
    deleteAll(() => {
      request(app)
          .post('/api/status')
          .send({name: 'Test Section'})
          .then((response) => {
            id = response.body['_id'];
            done();
          });
    });
  });

  test('it should respond to the GET method', (done) => {
    request(app).get('/api/status/' + id).then((response) => {
      expect(response.statusCode).toBe(200);
      expect(typeof response.body).toBe('object');
      expect(response.body['name']).toBe('Test Section');
      expect(response.body['_id']).toBe(id);
      done();
    });
  });

  test('it should respond to the POST method', (done) => {
    request(app)
        .post('/api/status/' + id)
        .send({name: 'New Name', status: 'closed'})
        .then((response) => {
          expect(response.statusCode).toBe(200);
          request(app).get('/api/status').then((response) => {
            expect(response.body.length > 0).toBe(true);
            expect(response.body[0]['_id']).toBe(id);
            expect(response.body[0]['name']).toBe('New Name');
            expect(response.body[0]['status']).toBe('closed');

            // Check if the database has been updated
            request(app).get('/api/status/' + id).then((response) => {
              expect(response.statusCode).toBe(200);
              expect(typeof response.body).toBe('object');
              expect(response.body['name']).toBe('New Name');
              expect(response.body['_id']).toBe(id);
              done();
            });
          });
        });
  });

  test(
      'it should respond to the DELETE methid',
      (done) => {
        request(app).delete('/api/status/' + id).then((response) => {
          expect(response.statusCode).toBe(200);
          expect(response.body['message'])
              .toBe('Section Status successfully deleted');

          // Check if the database has been updated
          request(app).get('/api/status').then((response) => {
            expect(response.statusCode).toBe(200);
            expect(response.body.length).toBe(0);
            done();
          });
        });
      });
});
