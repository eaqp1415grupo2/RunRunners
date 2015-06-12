module.exports = function (app) {

    var User = require('../models/user.js');
    var Group = require('../models/group.js');
    var Race = require('../models/race.js');
    var Secret = require('../config/secret.js');
    var jwt = require('jwt-simple');

    findAllGroups = function (req, res) {
    console.log('Find Groups');
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
                res.send(404, 'Group not found by Name');
            } else {
                if (err) res.send("Error: " + err);
                else res.send(group);
            }
        });
    };

    findGroupById = function (req, res) {
        Group.findById(req.params.id, function (err, group) {
            if (!group) {
                res.send(404, 'Group Not Found by ID');
            } else {
                if (err) res.send(500, 'Mongo Error');
                else res.send(200, group);
            }
        })
    };

    createGroup = function (req, res) {
        var id = jwt.decode(req.body._id, Secret);
        Group.findOne({'Name': req.body.Name}, function (err, grupo) {

            if (grupo == null) {
                User.findOne({_id: id.iss}, function (err, user) {
                    if (user == null) {
                        res.send(404, 'User Not Found');
                    }
                    else {
                        var group = new Group({
                            Name: req.body.Name,
                            Info: req.body.Info,
                            Level: req.body.Level,
                            Location: req.body.Location,
                            Admin: user.Username,
                            Users: [{
                                _id: user._id,
                                Username: user.Username
                            }]
                        });

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
                res.send(400, "There is already a group with this name");
            }
        });
    };

    addUser = function (req, res) {
        var id = jwt.decode(req.body._id, Secret);
        Group.findOne({_id: req.params.id}, function (error, group) {
            if (!group) {
                res.send(404, 'Group not found');
            } else {
                Group.findOne({_id: req.params.id, 'Users._id': id.iss}, function (err, users) {
                    User.findOne({_id: id.iss}, function (err, user) {
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
                            var userpush = ({
                                _id: group._id,
                                Group: group.Name
                            });
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
        var id = jwt.decode(req.body._id, Secret);
        Group.findOne({_id: req.params.id}, function (err, group) {
            if (!group) {
                res.send(404, 'Group not found');
            } else {
                User.findOne({_id: id.iss}, function (err, user) {
                    if (!user) {
                        res.send(404, 'User Not Found');
                    } else if (user.Username != group.Admin && user.Role != 'admin') {
                        res.send(400, 'Not Allowed');
                    } else {
                        var users = group.Users;
                        for (var i = 0; i < users.length; i++) {
                            User.findOne(users[i]._id, function (err, usuario) {
                                usuario.Groups.pull(group._id);
                                usuario.save(function (err) {
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
                })
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

    removeUserGroup = function(group, user, res){
        if (group.Admin === user.Username) {
            if(!group.Users[1]){
                user.Groups.pull(group._id);
                user.save(function (error) {
                    if (error) res.send(500, 'Mongo Error');
                    else {
                        console.log(group);
                    }
                });
                group.remove(function(err){
                   if(err) res.send(500,'Mongo Error');
                    else res.send(200,'Group Removed');
                });

            }else {
                group.Admin = group.Users[1].Username;
            }
        }
        group.Users.pull(user._id);
        group.save(function (err) {
            if (err) res.send(500, "Error: " + err);
        });
        user.Groups.pull(group._id);
        user.save(function (error) {
            if (error) res.send(500, 'Mongo Error');
            else {
                res.send(200);
            }
        });

    };

    deleteUser = function (req, res) {
        var id = jwt.decode(req.body._id, Secret);
        Group.findOne({_id: req.params.id}, function (err, group) {
            if (!group) {
                res.send(404, 'Group Not Found');
            } else {
                Group.findOne({_id: req.params.id, 'Users._id': id.iss}, function (error, users) {
                    if (!users) {
                        res.send(404, 'This User is not inside this group');
                    } else {
                        if (!req.body.delete) {
                            User.findOne({_id: id.iss}, function (err, user) {
                                removeUserGroup(group, user, res);
                            });
                        } else {
                            User.findOne({_id: id.iss}, function (err, user) {
                                if (user.Username != group.Admin && user.Role !='admin') {
                                    res.send(405, 'Not Allowed');
                                } else {
                                    var position = false;
                                    for (i = 0; i < group.Users.length; i++) {
                                        if (group.Users[i]._id.equals(req.body.delete)) {
                                            position = true;
                                            User.findOne({_id: req.body.delete}, function (err, deleteuser) {
                                                removeUserGroup(group, deleteuser, res);
                                            });
                                            break;
                                        }
                                    }
                                    if (!position) {
                                        res.send(404, 'User not found');
                                    }
                                }
                            });
                        }
                    }
                });
            }
        });
    };


    findNoUserGroup = function (req, res) {
        var id = jwt.decode(req.params.id, Secret);
        Group.find({'Users._id': {$nin: [id.iss]}}, function (err, user) {
            if (err)res.send(500, 'Mongo Error');
            else res.send(user);
        });
    };

    findUserGroup = function (req, res) {
        var id = jwt.decode(req.params.id, Secret);
        Group.find({'Users._id': id.iss}, function (err, user) {
            if (err)res.send(500, 'Mongo Error');
            else res.send(user);
        });
    };

    app.get('/groups', findAllGroups);
    app.get('/groups/name/:name', findGroupByName);
    app.get('/groups/:id', findGroupById);
    app.get('/groups/no/:id', findNoUserGroup);
    app.get('/groups/user/:id', findUserGroup);
    app.post('/groups', createGroup);
    app.post('/groups/:id/user', addUser);
    app.post('/groups/:id/race', addRace);
    app.put('/groups/:id', updateGroup);
    app.delete('/groups/:id', deleteGroup);
    app.delete('/groups/:id/user', deleteUser);
    app.delete('/groups/:id/race', deleteRace);

};
