var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var groupSchema = new Schema({
    ID_Group: {type: String},
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
    Users: [{
        Username: {type: String}
    }],
    RacesDone:[ {
        Race: {type: String}
    }],
    RacesPending: {
        Race: {type: String}
    },
    Messages: [{
        Username: {type: String},
        Message: {type: String}
    }]

});

module.exports = mongoose.model('Group', groupSchema);