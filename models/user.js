var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RaceSchema = new Schema({
    _id: {type: Schema.ObjectId, ref: 'Races'},
    Race: {type: String},
    State: {type: String, enum: ['Done','Pending']},
    Data: {
        Time: {type: Number},
        Distance: {type: Number}
    }
});

var GroupSchema = new Schema({
    _id: {type: Schema.ObjectId, ref: 'Groups'},
    Group: {type: String}
});

var userSchema = new Schema({
    Username : { type : String},
    Password : {type : String},
    Name : {type : String},
    Surname : {type : String},
    Email : { type : String},
    Birthdate : {type : Date , format : "YYYY-MM-DD HH:mm:ss"},
    Gender : {type : String, enum: ['male', 'female']},
    Location: {
        Lng: {type: Number},
        Ltd: {type: Number}
    },
    Level: {type: String, enum: ['Beginner', 'Medium', 'High']},
    Groups: [GroupSchema],
    Races: [RaceSchema]

}, {versionKey: false});

//permitimos que sea llamado desde el archivo principal de la aplicación
module.exports = mongoose.model('User', userSchema);






