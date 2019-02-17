const {app} = require("./app"),
	port = process.env.PORT || 3000,
	mongoose = require('mongoose');


app.listen(port, ()=>{
	console.log('todo list RESTful API server started on: ' + port);
});