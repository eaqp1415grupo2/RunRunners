/**
 * Created by david on 14/04/2015.
 */
module.exports = function(app) {

    //GET - Devuelve todos los mensajes
    findAllMessage = function(req, res) {
        User.find(function(err, messages) {
            if(!err) {
                console.log('GET /messages')


                res.send(messages); //nos enviaria el JSON

            } else {
                console.log('ERROR: ' + err);
            }
        });
    };







}