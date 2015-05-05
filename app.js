var express = require("express"),
    app     = express(),
    http    = require("http"),
    server  = http.createServer(app);
    mongoose = require('mongoose');

app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
});

//de momento redirige a wall, a la espera de login
app.get('/', function(req, res) {
  res.sendfile('./web/wall/wall.html');
});
//habilita los archivos secundarios de resources y js necesarios de /web
app.use(express.static('web'));

routes = require('./routes/race')(app);
routes2 = require('./routes/userRace')(app);
routes3 = require('./routes/group')(app);

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

