'use strict';
module.exports = function(app) {
	var status = require('../controllers/statusController');

	// todoList Routes
	app.route('/api/status')
		.get(status.list_status)
		.post(status.create_a_status)
		.head(status.create_general_status);


	app.route('/api/status/:sectionId')
		.get(status.read_a_status)
		.post(status.update_a_status)
		.delete(status.delete_a_status);
};

