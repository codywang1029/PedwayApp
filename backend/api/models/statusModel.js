'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var TaskSchema = new Schema({
	name: {
		type: String,
		required: 'The name of the section'
	},
	Created_date: {
		type: Date,
		default: Date.now
	},
	status: {
		type: String,
		enum: ['closed', 'dirty', 'closing', 'open'],
		default: 'open'
	}
});

module.exports = mongoose.model('status', TaskSchema);