/**
 * Created by david on 24/04/2015.
 */
module.exports = function(app) {
    var Message = require('../models/message.js');
   // var Answer = require('../models/message.js')
    //GET - Devuelve un mensaje en concreto
    findMessageById = function(req, res) {
        Message.findById(req.params.ID_Message, function(err, messages) {
            if(!err) {
                console.log('GET /message/' + req.params.id);
                res.send(messages);
            } else {
                console.log('ERROR: ' + err);
            }
        });
    };
//GET - Devuelve todos los mensajes
    findAllMessages = function(req, res) {
        Message.find(function(err, messages) {
            if(!err) {
                console.log('GET /messages')

                res.send(messages); //nos enviaria el JSON

            } else {
                console.log('ERROR: ' + err);
            }
        });
    };
//POST - Inserta un nuevo mensaje en la BD
    addMessage = function(req, res) {
        console.log('POST');
        console.log(req.body);
        console.log(req.body);

//recogemos los valores de la petici�n
        var message = new Message({
            sender:  req.body.sender,
            reciver:  req.body.reciver,
            text:  req.body.text
        });
        console.log(message);
//lo guardamos en la base de datos
        message.save(function(err) {
            if(!err) {
                console.log('Created');
            } else {
                console.log('ERROR: ' + err);
            }
        });

        res.send(message);
    };

//PUT- Permite actualizar un mensaje
    updateMessage = function(req, res) {
        Message.findById(req.params.ID_Message, function(err, message) {


              answer = req.body.answer;
                //{

                  //  text:  req.body.text}

//guardamos en la base de datos
            message.save(function(err) {
                if(!err) {
                    console.log('Updated');
                } else {
                    console.log('ERROR: ' + err);
                }
                res.send(message);
            });
        });
    }

    //DELETE - Permite Borrar un mensaje
    deleteMessage = function(req, res) {
        Message.findById(req.params.ID_Message, function(err, message) {
            //borramos en la base de datos
            message.remove(function(err) {
                if(!err) {
                    console.log('Removed');
                    res.send(message);
                } else {
                    console.log('ERROR: ' + err);
                }
            })
        });
    }




//POST - Permite Crear una respuesta
    addAnswer = function(req, res) {
        Message.findById(req.params.ID_Message, function(err, message) {
        console.log('POST');
        console.log(req.body);
        console.log(req.body);

//recogemos los valores de la petici�n
        var message = new Message({
            answer: req.body.answer
        });
        console.log(message);
//lo guardamos en la base de datos
        message.save(function(err) {
            if(!err) {
                console.log('Created');
            } else {
                console.log('ERROR: ' + err);
            }
        });

        res.send(message);});
    };
//Rutas
    app.delete('/message/:ID_Message', deleteMessage);

    app.get('/message/:ID_Message', findMessageById );
    app.get('/messages', findAllMessages);
    app.post('/message', addMessage);
    app.post('/message/:ID_Message/answer', addAnswer);
    app.put('/message/:ID_Message/answer', updateMessage);

}