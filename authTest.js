///////////////////////////
// set up environment
var session = require('express-session');
var express = require('express');
var app = express();

var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;

var GITHUB_CLIENT_ID = process.env.GHID;
var GITHUB_CLIENT_SECRET = process.env.GHSECRET;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Use the GitHubStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and GitHub
//   profile), and invoke a callback with a user object.
passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:8001/auth"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // To keep the example simple, the user's GitHub profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the GitHub account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

app.use(session({ secret: 'ivaylogetov' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));


///////////////////////////

// Express Routes
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    console.log("root page");
    res.sendFile(__dirname + '/public/staticindex.html');
});

app.get('/edit', ensureAuthenticated, function(req, res){
    console.log("edit page");
    console.log("user: " + Object.keys(req.user));
    console.log("user.id: " + req.user.id);
    console.log("user.displayName: " + req.user.displayName);
    console.log("user.username: " + req.user.username);


    res.sendFile(__dirname + '/public/staticindex.html');

});

// GET /auth/github
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in GitHub authentication will involve redirecting
//   the user to github.com.  After authorization, GitHub will redirect the user
//   back to this application at /auth/github/callback
app.get('/login',
  passport.authenticate('github', { scope: [ 'user:email' ] }),
  function(req, res){
    // The request will be redirected to GitHub for authentication, so this
    // function will not be called.
    res.sendFile(__dirname + '/public/staticindex.html');
  });


app.get('/auth',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    console.log("redirecting")
    res.redirect('/edit');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

///////////////////////////
// Start server
var server = app.listen(8001, function () {
    var host = server.address().address
    var port = server.address().port
    console.log('listening on http://%s:%s', host, port);
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}
