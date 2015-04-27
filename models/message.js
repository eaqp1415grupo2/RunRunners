var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var messageSchema = new Schema({
    sender : { type : String},
    reciver : {type : String},
    text : {type : String}


});
//permitimos que sea llamado desde el archivo principal de la aplicación
module.exports = mongoose.model('Message', messageSchema);