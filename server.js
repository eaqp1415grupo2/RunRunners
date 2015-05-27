var express = require("express"),
    http    = require("http"),
    server  = http.createServer(app),
    passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy,
    session = require('express-session'),
    socialConfig = require('./config/social'),
    mongoose = require('mongoose');

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new FacebookStrategy({
        clientID: socialConfig.facebook.clientId,
        clientSecret: socialConfig.facebook.clientSecret,
        callbackURL: socialConfig.facebook.callbackUrl
    },
    function(accessToken, refreshToken, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {

            // To keep the example simple, the user's Facebook profile is returned to
            // represent the logged-in user.  In a typical application, you would want
            // to associate the Facebook account with a user record in your database,
            // and return that user instead.
            return done(null, profile);
        });
    }
));

var app = express();

app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(session({ secret: 'keyboard cat' }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
});



var https = require('https'),
    fs = require('fs');
var sslOptions = {
    key: fs.readFileSync('./ssl/server.key'),
    cert: fs.readFileSync('./ssl/server.crt'),
    ca: fs.readFileSync('./ssl/ca.crt'),
    requestCert: true,
    rejectUnauthorized: false
};

var secureServer = https.createServer(sslOptions,app).listen('3030', function(){
    console.log("Secure Express server listening on port 3030");
});


//habilita los archivos secundarios de resources y js necesarios de /web
//app.use(express.static('web'));
app.use(express.static('www'));
//de momento redirige a wall, a la espera de login

app.get('/ionic', function(req, res) {
    res.sendfile('./www/index.html');
});

app.get('/loginfacebook', function(req, res) {
    res.sendfile('./www/templates/loginfacebook.html');
});

app.get('/wall', function(req, res) {
    res.sendfile('./web/wall/wall.html');});

app.get('/profile', function(req, res) {
    res.sendfile('./web/profile/profile.html');});

app.get('/', function(req, res) {
    res.sendfile('./www/login.html');});

app.get('/backoffice', function(req, res) {
    res.sendfile('./web/backoffice/backoffice.html');});

app.get('/backoffice2', function(req, res) {
    res.sendfile('./web/backoffice/index.html');});

app.get('/auth/facebook', passport.authenticate('facebook'), function(req, res){
        // The request will be redirected to Facebook for authentication, so this
        // function will not be called.
});


// GET /auth/facebook/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }), function(req, res) {
        var User = require('./models/user.js');
        var jwt = require('jwt-simple');
        var moment = require('moment');
        var Secret = require ('./config/secret.js');
        var user = new User({
            Username: req.user.id,
            Password: req.user.id,
            Name: req.user.name.givenName,
            Surname: req.user.name.familyName,
            Gender: req.user.gender
        });
        console.log(user);
        user.save(function (err) {
            if (!err) {
                var expires = moment().add(2, 'days').valueOf();
                var token = jwt.encode({iss: user._id, exp: expires}, Secret);
                headers = {token: token};
                console.log(headers);
            } else {
                console.log(err);
                if (err.name == 'ValidationError') {
                    res.send(400, 'Validation error');
                } else {
                    res.send(500, 'Server error');
                }
                console.log('Internal error: %s', err.message);
            }
        });
        res.redirect('/ionic');
});

app.get('/RacesDone', function(req, res) {
    res.sendfile('./web/profile/RacesDone.html');});
app.get('/RacesPending', function(req, res) {
    res.sendfile('./web/profile/RacesPending.html');});

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});



//Conexi?n DB Mongo
routes = require('./routes/race')(app);
routes4 = require('./routes/group')(app);
routes3 = require('./routes/users')(app);
routes2 = require('./routes/message')(app);

mongoose.connect('mongodb://localhost:27017/runrunners', function(err, res) {
//mongoose.connect('mongodb://localhost/race', function(err, res) {
    if(err) {
        console.log('ERROR: connecting to Database. ' + err);
    } else {
        console.log('Connected to Database');
    }
});

