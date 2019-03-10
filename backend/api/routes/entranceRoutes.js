'use strict';
module.exports = function(app) {
  const entranceController = require('../controllers/entranceController');

  app.route('/api/pedway/entrance').get(entranceController.getAll);
};
