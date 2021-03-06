module.exports = function (app) {
    var Message = require('../models/message.js');
    var Race = require('../models/race.js');
    var User = require('../models/user.js');
    var Group = require('../models/group.js');
    var jwt = require('jwt-simple');
    var Secret = require('../config/secret.js');

    //GET - Return all races in the DB
    findAllMessage = function (req, res) {
        Message.find(function (err, msg) {
            if (!msg) {
                res.send(404, "There are no msgs")
            } else {
                if (!err) {
                    res.send(200, msg);
                } else {
                    res.send(500, "Mongo Error");
                    console.log('ERROR: ' + err);
                }
            }
        });
    };

    //GET - Return message in the DB by ID_message
    findMessageByID = function (req, res) {
        Message.findOne({_id: req.params.id}, function (err, msg) {
            if (!msg) {
                res.send(404, "Message not found");
            } else {
                if (!err) {
                    res.send(200, msg);
                } else {
                    res.send(500, "Mongo Error");
                    console.log('ERROR: ' + err);
                }
            }
        });
    };

    findMessagesByParentID = function (req, res) {
        Message.find({ParentID: req.params.id}, function (err, messages) {
            if (!messages) {
                res.send(404, 'No Parent ID with this ID');
            } else {
                if (err) res.send(500, 'Mongo Error');
                else res.send(200, messages);
            }
        });
    };

    createMessage = function (req, res) {
        var id = req.body.ParentID;
        var race = true;
        var group = true;
        var userid = jwt.decode(req.body.UserID, Secret);
        User.findOne({_id: userid.iss}, function (err, user) {
            if (!user) {
                res.send(404, 'User not Found');
            } else {
                Race.findOne({_id: id, 'Users._id': userid.iss}, function (err, result) {
                    console.log("Result: " + result);
                    if (!result) {
                        race = null;
                    }
                });

                Group.findOne({_id: id, 'Users._id': userid.iss}, function (err, result2) {
                    console.log("Result2: " + result2);
                    if (!result2) {
                        group = null;
                    }
                });
                console.log('Race: ' + race, 'Group: ' + group);
                if (!race && !group) {
                    res.send(404, 'Race and Group not Found');

                } else {
                    var message = new Message({
                        UserID: userid.iss,
                        Username: user.Username,
                        Text: req.body.Text,
                        ParentID: id

                    });
                    message.save(function (err) {
                        if (!err) res.send(200, message);
                        else res.send(500, 'Mongo Error');
                    });
                }
            }
        });
    };

    addAnswer = function (req, res) {
        console.log("Hola");
        var id = req.params.id;
        var userid = jwt.decode(req.body.UserID, Secret);
        console.log('id: ' + userid);
        User.findOne({_id: userid.iss}, function (err, user) {
            console.log('u: ' + user);
            if (!user) {
                res.send(404, 'User Not Found');
            } else {
                var race = true;
                var group = true;
                Message.findOne({_id: req.params.id}, function (err, message) {
                    if (!message) {
                        res.send(404, 'Message Not Found');
                    } else {
                        Race.findOne({_id: id, 'Users._id': userid.iss}, function (err, result) {
                            if (!result) {
                                race = null;
                            }
                        });
                        Group.findOne({_id: id, 'Users._id': userid.iss}, function (err, result2) {
                            if (!result2) {
                                group = null;
                            }
                        });
                        console.log(race, group);
                        if (!race && !group) {
                            res.send(404, 'Not Found');
                        } else {
                            var answer = ({
                                UserID: id.iss,
                                Username: user.Username,
                                Answer: req.body.Answer
                            });
                            message.Answers.push(answer);
                            message.save(function (err) {
                                if (err) res.send(500, 'Mongo Error');
                                else res.send(200, message);
                            })
                        }
                    }
                });
            }
        });
    };

    deleteMessage = function (req, res) {
        var id = jwt.decode(req.body.UserID, Secret);
        User.findOne({_id: id.iss}, function (err, user) {
            if (!user) {
                res.send(404, 'User Not Found');
            } else {
                Message.findOne({_id: req.params.id}, function (err, message) {
                    if (!message) {
                        res.send(404, 'Message Not Found');
                    } else {
                        Race.findOne({_id: message.ParentID}, function (err, race) {
                            Group.findOne({_id: message.ParentID}, function (err, group) {
                                if (!group && !race) {
                                    res.send(404, 'Bad ParentID');
                                }
                                else {
                                    if (!race) {
                                        console.log(message.UserID, id.iss);
                                        console.log(group.Admin, user.Username);
                                        if (message.UserID != id.iss && group.Admin != user.Username && user.Role != 'admin') {

                                            res.send(400, 'Bad User');
                                        } else {
                                            message.remove(function (err) {
                                                if (err) res.send(500, 'Mongo Error');
                                                else res.send(200, 'Message Rmoved');
                                            });
                                        }
                                    } else {
                                        if (message.UserID != id.iss && race.Admin != user.Username && user.Role != 'admin') {
                                            res.send(400, 'Bad User');
                                        }

                                        else {
                                            message.remove(function (err) {
                                                if (err) res.send(500, 'Mongo Error');
                                                else res.send(200, 'Message Rmoved');
                                            });
                                        }
                                    }
                                }
                            });
                        });
                    }
                });
            }
        });
    };

    deleteAnswer = function (req, res) {
        var id = jwt.decode(req.body.UserID, Secret);
        var answer = req.body.AnswerID;
        User.findOne({_id: id.iss}, function (err, user) {
            if (!user) {
                res.send(404, 'User Not Found');
            } else {
                Message.findOne({_id: req.params.id, 'Answers._id': answer}, function (err, message) {
                    if (!message) {
                        res.send(404, 'Message Not Found');
                    } else {
                        Race.findOne({_id: message.ParentID}, function (err, race) {
                            Group.findOne({_id: message.ParentID}, function (err, group) {
                                if (!race) {
                                    if (message.UserID != id.iss && user.Username != group.Admin && user.Role != 'admin') {
                                        res.send(400, 'Bad User');
                                    } else {
                                        message.Answers.pull(answer);
                                        message.save(function (err) {
                                            if (err) res.send(500, 'Mongo Error');
                                            else res.send(200, 'Answer Removed');
                                        });
                                    }
                                } else if (!group) {
                                    if (message.UserID != id.iss && user.Username != race.Admin && user.Role != 'admin') {
                                        res.send(400, 'Bad User');
                                    } else {
                                        message.Answers.pull(answer);
                                        message.save(function (err) {
                                            if (err) res.send(500, 'Mongo Error');
                                            else res.send(200, 'Answer Removed');
                                        });
                                    }
                                } else {
                                    res.send(404, 'ParentID Not Found');
                                }
                            });
                        });
                    }
                });
            }
        });
    };

    app.get('/message', findAllMessage);
    app.get('/message/:id', findMessageByID);
    app.get('/message/parent/:id', findMessagesByParentID);
    app.post('/message', createMessage);
    app.put('/message/:id', addAnswer);
    app.delete('/message/:id', deleteMessage);
    app.delete('/message/answer/:id', deleteAnswer);
}
;
