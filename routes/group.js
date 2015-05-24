module.exports = function (app) {

    var User = require('../models/user.js');
    var Group = require('../models/group.js');
    var Race = require('../models/race.js');

    findAllGroups = function (req, res) {

        Group.find(function (err, groups) {
            if (!groups) {
                res.send(404, 'There are no groups');
            } else {
                if (err) res.send("Error: " + err);
                else res.send(groups);
            }
        });
    };

    findGroupByName = function (req, res) {
        Group.findOne({"Name": req.params.name}, function (err, group) {
            if (!group) {
                res.send(404, 'Group not found');
            } else {
                if (err) res.send("Error: " + err);
                else res.send(group);
            }
        });
    };

    findGroupById = function(req, res){
        Group.findById(req.params.id, function(err, group){
            if(!group){
                res.send(404,'Group Not Found');
            }else{
                if(err) res.send(500, 'Mongo Error');
                else res.send(200, group);
            }
        })
    };

    createGroup = function (req, res) {
        Group.findOne({'Name': req.body.Name}, function (err, grupo) {
            console.log(grupo);
            if (grupo == null) {
                User.findOne({Username: req.body.Admin_Group}, function (err, user) {
                    if (user == null) {
                        res.send(404, "There is no User with this name");
                    }
                    else {
                        var group = new Group({
                            Name: req.body.Name,
                            Info: req.body.Info,
                            Level: req.body.Level,
                            Location: req.body.Location,
                            Admin_Group: user.Username,
                            Users: [{_id: user._id, Username: user.Username}]
                        });
                        console.log(group);
                        group.save(function (error) {
                            if (error) console.log("Error: " + error);
                            else console.log("Group Created");
                        });
                        var userpush = ({_id: group._id, Group: group.Name});
                        user.Groups.push(userpush);
                        user.save(function (err) {
                            if (err) console.log("Error: " + err);
                            else console.log("Updated");
                        });
                        res.send(group);
                    }
                });
            }
            else {
                res.send(500, "There is already a group with this name");
            }
        });
    };

    addUser = function (req, res) {
        var id = jwt.decode(req.body._id,Secret);
        Group.findOne({_id: req.params.id}, function (error, group) {
            if (!group) {
                res.send(404, 'Group not found');
            } else {
                Group.findOne({_id: req.params.id, 'Users._id': id}, function (err, users) {
                    User.findOne({_id: id}, function (err, user) {
                        // console.log(user);
                        if (!err && users == null && user != null) {
                            var grouppush = ({_id: user._id, Username: user.Username});
                            group.Users.push(grouppush);
                            group.save(function (err) {
                                if (!err) {
                                    console.log('Updated');
                                } else {
                                    console.log('ERROR: ' + err);
                                }
                            });
                            var userpush = ({_id: group._id, Group: group.Name});
                            user.Groups.push(userpush);
                            user.save(function (err) {
                                if (!err) {
                                    console.log('Updated');
                                } else {
                                    console.log('ERROR: ' + err);
                                }
                            });
                            res.send(200, group);
                        } else {
                            res.send(400, 'This user is in the group already');
                        }
                    })
                });
            }
        });
    };

    addRace = function (req, res) {
        var id = req.body._id;
        console.log(id);
        Group.findOne({_id: req.params.id}, function (err, group) {
            if (!group) {
                res.send(404, "Group not found");
            }
            else {
                Group.findOne({_id: req.params.id, 'Races._id': id}, function (error, race) {
                    if (!err && race == null) {
                        group.Races.push({_id: id});
                        group.save(function (err) {
                            if (!err) {
                                console.log('Updated');
                            } else {
                                res.send(500, "Cast Error, there is no race with this ID");
                                console.log('ERROR: ' + err);
                            }
                            res.send(200, group);

                        });
                    } else {
                        res.send(400, "Race already in the group");
                    }
                });
            }
        });
    };

    addMessage = function (req, res) {
        Group.findOne({_id: req.params.id}, function (err, group) {
            if (!group) {
                res.send(404, 'Group Not Found');
            } else {
                var id = req.body._id;
                User.findOne({_id: id}, {Username: 1}, function (err, user) {
                    console.log(user);
                    var message = ({UserID: user._id, Username: user.Username, Text: req.body.Text});
                    console.log(message);
                    group.Messages.push(message);
                    group.save(function (err) {
                        if (err) res.send(500, "Mongo Error");
                        else res.send(200, group);
                    });
                });
            }
        });
    };

    addAnswer = function (req, res) {
        Group.findOne({_id: req.params.id}, function (err, group) {
            if (!group) {
                res.send(404, 'Group Not Found');
            } else {
                Group.findOne({_id: req.params.id, 'Messages._id' :req.params.message}, function (err, messages) {
                    if (!messages) {
                        res.send(404, 'Message Not Found');
                    } else {
                        var position;
                        for(var i in messages.Messages){
                            if(messages.Messages[i]._id.equals(req.params.message)){
                                position = i;
                                break;
                            }
                        }
                        var id = req.body._id;
                        User.findOne({_id: id}, {Username: 1}, function (err, user) {
                            var answer = ({UserID: user._id, Username: user.Username, Answer: req.body.Answer});
                            messages.Messages[position].Answers.push(answer);
                            messages.save(function (err) {
                                if (err) res.send(500, "Mongo Error");
                                else res.send(200, messages);
                            });
                        });
                    }
                });
            }
        });
    };

    updateGroup = function (req, res) {
        Group.findOne({"Name": req.params.name}, function (err, group) {
            if (req.body.Name != null) group.Name = req.body.Name;
            if (req.body.Info != null) group.Info = req.body.Info;
            if (req.body.Level != null) group.Level = req.body.Level;
            if (req.body.Location != null) group.Location = req.body.Location;
            if (req.body.Admin_Group != null) group.Admin_Group = req.body.Admin_Group;
            group.save(function (error) {
                if (error) console.log("Error: " + error);
                else console.log("Group Updated");
            });
            res.send(group);
        });
    };

    deleteGroup = function (req, res) {
        Group.findOne({_id: req.params.id}, function (err, group) {
            if (!group) {
                res.send(404, 'Race not found');
            } else {
                var users = group.Users;
                for (var i = 0; i < users.length; i++) {
                    User.findOne(users[i]._id, function (err, user) {
                        user.Groups.pull(group._id);
                        user.save(function (err) {
                            if (!err) {
                                console.log('User Removed');
                            } else {
                                console.log('ERROR: ' + err);
                                res.send(500, "Mongo Error");
                            }
                        });
                    });
                }
                group.remove(function (err) {
                    if (!err) {
                        console.log('Removed');
                        res.send(200, 'OK');
                    } else {
                        console.log('ERROR: ' + err);
                        res.send(500, "Mongo Error");
                    }
                });
            }
        });
    };

    deleteRace = function (req, res) {
        Group.findOne({_id: req.params.id}, function (err, group) {
            group.remove({" RacesPending.Race": req.body.Race}, function (err) {
                if (err) res.send(500, "Error: " + err);
                else res.send(200);
            });
        });
    };

    deleteUser = function (req, res) {
        var id = jwt.decode(req.body._id,Secret);
        Group.findOne({_id: req.params.id}, function (err, group) {
            if (!group) {
                res.send(404, 'Group Not Found');
            } else {
                User.findOne({_id: req.params.id, 'Users._id': id}, function (error, user) {
                    console.log(user);
                    if (user == null) {
                        res.send(404, 'There is no user with in this group');
                    } else {
                        group.Users.pull(id);
                        group.save(function (err) {
                            if (err) res.send(500, "Error: " + err);
                            else res.send(200);
                        });
                    }
                });
            }
        });
    };

    app.get('/groups', findAllGroups);
    app.get('/groups/:name', findGroupByName);
    app.get('/groups/id/:id', findGroupById);
    app.post('/groups', createGroup);
    app.post('/groups/:id/user', addUser);
    app.post('/groups/:id/race', addRace);
    app.post('/groups/:id/message', addMessage);
    app.put('/groups/:id', updateGroup);
    app.put('/groups/:id/message/:message',addAnswer);
    app.delete('/groups/:id', deleteGroup);
    app.delete('/groups/:id/user', deleteUser);
    app.delete('/groups/:id/race', deleteRace);
};
