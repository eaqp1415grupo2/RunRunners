var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var User = new Schema({Username: {type:String}});
var Race = new Schema({Race: {type:String}});
var Message = new Schema({Username: {type:String}, Message: {type:String}});
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
    RacesDone:[Race],
    RacesPending: [Race],
    Messages: [Message]
},{versionKey: false});

module.exports = mongoose.model('Group', groupSchema);