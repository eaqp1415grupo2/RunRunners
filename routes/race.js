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
    findByIdRace = function(req, res) {
        Race.findById(req.param.id, function(err, race) {
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
        Race.findById(req.params.id, function(err, race) {
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
        Race.findById(req.params.id, function(err, race) {
            race.remove(function(err) {
                if(!err) {
                    console.log('Removed');
                } else {
                    console.log('ERROR: ' + err);
                }
            })
        });
    }

    //Link routes and functions
    app.get('/race', findAllRaces);
    app.get('/race/:id', findByIdRace);
    app.post('/race', addRace);
    app.put('/race/:id', updateRace);
    app.delete('/race/:id', deleteRace);

}