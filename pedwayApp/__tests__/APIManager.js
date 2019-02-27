import APIManager from '../APIManager';
// Test case for this part is under construction

beforeAll(()=> {
  jest.mock('realm', () => {
    return require('../../mocks/Realm').default;
  });
})

test('Dummy test case for testing purpose', () => {
  expect(1+1).toBe(2);
});

// we have to let Jest exit by adding a mock for Realm
afterAll(()=> setTimeout(() => process.exit(), 1000));

