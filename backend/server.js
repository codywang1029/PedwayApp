
var express = require('express'),
	app = express(),
	port = process.env.PORT || 3000,
	mongoose = require('mongoose'),
	Task = require('./api/models/statusModel'), //created model loading here
	bodyParser = require('body-parser');
	
// The REST api is from a tutorial:
// 		https://www.codementor.io/olatundegaruba/nodejs-restful-apis-in-10-minutes-q0sgsfhbd
// mongoose instance connection url connection
mongoose.Promise = global.Promise;

if (process.env.MONGODB_URI === undefined) {
	mongoose.connect('mongodb://foouser:foopwd@localhost/pedway',  {useNewUrlParser: true}); 
} else {
	mongoose.connect('mongodb://pedcosmosdb:'+process.env.MONGODB_URI+'==@pedcosmosdb.documents.azure.com:10250/pedway?ssl=true',  {useNewUrlParser: true});
}


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var routes = require('./api/routes/statusRoutes'); //importing routes
routes(app); //register the route

// Serves static files
app.use(express.static(__dirname + "/frontend" ));

// 404 function
app.use(function(req, res) {
	res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(port);


console.log('todo list RESTful API server started on: ' + port);