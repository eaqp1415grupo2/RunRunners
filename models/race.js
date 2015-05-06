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
    _id: {type: Schema.ObjectId, ref: 'User'}
});

var Message = new Schema({
    UserID: {type: Schema.ObjectId, ref: 'User'},
    Text: {type: String},
    Answers: [{UserID: {type: Schema.ObjectId, ref: 'User'}},
        {Answer: {type: String}}]
});

var raceSchema = new Schema({
    Name: {type: String},
    Level: {
        type: String, enum: ['Beginner', 'Initiated', 'Professional']
    },
    Date: {type: Date, format: "YYYY-MM-DD HH:mm:ss"},
    LocationIni: {
        Lng: {type: Number},
        Ltd: {type: Number}
    },
    Distance: {type: Number},
    Type: {type: String},
    Tags: [Tags],
    Users: [Users],
    Messages: [Message],
    Tour: [Tour]
}, {versionKey: false});

module.exports = mongoose.model('Race', raceSchema);