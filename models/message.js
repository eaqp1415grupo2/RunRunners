    var mongoose = require('mongoose');
    Schema = mongoose.Schema;

var messageSchema = new Schema({
    UserID: {type: Schema.ObjectId, ref: 'User'},
    Username: {type: String},
    Text: {type: String},
    ParentID: {type: Schema.ObjectId},
    Answers: [{
        UserID: {type: Schema.ObjectId, ref: 'User'},
        Username: {type: String},
        Answer: {type: String}
    }]
},  {versionKey: false});

module.exports = mongoose.model('Message', messageSchema);
