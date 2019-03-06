'use strict';
module.exports = function(app) {
  const orsController = require('../controllers/orsController');

  app.route('/api/ors/directions').get(orsController.directions);
};
