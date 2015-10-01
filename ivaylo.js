///////////////////////////
// set up environment
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var favicon = require('serve-favicon');
var jsonParser = bodyParser.json()

var mongoose = require('mongoose');
var Project = require('./dbModels/project')

var swig = require('swig');
var marked = require('marked');
var markedSwig = require('swig-marked')

var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

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
// Passport Stuff

var GITHUB_CLIENT_ID = process.env.GHID;
var GITHUB_CLIENT_SECRET = process.env.GHSECRET;
var GITHUB_USER = process.env.GHUSER;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:8001/auth/github"
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

app.use(session({secret: 'ivaylogetov',
                 saveUninitialized:false,
                 resave:true,
                 cookie: {maxAge: 1000 * 60 * 60 * 24},
                 store: new MongoStore({mongooseConnection:db})
                }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));

///////////////////////////
// Express Routes
app.use(express.static(__dirname + '/public'));
//app.use('/tagged/', express.static('public'));
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
            //console.log("index with %s projects",projects.length);
            res.render('index', {allProjects: projects, allTags: tags});
        } else {
            console.log("static page");
            //res.sendFile(__dirname + '/staticindex.html');
        }
    })


	//res.sendFile(__dirname + '/public/index.html');
});

app.get('/edit', ensureAuthenticated, function(req, res){
    //console.log("user.id: " + req.user.id);
    Project.find(function (err, projects) {
        if (err) {
            //res.sendFile(__dirname + '/staticindex.html');
            return console.error(err);
        }

        if (req.user.id == GITHUB_USER) {
            if (projects != undefined && projects.length > 0) {
            res.render('edit', {allProjects: projects});
            } else {

            }
        } else {
            res.redirect('/');
        }
    })
});

app.get('/login',
  passport.authenticate('github', { scope: [ 'user:email' ] }),
  function(req, res){
    console.error("this should never get called...")
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/auth/github',
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/edit');
});

app.get('/:data', function(req, res){
    var query = req.params.data;
    // console.log("parameter entered: %s", query);
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
            res.render('project', displayProj);
        } else {
            console.error("Error: Attempted to retrieve project called %s", query);
            res.render('index', projects);
        }
    })
});

app.get('/tagged/:data', function(req, res){
    var tag = req.params.data;
    // console.log("tag parameter entered: %s", tag);
    getTaggedProjects(tag,function(displayProj,tags){
        if (displayProj.length > 0) {
            if (tag == 'allprojects') tag = undefined;
            res.render('tagged', {projects: displayProj, tagged: tag, allTags: tags});
        } else {
            console.log("static page");
            //res.sendFile(__dirname + '/staticindex.html');
        }
    });
});

app.post('/getproject', jsonParser, function(req, res){
    var queryID = JSON.parse(req.body.id);

    Project.findById(queryID, function(err, project) {
        if (err) {
            res.send({"error": "Could not load project!"});
            throw err;
        }
        res.send(project);
    });
});

app.post('/deleteproject', ensureAuthenticated, jsonParser, function(req, res){
   var queryID = req.body.id;

   res.send({message:"Project Deleted"});
});

app.post('/updateproject', ensureAuthenticated, jsonParser, function(req, res){
    var queryID = req.body.id;
    var newProject = req.body.project;
    //console.log(newProject);

    Project.findById(queryID, function(err, project) {
        if (err) {
            res.send({"error": "Could not update project!"});
            throw err;
        }
        var updates = "";
        var updatesObject = {};

        for (var key in project) {
            if (newProject[key] != undefined && newProject[key] != project[key] && typeof newProject[key] !== 'function') {
                project[key] = newProject[key];
                updates += "Updated: " + key + " | ";
                updatesObject[key] = {'old':project[key], 'new': newProject[key]}
                console.log(updatesObject[key])
            }
        }

        if (updates != "") {
            project.save(function(err) {
                if (err) {throw err;}
                res.send(updatesObject);
            });
        }
    });
});

app.post('/addproject', ensureAuthenticated, jsonParser, function(req, res){
   var queryID = req.body.id;

   res.send({message:"Project added"});
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

        var allTags = [];
        for (var p = 0; p < projects.length; p++) {
            var tagArray = projects[p].tags;

            for (var i=0, l=tagArray.length; i<l; i++) {
                allTags.push(tagArray[i])
                if (tagArray[i].toLowerCase() == queryTag.toLowerCase()) {
                    taggedProjects.push(projects[p]);
                }
            }
        }
        if (queryTag == 'allprojects') {
            callback(projects,allTags);
        } else {
            callback(taggedProjects,allTags);
        }
    });
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
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
