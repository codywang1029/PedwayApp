const express = require('express');
require('./api/models/statusModel'); // created model loading here
const bodyParser = require('body-parser');
const app = express();

const dbdisconnect = require('./connectDatabase')();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const routes = require('./api/routes/statusRoutes'); // importing routes
routes(app); // register the route

// Serves static files
app.use(express.static('frontend'));

// 404 function
app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'});
});

/**
 * This function will disconnect the database and any other connections as
 * needed
 */
function disconnect() {
  dbdisconnect();
}

module.exports = {
  app: app,
  disconnect: disconnect,
};
