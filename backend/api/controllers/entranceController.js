'use strict';
const mongoose = require('mongoose');
const PedwayEntrance = mongoose.model('entrance');

/**
 * Returns all pedway entrances
 *
 * @param {Object} req the request object
 * @param {Object} res the response object
 */
exports.getAll = function(req, res) {
  PedwayEntrance.find({}, function(err, entrances) {
    if (err) {
      res.send(err);
    } else {
      res.json(entrances);
    }
  });
};
