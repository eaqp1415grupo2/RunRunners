module.exports = function (app) {

    var Race = require('../models/race.js');
    var User = require('../models/user.js');
    var Secret = require('../config/secret.js');
    var Group = require('../models/group.js');
    var jwt = require('jwt-simple');
    //GET - Return all races in the DB
    findAllRaces = function (req, res) {
        Race.find(function (err, races) {
            if (!races) {
                res.send(404, "There are no races")
            } else {
                if (!err) {
                    res.send(200, races);
                } else {
                    res.send(500, "Mongo Error");
                    console.log('ERROR: ' + err);
                }
            }
        });
    };

    findRaceByVicinity = function (req, res) {
        var userrequest,
            lngMin,
            lngMax,
            ltdMin,
            ltdMax;
        Group.findById(req.params.id, function (err, user) {
            if (!user) {

                res.send(404, 'No se encuentra este nombre de usuario, revise la petici�n');
            }
            if (!err) {
                lngMin = user.locationIni.Lng - 0.0015083; // - 10 km
                lngMax = user.locationIni.Lng + 0.0015083; // + 10 km
                ltdMin = user.locationIni.Ltd - 0.0015083; // - 10 km
                ltdMax = user.locationIni.Ltd + 0.0015083; // + 10 km
                userrequest = user;
            } else {
                res.statusCode = 500;
                console.log('Internal error(%d): %s', res.statusCode, err.message);
                res.send({error: 'Server error'});
            }
        });
        var query = Race.find()
            .where({
                'userrequest.locationIni.Lng': {'gte': lngMin, 'lte': lngMax},
                'userrequest.locationIni.Ltd': {'gte': ltdMin, 'lte': ltdMax}
            })
            .limit(50)
            .exec(function (err, races) {
                if (!err) {
                    res.send(races);
                } else {
                    console.log('ERROR: ' + err);
                }
            });
    };

    //GET - Return all races in the DB by ID_Race
    findRaceByID = function (req, res) {
        Race.findOne({_id: req.params.id}, function (err, race) {
            if (!race) {
                res.send(404, "Race not found");
            } else {
                if (!err) {
                    res.send(200, race);
                } else {
                    res.send(500, "Mongo Error");
                    console.log('ERROR: ' + err);
                }
            }
        });
    };

    findRaceByName = function (req, res) {
        Race.findOne({"Name": req.params.name}, function (err, race) {
            if (!race) {
                res.send(404, "Race not found");
            } else {
                if (!err) {
                    res.send(200, race);
                } else {
                    res.send(500, "Mongo Error");
                    console.log('ERROR: ' + err);
                }
            }
        });
    };


//POST - Insert a new Race in the DB
    createRace = function (req, res) {
        var id = jwt.decode(req.body._id, Secret);
        User.findOne({_id: id.iss}, function (err, user) {
            if (!user) {
                res.send(404, 'User not found');
            } else {
                var race = new Race({
                    Name: req.body.Name,
                    Level: req.body.Level,
                    LocationIni: req.body.LocationIni,
                    LocationFin: req.body.LocationFin,
                    Distance: req.body.Distance,
                    Date: req.body.Date,
                    Time: req.body.Time,
                    Type: req.body.Type,
                    Tags: req.body.Tags,
                    Tour: req.body.Tour,
                    Admin: user.Username,
                    Users: [{
                        _id: user._id,
                        Username: user.Username
                    }]
                });
                race.save(function (err) {
                    if (!err) {
                        console.log('Created');
                    } else {
                        res.send(500, "Mongo Error");
                        console.log('ERROR: ' + err);
                    }
                });
                var userpush = ({
                    _id: race._id,
                    Race: race.Name,
                    State: 'Pending'
                });
                user.Races.push(userpush);
                user.save(function (err) {
                    if (!err) {
                        res.send(200, race);
                    } else {
                        res.send(500, err);
                    }
                });
                res.send(200, race);
            }
        });
    };


//PUT - Update a register already exists
    updateRace = function (req, res) {
        var id = jwt.decode(req.body._id, Secret);
        User.findOne({_id: id.iss}, function (err, user) {
            if (!user)res.send(404, 'User Not Found');
            else {
                Race.findById(req.params.id, function (err, race) {
                    if (!race) {
                        res.send(404, "Race not found");
                    } else {
                        if(race.Admin != user.Username) res.send(400,'Bad User');
                        else {
                           if(req.body.Name != null) race.Name = req.body.Name;
                            if(req.body.Level != null)race.Level = req.body.Level;
                            if(req.body.LocationIni != null) race.LocationIni = req.body.LocationIni;
                            if(req.body.Distance != null) race.Distance = req.body.Distance;
                            if(req.body.Type != null)  race.Type = req.body.Type;
                            if(req.body.Tags != null) race.Tags = req.body.Tags;
                            if(req.body.Tour != null) race.Tour = req.body.Tour;
                            race.save(function (err) {
                                if (!err) {
                                    console.log('Updated');
                                } else {
                                    res.send(500, "Mongo Error");
                                    console.log('ERROR: ' + err);
                                }
                                res.send(200, race);
                            });
                        }
                    }
                });
            }
        });
    };


    deleteRaceGroups = function (id) {
        Group.find({'Races._id': id}, function (err, groups) {
            for (i = 0; i < groups.length; i++) {
                groups[i].Races.pull(id);
                groups[i].save(function (err) {
                    if (err) res.send(500, 'Mongo Error');
                    else console.log('Race Removed in group');

                });
            }

        });
    };

//DELETE - Delete a Race with specified ID
    deleteRace = function (req, res) {
        var id = jwt.decode(req.body._id, Secret);

        User.findOne({_id: id.iss}, function (err, usuario) {
            if (!usuario) {
                res.send(404, 'User Not Found');
            }
            else {
                Race.findOne({_id: req.params.id}, function (err, race) {
                    if (!race) {
                        res.send(404, 'Race not found');
                    } else {
                        if (race.Admin != usuario.Username && usuario.Role != 'admin') {
                            res.send(400, 'Bad User');
                        } else {
                            var users = race.Users;
                            for (var i = 0; i < users.length; i++) {
                                User.findOne(users[i]._id, function (err, user) {
                                    user.Races.pull(race._id);
                                    user.save(function (err) {
                                        if (!err) {
                                            console.log('User   Removed');
                                        } else {
                                            console.log('ERROR: ' + err);
                                            res.send(500, "Mongo Error");
                                        }
                                    });
                                });
                            }
                            deleteRaceGroups(race._id);
                            race.remove(function (err) {
                                if (!err) {
                                    console.log('Removed');
                                    res.send(200, 'OK');
                                } else {
                                    console.log('ERROR: ' + err);
                                    res.send(500, "Mongo Error");
                                }
                            });
                        }

                    }
                });
            }
        });
    };


    addUser = function (req, res) {
        var id = jwt.decode(req.body._id, Secret);
        Race.findOne({_id: req.params.id}, function (error, race) {
            if (!race) {
                res.send(404, 'Race not found');
            } else {
                Race.findOne({_id: req.params.id, 'Users._id': id.iss}, function (err, users) {
                    User.findOne({_id: id.iss}, function (err, user) {
                        if (!err && users == null) {
                            var racepush = ({
                                _id: user._id,
                                Username: user.Username
                            });
                            race.Users.push(racepush);
                            race.save(function (err) {
                                if (!err) {
                                    console.log('Updated');
                                } else {
                                    res.send(500, err);
                                }
                            });
                            var userpush = ({
                                _id: race._id,
                                Race: race.Name,
                                State: 'Pending'
                            });
                            user.Races.push(userpush);
                            user.save(function (err) {
                                if (!err) {
                                    res.send(200, race);
                                } else {
                                    res.send(500, err);
                                }
                            });

                        } else {
                            res.send(400, 'This user is in the race already');
                        }
                    })
                });
            }
        });
    };

    removeUserRace = function (race, user, res) {

        if (race.Admin === user.Username) {
            if (!race.Users[1]) {
                user.Races.pull(race._id);
                user.save(function (error) {
                    if (error) res.send(500, 'Mongo Error');
                    else {
                        console.log(race);
                    }
                });
                race.remove(function (err) {
                    if (err) res.send(500, 'Mongo Error');
                    else res.send(200, 'Race Removed');
                });

            } else {
                race.Admin = race.Users[1].Username;
            }
        }
        race.Users.pull(user._id);
        race.save(function (err) {
            if (err) res.send(500, "Error: " + err);
        });
        user.Races.pull(race._id);
        user.save(function (error) {
            if (error) res.send(500, 'Mongo Error');
            else {
                res.send(200);
            }
        });

    };

    deleteUser = function (req, res) {
        var id = jwt.decode(req.body._id, Secret);
        Race.findOne({_id: req.params.id}, function (err, race) {
            if (!race) {
                res.send(404, 'Race  Not Found')
            } else {
                if (!req.body.delete) {
                    User.findOne({_id: id.iss}, function (err, user) {
                        removeUserRace(race, user, res);
                    });
                } else {
                    User.findOne({_id: id.iss}, function (err, user) {
                        if (user.Username != race.Admin && user.Role != 'admin') {
                            res.send(404, 'Not Allowed');
                        } else {
                            var position = false;
                            for (i = 0; i < race.Users.length; i++) {
                                if (race.Users[i]._id.equals(req.body.delete)) {
                                    position = true;
                                    User.findOne({_id: req.body.delete}, function (err, deleteuser) {
                                        removeUserRace(race, deleteuser, res);
                                    });
                                    break;
                                }
                            }
                            if (!position) {
                                res.send(404, 'User Not Found');
                            }
                        }
                    });
                }
            }
        });
    };

    findNoUserRace = function (req, res) {
        var id = jwt.decode(req.params.id, Secret);
        Race.find({'Users._id': {$nin: [id.iss]}}, function (err, data) {
            console.log('No User races: ' + data);
            if (err)res.send(500, 'Mongo Error');
            else res.send(data);
        });
    };

    findUserRace = function (req, res) {
        var id = jwt.decode(req.params.id, Secret);
        Race.find({'Users._id': id.iss}, function (err, data) {
            console.log('User races: ' + data);
            if (err)res.send(500, 'Mongo Error');
            else res.send(data);
        });
    };

    findNoGroupRace = function (req, res) {
        Race.find({'Groups._id': {$nin: [req.params.id]}}, function (err, data) {
            if (err)res.send(500, 'Mongo Error');
            else res.send(data);
        });
    };

    findGroupRace = function (req, res) {
        Race.find({'Groups._id': req.params.id}, function (err, data) {
            if (err)res.send(500, 'Mongo Error');
            else res.send(data);
        });
    };

//Link routes and functions
    app.get('/race', findAllRaces);
    app.get('/user/:id/race', findRaceByVicinity);
    app.get('/race/name/:name', findRaceByName);
    app.get('/race/:id', findRaceByID);
    app.get('/race/no/:id', findNoUserRace);
    app.get('/race/user/:id', findUserRace);
    app.get('/race/group/:id', findGroupRace);
    app.get('/race/no/group/:id', findNoGroupRace);
    app.post('/race', createRace);
    app.put('/race/:id', updateRace);
    app.delete('/race/:id', deleteRace);
    app.post('/race/:id/user', addUser);
    app.delete('/race/:id/user', deleteUser);

}
;
