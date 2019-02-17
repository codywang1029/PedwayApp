var express = require('express'),
	mongoose = require('mongoose'),
	Task = require('./api/models/statusModel'), //created model loading here
	bodyParser = require('body-parser');
const app = express()

// The REST api is from a tutorial:
// 		https://www.codementor.io/olatundegaruba/nodejs-restful-apis-in-10-minutes-q0sgsfhbd
// mongoose instance connection url connection
mongoose.Promise = global.Promise;

var db;

if (process.env.MONGODB_URI === undefined) {
	db = mongoose.connect('mongodb://localhost/pedway',  {useNewUrlParser: true}); 
} else {
	db = mongoose.connect('mongodb://pedcosmosdb:'+process.env.MONGODB_URI+'==@pedcosmosdb.documents.azure.com:10250/pedway?ssl=true',  {useNewUrlParser: true});
}


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var routes = require('./api/routes/statusRoutes'); //importing routes
routes(app); //register the route

// Serves static files
app.use(express.static("frontend" ));

// 404 function
app.use(function(req, res) {
	res.status(404).send({url: req.originalUrl + ' not found'})
});

// This function will disconnect the database and any other connections as needed
function disconnect() {
	mongoose.connection.close()
}

module.exports = {
	app: app,
	disconnect: disconnect
}