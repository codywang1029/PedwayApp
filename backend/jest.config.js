// This is following https://mongoosejs.com/docs/jest.html
module.exports = {
  testEnvironment: 'node',
  reporters: [
    'default',
    'jest-junit',
  ]
};
