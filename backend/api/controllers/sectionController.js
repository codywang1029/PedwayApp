'use strict';
const mongoose = require('mongoose');
const PedwaySection = mongoose.model('section');

/**
 * Returns all pedway sections
 *
 * @param {Object} req the request object
 * @param {Object} res the response object
 */
exports.getAll = function(req, res) {
  PedwaySection.find({}, function(err, entrances) {
    if (err) {
      res.send(err);
    } else {
      res.json(entrances);
    }
  });
};
