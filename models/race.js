var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var Tour = new Schema({
    lng:   { type: Number },
    ltd:   { type: Number }
});

var Tags = new Schema({
    tag: {type: String}
});

var Users = new Schema({
    username: {type: String}
});

var Messages = new Schema({
    id_Message: {type: String}
});

var raceSchema = new Schema({
    name:     { type: String },
    level:    { type: String, enum:
        ['Beginner', 'Initiated', 'Professional']
    },
    date:   { type: Date , format : "YYYY-MM-DD HH:mm:ss"},
    locationIni: {
        Lng:   { type: Number },
        Ltd:   { type: Number }
    },
    distance:  { type: Number },
    type: {type: String},
    tags:[Tags],
    users:[Users],
    messages:[Messages],
    tour:[Tour]
});

module.exports = mongoose.model('Race', raceSchema);