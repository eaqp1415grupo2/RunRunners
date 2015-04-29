var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    Username : { type : String},
    Password : {type : String},
    Name : {type : String},
    Surname : {type : String},
    Email : { type : String},
    Birthdate : {type : Date , format : "YYYY-MM-DD HH:mm:ss"},
    Gender : {type : String},
    Location : {type : String },
    Level : {type : String, enum: ['Beginner', 'Medium', 'High']},
    Group : [{type : Schema.ObjectId , ref : 'Group'}],
    RacesDone : [{type : Schema.ObjectId , ref : 'Races'}],
    RacesPending :[{type : Schema.ObjectId , ref : 'Races'}]

});

//permitimos que sea llamado desde el archivo principal de la aplicación
module.exports = mongoose.model('User', userSchema);






