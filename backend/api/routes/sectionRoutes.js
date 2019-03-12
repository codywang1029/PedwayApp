'use strict';
module.exports = function(app) {
  const sectionController = require('../controllers/sectionController');

  app.route('/api/pedway/section').get(sectionController.getAll);
};
