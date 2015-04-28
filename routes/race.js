module.exports = function(app) {

    var Race = require('../models/race.js');

    //GET - Return all races in the DB
    findAllTVShows = function(req, res) {
        Race.find(function(err, races) {
            if(!err) {
                res.send(races);
            } else {
                console.log('ERROR: ' + err);
            }
        });
    };

}