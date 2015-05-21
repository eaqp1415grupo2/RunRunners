module.exports = function (app) {
	 var Message = require('../models/message.js');
    var Race = require('../models/race.js');
    var User = require('../models/user.js');
        var Group = require('../models/group.js');
    
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
    //GET - Return message in the DB by ID_message
    findMessageAnswerByID = function (req, res) {
        Message.find( {$or: [{_id: req.params.id},{ParentMessageID:req.params.id}]}, function (err, msg) {
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
    
    
    //GET - Return all messages about one Race by ParentID
    findRaceMessage = function (req, res) {
        Message.find({ParentID: req.params.id}, function (err, msg) {
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
    //GET - Return all messages about one Group by ParentID **ahora es superfluo
    findGroupMessage = function (req, res) {
        Message.find({ParentID: req.params.id}, function (err, msg) {           
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
//Post Message - Checks user, group and race exists & and if user is allowed to post
    createMessage = function (req, res) {
		User.findOne({Username: req.body.Username}, function (err, user) {
                    if (user == null) {
                        res.send(404, "There is no User with this name");
                    }
                    else{
                        var msg = new Message({
            					Username: req.body.Username,
            					GroupOrRace: req.body.GroupOrRace,
            					ParentID: req.body.ParentID,
            					Text: req.body.Text,
            					ParentMessageID:req.body.ParentMessageID,//falta que comprueve que existe...
                        });
                        console.log(msg);
								console.log(msg.ParentID+'  XXXX  '+user);
								
								var check = false;								
								console.log(user.Groups.length+' YYYYY '+user.Races.length);								
								for (var i=0;i<user.Races.length;i++) {
									if (msg.ParentID==user.Races[i]._id) {
									check=true;										
									}console.log('Usuario habilitado 1'+i);
								
								}
								
								for (var j=0;j<user.Groups.length;j++) {
									if (msg.ParentID==user.Groups[j]._id) {
									check=true;							
									}console.log('Usuario habilitado 2'+j);
								
								}

                        if ((msg.GroupOrRace==true)&&(check)) {
                        	User.find({Races: {_id:req.body.ParentID}}, function (err, u) {
                        	                        	console.log('Create 1>>>>>>>'+u);
                        	});
                        	console.log('Create 1'+msg);
                        	Group.findOne({_id: msg.ParentID},function (err,group) {
                        		                        	console.log('Create 2'+group);
                        	if (group == null) {
                        		res.send(404, "There is no Group with this ID");
                    			}else {
										msg.GroupID=msg.ParentID;
                    				console.log('Create 3'+msg);
                        	   msg.save(function (error) {
                            	if (error) console.log("Error: " + error);
                            	else {console.log("Group Message Created");
                            	res.send(msg);}
                       			 });
                        	}
                        });
                        }else if ((msg.GroupOrRace==false)&&(check)) {
                        	console.log('Create 4'+msg);
                        	Race.findOne({_id: msg.ParentID},function (err,race) {
                        		                        	console.log('Create 5'+race);
                        	if (race == null) {
                        		res.send(404, "There is no Race with this ID");
                    			}else {
                    				console.log('Create 6'+msg);
										msg.RaceID=msg.ParentID;
                        	   		msg.save(function (error) {
                            	if (error) console.log("Error: " + error);
                            	else {console.log("Race Message Created");
                            	res.send(msg);}
                       			 });
                        	}
                        });
                        
                        
								}else {console.log("Message not Created"); 
								res.send(404, "Message Rejected");}
                };

            });
		};


//PUT - Update a register already exists
    updateMessage = function (req, res) {
        Message.findById(req.params.id, function (err, msg) {
            if (!msg) {
                res.send(404, "Message not found");
            } else {
            		msg.Username=req.body.Username,
            		msg.GroupOrRace= req.body.GroupOrRace,
            		msg.ParentID= req.body.ParentID,
            		msg.Text= req.body.Text,

                msg.save(function (err) {
                    if (!err) {
                        console.log('Message Updated');
                    } else {
                        res.send(500, "Mongo Error");
                        console.log('ERROR: ' + err);
                    }
                    res.send(200, msg);
                });
            }
        });
    };

//DELETE - Deletes a Message with answers, if id is from answer deletes answer only
    deleteMessage = function (req, res) {
        Message.findOne({_id: req.params.id}, function (err, msg) {
        	                        console.log(msg+' Messages Removed 1');
            if (!msg) {
                res.send(404, 'Message not found');
            } else if(msg.ParentMessageID) {
                msg.remove(function (err) {
                    if (!err) {
                        console.log('Message Removed');
                        res.send(200, 'OK - Removed');
                    } else {
                        console.log('ERROR: ' + err);
                        res.send(500, "Mongo Error");
                    }
                });
            }else if (!msg.ParentMessageID){
            	Message.find( {$or: [{_id: req.params.id},{ParentMessageID:req.params.id}]}, function (err, msg2) {
            		        	                        console.log(msg2+' Messages Removed 2');
            	for (var i=0;i<msg2.length;i++) {
            		            		        	                        console.log(msg2+' Messages Removed 3');
                msg2[i].remove(function (err) {
                    if (!err) {
                        console.log(msg2.length+' Messages Removed');
                        res.send(200, 'OK - Removed');
                    } else {
                        console.log('ERROR: ' + err);
                        res.send(500, "Mongo Error");
                    }
                });}
            	});
            }
        });
    };


//Link routes and functions
    app.get('/message', findAllMessage);
    app.get('/message/:id', findRaceByID);
    app.get('/message/answer/:id',findMessageAnswerByID);
    app.get('/message/race/:id', findRaceMessage);    
    app.get('/message/group/:id', findGroupMessage); 
    //app.get('/message/group',findAllGroupMessage);
    app.post('/message', createMessage);  


    app.delete('/message/:id', deleteMessage);
    app.put('/message/:id', updateMessage);

};
