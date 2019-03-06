require('dotenv').config();
const request = require('supertest');
const {app, disconnect} = require('../src/app');

afterAll(disconnect);

describe('Conditional test using the ors endpoint', () => {
  const testIfORSAPIKeyAvailable =
      process.env.ORS_API_KEY === undefined ? test.skip : test;
  testIfORSAPIKeyAvailable(
      'it should respond to the GET method on the directions endpoint',
      (done) => {
        request(app)
            .get(
                '/api/ors/directions?coordinates=8.34234%2C48.23424%7C8.34423%2C48.26424&profile=driving-car')
            .then((response) => {
              expect(response.statusCode).toBe(200);
              expect(typeof response.body).toBe('object');
              expect(Array.isArray(response.body['routes'])).toBe(true);
              done();
            });
      });
});
