module.exports = function (app) {

    var Race = require('../models/race.js');
    var User = require('../models/user.js');
    var Secret = require ('../config/secret.js');
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
        var id = jwt.decode(req.body._id,Secret);
        User.find({_id:id.iss}, function(err, user){
            if(!user){
                res.send(404,'User not found');
            }else {
                var race = new Race({
                    Name: req.body.Name,
                    Level: req.body.Level,
                    LocationIni: req.body.LocationIni,
                    Distance: req.body.Distance,
                    Date: req.body.Date,
                    Type: req.body.Type,
                    Tags: req.body.Tags,
                    Tour: req.body.Tour,
                    Admin: user.Username
                });
                race.save(function (err) {
                    if (!err) {
                        console.log('Created');
                    } else {
                        res.send(500, "Mongo Error");
                        console.log('ERROR: ' + err);
                    }
                });

                res.send(200, race);
            }
        });
    };

//PUT - Update a register already exists
    updateRace = function (req, res) {
        Race.findById(req.params.id, function (err, race) {
            if (!race) {
                res.send(404, "Race not found");
            } else {
                race.Name = req.body.Name;
                race.Level = req.body.Level;
                race.LocationIni = req.body.LocationIni;
                race.Distance = req.body.Distance;
                race.Type = req.body.Type;
                race.Tags = req.body.Tags;
                race.Users = req.body.Users;
                race.Messages = req.body.Messages;
                race.Tour = req.body.Tour;

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
        });
    };

//DELETE - Delete a Race with specified ID
    deleteRace = function (req, res) {
        Race.findOne({_id: req.params.id}, function (err, race) {
            if (!race) {
                res.send(404, 'Race not found');
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
        });
    };

    addUser = function (req, res) {
        var id = jwt.decode(req.body._id,Secret);
        Race.findOne({_id: req.params.id}, function (error, race) {
            if (!race) {
                res.send(404, 'Race not found');
            } else {
			console.log('id: '+id+' race :'+race);
                Race.findOne({_id: req.params.id, 'Users._id': id.iss}, function (err, users) {
                    User.findOne({_id: id.iss}, function (err, user) {
                        //if (!err && users == null && user != null) {
                        if (!err && users == null) {
                            var racepush = ({_id: user._id, Username: user.Username});
                            race.Users.push(racepush);
                            race.save(function (err) {
                                if (!err) {
                                    console.log('Updated');
                                } else {
                                    console.log('ERROR: ' + err);
                                }
                            });
                            var userpush = ({_id: race._id, Race: race.Name, State: 'Pending'});
                            user.Races.push(userpush);
                            user.save(function (err) {
                                if (!err) {
                                    console.log('Updated');
                                } else {
                                    console.log('ERROR: ' + err);
                                }
                            });
                            res.send(200, race);
                        } else {
                            res.send(400, 'This user is in the race already');
                        }
                    })
                });
            }
        });
    };

    addMessage = function (req, res) {
        Race.findOne({_id: req.params.id}, function (err, race) {
            if (!race) {
                res.send(404, 'Race Not Found');
            } else {
                var id = jwt.decode(req.body._id,Secret);
                User.findOne({_id: id.iss}, {Username: 1}, function (err, user) {
                    console.log(user);
                    var message = ({UserID: user._id, Username: user.Username, Text: req.body.Text});
                    console.log(message);
                    race.Messages.push(message);
                    race.save(function (err) {
                        if (err) res.send(500, "Mongo Error");
                        else res.send(200, race);
                    });
                });
            }
        });
    };

    addAnswer = function (req, res) {
        Race.findOne({_id: req.params.id}, function (err, race) {
            if (!race) {
                res.send(404, 'Race Not Found');
            } else {
                Race.findOne({_id: req.params.id, 'Messages._id' :req.params.message}, function (err, messages) {
                    if (!messages) {
                        res.send(404, 'Message Not Found');
                    } else {
                        var position;
                        for(var i in messages.Messages){
                            if(messages.Messages[i]._id.equals(req.params.message)){
                                position = i;
                                break;
                            }
                        }
                        var id = req.body._id;
                        User.findOne({_id: id.iss}, {Username: 1}, function (err, user) {
                            var answer = ({UserID: user._id, Username: user.Username, Answer: req.body.Answer});
                            messages.Messages[position].Answers.push(answer);
                            messages.save(function (err) {
                                if (err) res.send(500, "Mongo Error");
                                else res.send(200, messages);
                            });
                        });
                    }
                });
            }
        });
    };

    deleteUser = function (req, res) {
        var id = jwt.decode(req.body._id,Secret);
        Race.findOne({_id: req.params.id, 'Users._id': id.iss}, function (err, race) {
            if (!race) {
                res.send(404, 'User Not Found')
            } else {
                race.Users.pull(id);
                race.save(function (err) {
                    if (err) res.send(500, 'Mongo Error');
                    else console.log('Race Removed');
                });
            }
        });
        User.findOne({_id: id.iss}, function (err, user) {
            user.Races.pull(req.params.id);
            user.save(function (err) {
                if (err) res.send(500, 'Mongo Error');
                else res.send(200, 'OK');
            });
        });
    };

    findNoUserRace = function(req, res){
        var id = jwt.decode(req.params.id, Secret);
        Race.find({'Users._id':{$nin:[id.iss]}}, function(err, data){
            console.log('No User races: '+data);
            if(err)res.send(500, 'Mongo Error');
            else res.send(data);
        });
    };

        findUserRace = function(req, res){
        var id = jwt.decode(req.params.id, Secret);
        Race.find({'Users._id':id.iss}, function(err, data){
        	console.log('User races: '+data);
            if(err)res.send(500, 'Mongo Error');
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
    app.post('/race', createRace);
    app.put('/race/:id', updateRace);
    app.delete('/race/:id', deleteRace);
    app.put('/race/:id/user', addUser);
    app.delete('/race/:id/user', deleteUser);
    app.put('/race/:id/message', addMessage);
    app.put('/race/:id/message/:message',addAnswer);

}
;
