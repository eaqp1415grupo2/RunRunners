var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var User = new Schema({
    _id: {type: Schema.ObjectId, ref: 'User'},
    Username: {type: String}
});

var Race = new Schema({
    _id: {type: Schema.ObjectId, ref: 'Races'},
    Race: {type: String},
    State: {type: String, enum: ['Done', 'Pending']}
});

var Message = new Schema({
    UserID: {type: Schema.ObjectId, ref: 'User'},
    Username: {type: String},
    Text: {type: String},
    Answers: [{
        UserID: {type: Schema.ObjectId, ref: 'User'},
        Username: {type: String},
        Answer: {type: String}
    }]
});
var groupSchema = new Schema({
    Name: {type: String},
    Info: {type: String},
    Level: {
        type: String, enum: ['Beginner', 'Initiated', 'Professional']
    },
    Location: {
        Lng: {type: Number},
        Ltd: {type: Number}
    },
    Admin_Group: {type: String},
    Users: [User],
    Races: [Race],
    Messages: [Message]
}, {versionKey: false});

module.exports = mongoose.model('Group', groupSchema);