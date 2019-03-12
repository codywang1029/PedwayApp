const request = require('supertest');
const {MongoMemoryServer} = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;
let app;
let SectionSchema;

beforeAll(async () => {
  mongoServer = new MongoMemoryServer();
  process.env['APP_DEPLOYMENT_MODE'] = 'testing';
  process.env['MONGODB_HOST'] = await mongoServer.getConnectionString();
  ({app, disconnect} = require('../src/app'));
  SectionSchema = mongoose.model('section');
});

beforeEach(async () => {
  SectionSchema.remove({});
});

afterAll(async () => {
  disconnect();
  mongoServer.stop();
});

describe('Test the root of the entrance api', () => {
  test('the default method should be empty', (done) => {
    request(app).get('/api/pedway/section').then((response) => {
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
      done();
    });
  });

  test('adding an entrance should return a single entrance', (done) => {
    new SectionSchema({
      'type': 'Feature',
      'properties': {
        'OBJECTID': 35,
        'PED_ROUTE': 'ONE ILLINOIS CENTER - TWO ILLINOIS CENTER WALKWAY',
        'SHAPE_LEN': 201.999236,
      },
      'geometry': {
        'type': 'MultiLineString',
        'coordinates': [[
          [-87.623053972872867, 41.887066159936772],
          [-87.623071155091367, 41.88762032643141],
        ]],
      },
    }).save();

    request(app).get('/api/pedway/section').then((response) => {
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      done();
    });
  });
});
