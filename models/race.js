var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var raceSchema = new Schema({
    ID_Race:    { type: String },
    Name:     { type: String },
    Level:    { type: String, enum:
        ['Beginner', 'Initiated', 'Professional']
    },
    Date:   { type: Date },
    LocationIni:  {
        Lng:   { type: Number },
        Ltd:   { type: Number }
    },
    Distance:  { type: Number },
    Type: {type: String},
    Tags:[{
        Stag: {type: String}
    }],
    Users:[{
        ID_User: {type: String}
    }],
    Messages:[{
        ID_Message: {type: String}
    }],
    Tour:[{
        Lng:   { type: Number },
        Ltd:   { type: Number }
    }]
});

module.exports = mongoose.model('Race', raceSchema);