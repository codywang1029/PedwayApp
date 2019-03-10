'use strict';
module.exports = function(app) {
  const orsController = require('../controllers/orsController');

  app.route('/api/ors/directions').get(orsController.directions);
  app.route('/api/ors/mapsurfer/:zoom/:x/:y.png').get(orsController.mapsurfer);
  app.route('/api/ors/pois').post(orsController.pois);
};
