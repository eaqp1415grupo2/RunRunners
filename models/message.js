var mongoose = require('mongoose');
    Schema = mongoose.Schema;

var messageSchema = new Schema({
    UserID: {type: Schema.ObjectId, ref: 'User'},
    Username: {type: String},
    Text: {type: String},
    GroupOrRace:{type:Boolean},
    ParentID:{type:String},
    GroupID:{type:Schema.ObjectId, ref:'Group'},
    RaceID:{type:Schema.ObjectId, ref:'Race'},
    ParentMessageID: {type: Schema.ObjectId, ref: 'Message'},
});

module.exports = mongoose.model('Message', messageSchema);
