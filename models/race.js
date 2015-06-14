var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Tour = new Schema({
    Lng: {type: Number},
    Ltd: {type: Number}
});

var Tags = new Schema({
    Tag: {type: String}
});

var Users = new Schema({
    _id: {type: Schema.ObjectId, ref: 'User'},
    Username: {type:String}
});

var Groups = new Schema({
    _id: {type: Schema.ObjectId, ref: 'Group'},
    Group: {type: String}
})
var raceSchema = new Schema({
    Name: {type: String},
    Level: {type: String, enum: ['Beginner', 'Initiated', 'Professional']},
    Date: {type: String, format: "YYYY-MM-DD"},
    Time: {type: String, format: "HH:mm"},
    LocationIni: {
        Lng: {type: Number},
        Ltd: {type: Number}
    },
    LocationFin: {
        Lng: {type: Number},
        Ltd: {type: Number}
    },
    Distance: {type: Number},
    Type: {type: String},
    Tags: [Tags],
    Admin: {type: String, ref: 'User.Username'},
    Users: [Users],
    Groups: [Groups],
    Tour: [Tour]
}, {versionKey: false});

module.exports = mongoose.model('Race', raceSchema);