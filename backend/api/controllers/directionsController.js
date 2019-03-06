'use strict';

const ORS_DIRECTION_URL = 'https://api.openrouteservice.org/directions';

const url = require('url');
const https = require('https');

exports.directions = function(req, res) {
  https.request(url.format({
    pathname: ORS_DIRECTION_URL,
    query: {
      ...req.query,
      ...{
        'api_key': process.env.ORS_API_KEY,
      },
    }
  }), function(response) {
    response.pipe(res);
  }).on('error', function(e) {
    res.sendStatus(500);
  }).end();
};
