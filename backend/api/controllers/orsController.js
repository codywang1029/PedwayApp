'use strict';

const ORS_BASE_URL = 'https://api.openrouteservice.org';
const ORS_DIRECTION_URL = 'directions';

const request = require('request');

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
