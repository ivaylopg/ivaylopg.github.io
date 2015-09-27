/*eslint-disable */

var mongoose = require('mongoose');
var Project = require('./dbModels/project')

var key = process.env.KEY;
var mdbOptions = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }}
mongoose.connect('mongodb://ivaylopg:'+ key + '@localhost/ivaylogetovsite',mdbOptions);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.on('disconnected', function () {
  console.log('Mongoose connection has disconnected');
});

db.once('open', function (callback) {
  console.log("Connected to MongoDB");
});


/*
var projectData = new Project({
    title: ""
});

projectData.save(function (err, projectData) {
  if (err) return console.error(err);
  console.log("success");
});
//*/

/*
Project.find(function (err, projects) {
  if (err) return console.error(err);
  console.log(projects);
})
*/





var gracefulExit = function() {
  db.close(function () {
    console.log('Mongoose connection has been disconnected through app termination');
    process.exit(0);
  });
}
// If the Node process ends, close the Mongoose connection
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);
