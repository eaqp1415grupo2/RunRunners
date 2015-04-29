module.exports = function (app) {

    var Race = require('../models/race.js');

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

    //GET - Return all races in the DB by ID_Race
    findRaceByID = function(req, res) {
        console.log(req.params.id);
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
        Race.findById({"ID_Race":req.params.ID_Race}, function(err, race) {
            race.ID_Race = req.body.ID_Race;
            race.Name = req.body.Name;
            race.Level = req.body.Level;
            race.Location = req.body.Location;
            race.Distance = req.body.Distance;
            race.Type = req.body.Type;
            race.Tags = req.body.Tags;
            race.Users = req.body.Users;
            race.Messages = req.body.Messages;
            race.Tour = req.body.Tour;

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
        Race.findById({"ID_Race":req.params.ID_Race}, function(err, race) {
            race.remove(function(err) {
                if(!err) {
                    console.log('Removed');
                } else {
                    console.log('ERROR: ' + err);
                }
            })
        });
    };

    addUser = function (req, res) {
        Race.findById({"ID_Race":req.params.ID_Race}, function(err, user) {
            if (Race.findOne({"Users.Username": req.body.Username}) == null) {
                if (req.body.Username != null) user.Users.push(req.body);
                else console.log("Something wrong with: " + req.body);
                user.save(function (err) {
                    if (err) console.log("Error: " + err);
                    else console.log("User Inserted in Group");
                });
                res.send(user);
            }
            else console.log("This User is inside this race already");
        });

    };

    addMessages = function (req, res) {
        Race.findById({"ID_Race":req.params.ID_Race}, function(err, message) {
            if (message.body.Username != null)  message.Messages.push(req.body);
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
    app.get('/race/:id', findRaceByID);
    app.post('/race', createRace);
    app.put('/race/:id', updateRace);
    app.delete('/race/:id', deleteRace);
    app.put('/race/:id', addUser);
    app.put('/race/:id', addMessages);

};