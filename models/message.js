var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
  //  Schema2 = mongoose.Schema;
var messageSchema = new Schema({
    ID_Message : {type : Schema.Types.ObjectId},
    sender : { type : String},
    reciver : {type : String},
    text : {type : String},
    answer:[{
        ID_ANSWER : {type : Number},
        texto :{type:String}
    }]
});
//var answerSchema = new Schema2({
  //  parent_id : {type : Number},
    //text : {type : String}
//});
//permitimos que sea llamado desde el archivo principal de la aplicación
module.exports = mongoose.model('Message', messageSchema);
//module.exports = mongoose.model('Answer', answerSchema);