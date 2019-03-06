'use strict';
module.exports = function(app) {
  const directions = require('../controllers/directionsController');

  // todoList Routes
  app.route('/api/ors/directions').all(directions.directions)
};