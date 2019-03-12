const request = require('supertest');
const {MongoMemoryServer} = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;
let app;
let EntranceSchema;

beforeAll(async () => {
  mongoServer = new MongoMemoryServer();
  process.env['APP_DEPLOYMENT_MODE'] = 'testing';
  process.env['MONGODB_HOST'] = await mongoServer.getConnectionString();
  ({app, disconnect} = require('../src/app'));
  EntranceSchema = mongoose.model('entrance');
});

beforeEach(async () => {
  EntranceSchema.remove({});
});

afterAll(async () => {
  disconnect();
  mongoServer.stop();
});

describe('Test the root of the entrance api', () => {
  test('the default method should be empty', (done) => {
    request(app).get('/api/pedway/entrance').then((response) => {
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
      done();
    });
  });

  test('adding an entrance should return a single entrance', (done) => {
    new EntranceSchema({
      'type': 'Feature',
      'properties': {'@id': 'node/1469254509', 'entrance': 'yes'},
      'geometry': {'type': 'Point', 'coordinates': [-87.6306729, 41.8862637]},
      'id': 'node/1469254509',
    }).save();

    request(app).get('/api/pedway/entrance').then((response) => {
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      done();
    });
  });
});
