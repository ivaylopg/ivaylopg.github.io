var mongoose = require('mongoose');
var key = process.env.KEY;
var mdbOptions = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }}
mongoose.connect('mongodb://ivaylopg:'+ key + '@localhost/ivaylogetovsite',mdbOptions);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.on('disconnected', function () {
  console.log('Mongoose connection has disconnected');
});

db.once('open', function (callback) {
  console.log("success");
});



var gracefulExit = function() {
  db.close(function () {
    console.log('Mongoose connection has been disconnected through app termination');
    process.exit(0);
  });
}
// If the Node process ends, close the Mongoose connection
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);
