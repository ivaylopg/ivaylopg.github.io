///////////////////////////
// set up environment
var express = require('express');
var app = express();
var favicon = require('serve-favicon');

var mongoose = require('mongoose');
var Project = require('./dbModels/project')

var swig = require('swig');
var marked = require('marked');
var markedSwig = require('swig-marked')

///////////////////////////
// MongoDB stuff

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
// Templates
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/templates');
app.set('view cache', true);
//swig.setDefaults({ cache: false });

markedSwig.useFilter( swig );
markedSwig.useTag( swig );

var renderer = new marked.Renderer();
renderer.link = function(href,title,text) {
    return '<a href="' + href + '" class="bolder linkAnim" target="_blank">' + text + '</a>';
}
var configured = markedSwig.configure({
    renderer: renderer,
    gfm: true,
    breaks: true
});

///////////////////////////
// Express Routes
app.use(express.static(__dirname + '/public'));
app.use('/tagged', express.static('public'));
app.use(favicon(__dirname + '/public/favicon.ico'));

app.get('/', function(req, res){

    Project.find(function (err, projects) {
        if (err) {
            //res.sendFile(__dirname + '/staticindex.html');
            return console.error(err);
        }

        if (projects != undefined && projects.length > 0) {
            var tags = [];
            for (var i=0, il=projects.length; i<il; i++) {
                 for (var j=0, jl=projects[i].tags.length; j<jl; j++) {
                    tags.push(projects[i].tags[j]);
                 }
            }
            console.log("index with %s projects",projects.length);
            res.render('index', {allProjects: projects, allTags: tags});
        } else {
            console.log("static page");
            //res.sendFile(__dirname + '/staticindex.html');
        }
    })


	//res.sendFile(__dirname + '/public/index.html');
});

app.get('/:data', function(req, res){
    var query = req.params.data;
    console.log("parameter entered: %s", query);
    var displayProj;

    Project.find(function (err, projects) {
        if (err) return console.error(err);

        for (var p = 0; p < projects.length; p++) {
            if (projects[p].linkText == query) {
                displayProj = projects[p]
                break;
            }
        }

        if (displayProj != undefined) {
            console.log(displayProj.title);
            res.render('project', displayProj);
        } else {
            console.log("no project!");
            res.render('index', projects);
        }
    })
});

app.get('/tagged/:data', function(req, res){
    var tag = req.params.data;
    console.log("tag parameter entered: %s", tag);
    getTaggedProjects(tag,function(displayProj){
        if (displayProj.length > 0) {
            console.log(displayProj.length);
        } else {
            console.log("no projects!");
        }
    });
    res.sendFile(__dirname + '/public/index.html');
  //res.render('index', {localTrackTerm: query});
});






///////////////////////////
// Start server
var server = app.listen(8001, function () {
	var host = server.address().address
	var port = server.address().port
	console.log('listening on http://%s:%s', host, port);
});

///////////////////////////
// Custom functions

function getTaggedProjects (queryTag, callback) {
    var taggedProjects = [];

    Project.find(function (err, projects) {
        if (err) return console.error(err);

        for (var p = 0; p < projects.length; p++) {
            var tagArray = projects[p].tags;

            for (var i=0, l=tagArray.length; i<l; i++) {
                if (tagArray[i].toLowerCase() == queryTag.toLowerCase()) {
                    taggedProjects.push(projects[p]);
                    break;
                }
            }
        }
        callback(taggedProjects);
    });
}


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
