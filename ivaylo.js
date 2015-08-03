// set variables for environment
var express = require('express');
var app = express();
var favicon = require('serve-favicon');

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