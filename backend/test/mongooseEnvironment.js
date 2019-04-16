const PuppeteerEnvironment = require('jest-environment-puppeteer');

const {MongoMemoryServer} = require('mongodb-memory-server');

let mongoServer;

/**
 * Custom subclass of the Node Environment to setup and teardown an in-memory
 * Mongo Server.
 */
class MongooseEnvironment extends PuppeteerEnvironment {
  /**
   * Sets up the Mongo Server and exports its info into a global variable
   * @return {Promise<void>}
   */
  async setup() {
    await super.setup();
    mongoServer = new MongoMemoryServer();
    this.global.__MONGODB_HOST__ = await mongoServer.getConnectionString();
  }

  /**
   * Tears down the Mongo Server
   * @return {Promise<void>}
   */
  async teardown() {
    mongoServer.stop();
    await super.teardown();
  }
}

module.exports = MongooseEnvironment;
