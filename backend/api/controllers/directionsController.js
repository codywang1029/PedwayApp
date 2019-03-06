'use strict';

const ORS_DIRECTION_URL = 'https://api.openrouteservice.org/directions';

const url = require('url');

exports.directions = function(req, res) {
  res.redirect(url.format({
    pathname: ORS_DIRECTION_URL,
    query: {
      ...req.query,
      ...{
        'api_key': process.env.ORS_API_KEY,
      }
    }
  }))
};
