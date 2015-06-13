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

var raceSchema = new Schema({
    Name: {type: String},
    Level: {type: String, enum: ['Beginner', 'Initiated', 'Professional']},
    Date: {type: Date, format: "YYYY-MM-DD HH:mm:ss"},
    Time: {type: String},
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
    Tour: [Tour]
}, {versionKey: false});

module.exports = mongoose.model('Race', raceSchema);