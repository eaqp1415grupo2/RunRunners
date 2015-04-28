module.exports = function(app) {

    var UserRace = require('../models/userRace.js');

    //GET - Return all races in the DB
    findAllTVShows = function(req, res) {
        UserRace.find(function(err, userRaces) {
            if(!err) {
                res.send(userRaces);
            } else {
                console.log('ERROR: ' + err);
            }
        });
    };

}