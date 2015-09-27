// set variables for environment
var express = require('express');
var app = express();
var favicon = require('serve-favicon');

var mongoose = require('mongoose');
var marked = require('marked');
var Project = require('./dbModels/project')

///////////////////////////
// MongoDB stuff
var renderer = new marked.Renderer();
renderer.link = function(href,title,text) {
    return '<a href="' + href + '" class="linkAnim" target="_blank">' + text + '</a>';
}
marked.setOptions({
    renderer: renderer,
    gfm: true,
    breaks: true
});

var key = process.env.KEY;
var mdbOptions = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }}
mongoose.connect('mongodb://ivaylopg:'+ key + '@localhost/ivaylogetovsite',mdbOptions);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.on('disconnected', function () {
  console.log('Mongoose connection has closed');
});

db.once('open', function (callback) {
  console.log("Connected to MongoDB");
});

///////////////////////////
// Express Routes
app.use(express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/public/favicon.ico'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

var server = app.listen(8001, function () {
	var host = server.address().address
	var port = server.address().port
	console.log('listening on http://%s:%s', host, port);
});


///////////////////////////
// Cleanup on Close
var gracefulExit = function() {
  db.close(function () {
    console.log('Mongoose connection has been disconnected through app termination');
    process.exit(0);
  });
}
// If the Node process ends, close the Mongoose connection
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);
