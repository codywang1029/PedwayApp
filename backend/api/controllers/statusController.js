'use strict';


var mongoose = require('mongoose'),
Status = mongoose.model('status');

exports.list_status = function(req, res) {
	// Checks for existence of general status
	Status.find({}, function(err, status) {
		if (err)
			res.send(err);
		res.json(status);
	});
};

exports.create_a_status = function(req, res) {
	var new_task = new Status(req.body);
	new_task.save(function(err, status) {
		if (err)
			res.send(err);
		res.json(status);
  });
};

exports.create_general_status = function(req, res) {
	Status.findOneAndUpdate({_id: "000000000000000000000000"}, req.body, {upsert:true}, function(err, status) {
		if (err) {
			res.send(err);
		} else {
			res.json(status);
		}
	});
};


exports.read_a_status = function(req, res) {
	Status.findById(req.params.sectionId, function(err, status) {
		if (err)
			res.send(err);
		res.json(status);
	});
};


exports.update_a_status = function(req, res) {
	Status.findOneAndUpdate({_id: req.params.sectionId}, req.body, {new: true}, function(err, status) {
		if (err) {
			console.log(err)
			res.send(err);
		}
		res.json(status);
	});
};


exports.delete_a_status = function(req, res) {
	Status.deleteOne({
		_id: req.params.sectionId
	}, function(err, task) {
		if (err)
			res.send(err);
		res.json({ message: 'Section Status successfully deleted' });
	});
};

