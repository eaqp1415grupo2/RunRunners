module.exports = function(app) {
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
        Race.findById({"ID_Race":req.param.ID_Race}, function(err, race) {
            if(!err) {
                res.send(race);
            } else {
                console.log('ERROR: ' + err);
            }
        });
    };

    //POST - Insert a new TVShow in the DB
    addRace = function(req, res) {
        console.log('POST');
        console.log(req.body);

        var race = new Race({
            ID_Race:    req.body.ID_Race,
            Name: 	  req.body.Name,
            Level:  req.body.Level,
            Location:   req.body.Location,
            Distance:  req.body.Distance,
            Type:    req.body.Type,
            Tags: req.body.Tags,
            Users: req.body.Users,
            Messages: req.body.Messages,
            Tour:  req.body.Tour
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
        Race.findById({"ID_Race":req.param.ID_Race}, function(err, race) {
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
    }

    //DELETE - Delete a TVShow with specified ID
    deleteRace = function(req, res) {
        Race.findById({"ID_Race":req.param.ID_Race}, function(err, race) {
            race.remove(function(err) {
                if(!err) {
                    console.log('Removed');
                } else {
                    console.log('ERROR: ' + err);
                }
            })
        });
    }

    addUser = function (req, res) {
        Race.findById({"ID_Race":req.param.ID_Race}, function(err, user) {
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
        Race.findById({"ID_Race":req.param.ID_Race}, function(err, message) {
            if (message.body.Username != null && message.body.Text != null)  message.Messages.push(req.body);
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
    app.get('/race/:id_race', findRaceByID);
    app.post('/race', addRace);
    app.put('/race/:id', updateRace);
    app.delete('/race/:id', deleteRace);
    app.put('/race/:id', addUser);
    app.put('/race/:id', addMessages);

}