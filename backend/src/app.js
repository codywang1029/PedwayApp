const express = require('express');
// Load mongoose models into mongoose
require('../api/models')();
const bodyParser = require('body-parser');
const app = express();

const dbdisconnect = require('./databaseConnector')();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

require('../api/routes')(app); // register routes

// Serves static files from frontend directory
app.use(express.static('./frontend'));

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
