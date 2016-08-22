///////////////////////////
// set up environment
var express = require('express');
var app = express();


///////////////////////////
// Express Routes
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});


///////////////////////////
// Start server
var server = app.listen(8001, function () {
	var host = server.address().address
	var port = server.address().port
	console.log('listening on http://%s:%s', host, port);
});
