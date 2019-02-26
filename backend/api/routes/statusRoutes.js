'use strict';
module.exports = function(app) {
  const status = require('../controllers/statusController');

  // todoList Routes
  app.route('/api/status')
      .get(status.listStatus)
      .post(status.createAStatus)
      .head(status.createGeneralStatus);


  app.route('/api/status/:sectionId')
      .get(status.readAStatus)
      .post(status.updateAStatus)
      .delete(status.deleteAStatus);
};
