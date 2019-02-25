var connectDatabase = require('./connectDatabase');
mongoose = require('mongoose');

describe('Test the database connection', () => {
	test('it should connect and disconnect to the database', (done) => {
    var disconnect = connectDatabase();
    disconnect().then(()=>{
      expect(mongoose.connection.readyState).toBe(0);
      done();
    });
  });

  test('it should connect and disconnect multiple times', (done) => {
    var disconnect = connectDatabase();
    disconnect().then(()=>{
      expect(mongoose.connection.readyState).toBe(0);
      var disconnect = connectDatabase();
      disconnect().then(()=>{
        expect(mongoose.connection.readyState).toBe(0);
        var disconnect = connectDatabase();
        disconnect().then(done);
      });
    });
  });

  test('it should not connect twice', (done) => {
    var disconnect = connectDatabase();
    expect(connectDatabase).toThrow(Error);
    disconnect().then(done);
  });

  test('it should discconnect twice', (done) => {
    var disconnect = connectDatabase();
    disconnect().then(()=>{
      disconnect().then(done);
    });
  });
});