var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var userRaceSchema = new Schema({
    ID_Race:    { type: String },
    ID_User:     { type: String },
    Time:  { type: Number }
});

module.exports = mongoose.model('UserRace', userRaceSchema);