'use strict';

const ORS_BASE_URL = 'https://api.openrouteservice.org';
const ORS_DIRECTION_URL = 'directions';
const ORS_MAPSURFER_URL = 'mapsurfer/';

const request = require('request');

if (process.env.ORS_API_KEY === undefined) {
  console.warn(
      'The openrouteservice.org API key is undefined, so any API requests made to ORS will fail.');
}

/**
 * Handles the directions endpoint, and forwards the request to ORS
 *
 * @param {Object} req the request object
 * @param {Object} res the response object
 */
exports.directions = function(req, res) {
  request
      .get({
        baseUrl: ORS_BASE_URL,
        url: ORS_DIRECTION_URL,
        qs: Object.assign({}, req.query, {
          'api_key': process.env.ORS_API_KEY,
        }),
      })
      .pipe(res);
};

/**
 * Handles the mapsurfer tile endpoint, and forwards the request to ORS
 *
 * @param {Object} req the request object
 * @param {Object} res the response object
 */
exports.mapsurfer = function(req, res) {
  request
      .get({
        baseUrl: ORS_BASE_URL,
        url: ORS_MAPSURFER_URL + req.params[0],
        qs: Object.assign({}, req.query, {
          'api_key': process.env.ORS_API_KEY,
        }),
      })
      .pipe(res);
};
