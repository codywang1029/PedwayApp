mongoose = require('mongoose')
mongoose.Promise = global.Promise;

// connects mongoose to the correct database depending on the enviornment context
// Returns the disconnect function
module.exports = function(opts={useNewUrlParser: true}) {  
  var password = process.env.MONGODB_URI 
  var uname = process.env.MONGODB_UNAME // pedcosmosdb
  var host = process.env.MONGODB_HOST // pedcosmosdb.documents.azure.com:10250/pedway?ssl=true

  if (process.env.APP_DEPLOYMENT_MODE === undefined) {
    mongoose.connect('mongodb://localhost/pedway', opts);
  } else if (process.env.APP_DEPLOYMENT_MODE === 'production'){
    // prodcution password ends in two equal signs which breaks in azure
    mongoose.connect('mongodb://'+uname+':'+password+'==@'+host, opts);
  } else {
    // allows the connection to some custom server
    mongoose.connect('mongodb://'+uname+':'+password+'@'+host, opts);
  }

  return () => mongoose.connection.close();
}