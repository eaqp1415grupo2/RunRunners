module.exports = function (app) {

    var Race = require('../models/race.js');
    var User = require('../models/user.js');
    //GET - Return all races in the DB
    findAllRaces = function(req, res) {
        Race.find(function(err, races) {
            if(!err) {
                res.send(races);
            } else {
                console.log('ERROR: ' + err);
            }
        });
    };

    findRaceByVicinity = function(req, res) {
        var userreq,
            lngMin,
            lngMax,
            ltdMin,
            ltdMax;
        User.findById(req.params.id, function(err, user){
            if(!user) {
                res.statusCode = 404;
                return res.send({ error: 'No se encuentra este nombre de usuario, revise la petici�n' });
            }
            if(!err) {
                lngMin = user.locationIni.Lng - 0.0015083; // - 10 km
                lngMax = user.locationIni.Lng + 0.0015083; // + 10 km
                ltdMin = user.locationIni.Ltd - 0.0015083; // - 10 km
                ltdMax = user.locationIni.Ltd + 0.0015083; // + 10 km
                userreq = user;
            } else {
                res.statusCode = 500;
                console.log('Internal error(%d): %s',res.statusCode,err.message);
                return res.send({ error: 'Server error' });
            }
        });
        var query = Race.find()
            .where({'userreq.locationIni.Lng': {'gte': lngMin, 'lte':lngMax},'userreq.locationIni.Ltd': {'gte': ltdMin, 'lte':ltdMax}})
            .limit(50)
            .exec(function(err, races) {
                if(!err) {
                    res.send(races);
                } else {
                    console.log('ERROR: ' + err);
                }
            });
    };

    //GET - Return all races in the DB by ID_Race
    findRaceByID = function(req, res) {
        Race.findById(req.params.id, function(err, race) {
            if(!err) {
                res.send(race);
            } else {
                console.log('ERROR: ' + err);
            }
        });
    };

    //POST - Insert a new Race in the DB
    createRace = function(req, res) {
        var race = new Race({
            name: 	  req.body.name,
            level:  req.body.level,
            locationIni:   req.body.locationIni,
            distance:  req.body.distance,
            type:    req.body.type,
            tags: req.body.tags,
            users: req.body.users,
            messages: req.body.messages,
            tour:  req.body.tour
        });
        race.save(function(err) {
            if(!err) {
                console.log('Created');
            } else {
                console.log('ERROR: ' + err);
            }
        });

        res.send(race);
    };

    //PUT - Update a register already exists
    updateRace = function(req, res) {
        Race.findById(req.params.id, function(err, race) {
                race.name = req.body.name;
                race.level = req.body.level;
                race.locationIni = req.body.locationIni;
                race.distance = req.body.distance;
                race.type = req.body.type;
                race.tags = req.body.tags;
                race.users = req.body.users;
                race.messages = req.body.messages;
                race.tour =  req.body.tour;

            race.save(function(err) {
                if(!err) {
                    console.log('Updated');
                } else {
                    console.log('ERROR: ' + err);
                }
                res.send(race);
            });
        });
    };

    //DELETE - Delete a TVShow with specified ID
    deleteRace = function(req, res) {
        Race.findById(req.params.id, function(err, race) {
            race.remove(function(err) {
                if(!err) {
                    console.log('Removed');
                    return res.send({ status: 'OK' });
                } else {
                    console.log('ERROR: ' + err);
                    return res.send({ error: 'Server error' });
                }
            })
        });
    };

    addUser = function (req, res) {
        Race.find({_id:req.params.id, 'users.username':req.body.username}, function(err, users) {
            if(!err && users != undefined) {
                console.log("Paso1");
                Race.findById(req.params.id, function (err, race) {
                    console.log("Paso2");
                    if (!err && req.body.username != null) {
                        race.users.push(req.body);
                        race.save(function (err) {
                            if (err) console.log("Error: " + err);
                            else console.log("User Inserted in Group");
                        });
                        res.send(race);
                    }
                    else
                        console.log("Something wrong with: " + req.body);
                });
            }
            else console.log("This User is inside this race already");

        });

    };

    addMessages = function (req, res) {
        Race.findById(req.params.id, function(err, message) {
            if (req.body.username != null && req.body.text != null)  message.messages.push(req.body);
            else console.log("Something wrong with: " + req.body);
            message.save(function (err) {
                if (err) console.log("Error: " + err);
                else console.log("User Inserted in Group");
            });
            res.send(message);
        });

    };


    //Link routes and functions
    app.get('/race', findAllRaces);
    app.get('/user/:id/race', findRaceByVicinity);
    app.get('/race/:id', findRaceByID);
    app.post('/race', createRace);
    app.put('/race/:id', updateRace);
    app.delete('/race/:id', deleteRace);
    app.put('/race/:id/user', addUser);
    app.put('/race/:id/message', addMessages);

};