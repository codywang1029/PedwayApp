'use strict';


const mongoose = require('mongoose');
const Status = mongoose.model('status');

exports.listStatus = function(req, res) {
  // Checks for existence of general status
  Status.find({}, function(err, status) {
    if (err) res.send(err);
    res.json(status);
  });
};

exports.createAStatus = function(req, res) {
  const newTask = new Status(req.body);
  newTask.save(function(err, status) {
    if (err) res.send(err);
    res.json(status);
  });
};

exports.createGeneralStatus = function(req, res) {
  Status.findOneAndUpdate(
      {_id: '000000000000000000000000'}, req.body, {upsert: true},
      function(err, status) {
        if (err) {
          res.send(err);
        } else {
          res.json(status);
        }
      });
};


exports.readAStatus = function(req, res) {
  Status.findById(req.params.sectionId, function(err, status) {
    if (err) res.send(err);
    res.json(status);
  });
};


exports.updateAStatus = function(req, res) {
  Status.findOneAndUpdate(
      {_id: req.params.sectionId}, req.body, {new: true},
      function(err, status) {
        if (err) {
          console.log(err);
          res.send(err);
        }
        res.json(status);
      });
};


exports.deleteAStatus = function(req, res) {
  Status.deleteOne({_id: req.params.sectionId}, function(err, task) {
    if (err) res.send(err);
    res.json({message: 'Section Status successfully deleted'});
  });
};

// Helper function for testing purposes
exports.deleteAll = function(callback) {
  // console.warn("This function should only be called for testing purposes")
  Status.remove({}, callback);
};
