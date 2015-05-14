var express = require("express"),
    app     = express(),
    http    = require("http"),
    server  = http.createServer(app),
    mongoose = require('mongoose');
app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
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
app.use(express.static('web'));
//de momento redirige a wall, a la espera de login

app.get('/wall', function(req, res) {
  res.sendfile('./web/wall/wall.html');});

app.get('/profile', function(req, res) {
  res.sendfile('./web/profile/profile.html');});

app.get('/', function(req, res) {
  res.sendfile('./web/login/login.html');});
app.get('/RacesDone', function(req, res) {
    res.sendfile('./web/profile/RacesDone.html');});
app.get('/RacesPending', function(req, res) {
    res.sendfile('./web/profile/RacesPending.html');});



routes = require('./routes/race')(app);
routes2 = require('./routes/group')(app);
routes3 = require('./routes/users')(app);

mongoose.connect('mongodb://localhost/race', function(err, res) {
    if(err) {
        console.log('ERROR: connecting to Database. ' + err);
    } else {
        console.log('Connected to Database');
    }
});

server.listen(3000, function() {
    console.log("Node server running on http://localhost:3000");
});

