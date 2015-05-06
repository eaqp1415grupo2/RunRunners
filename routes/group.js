module.exports = function (app) {


    var User = require('../models/user.js');
    var Group = require('../models/group.js');
    var Race = require('../models/race.js');

    findAllGroups = function (req, res) {
        Group.find(function (err, group) {
            if (err) res.send("Error: " + err);
            else res.send(group);
        });
    };

    findGroupByName = function (req, res) {
        Group.findOne({"Name": req.params.name}, function (err, group) {
            if (group == null) res.send("Error: " + err);
            else res.send(group);
        });
    };

    createGroup = function (req, res) {
        Group.findOne({'Name': req.body.Name}, function (err, grupo) {
            console.log(grupo);
            if (grupo == null) {
                var group = new Group({
                    Name: req.body.Name,
                    Info: req.body.Info,
                    Level: req.body.Level,
                    Location: req.body.Location,
                    Admin_Group: req.body.Admin_Group,
                    Users: [{Username: req.body.Admin_Group}]
                });
                console.log(group);
                group.save(function (error) {
                    if (error) console.log("Error: " + error);
                    else console.log("Group Created");
                });
                res.send(group);
            }
            else {
                res.send(500, "There is already a group with this name");
            }
        });
    };

    addUser = function (req, res) {
        var id = req.body._id;
        Group.findOne({_id: req.params.id}, function (error, group) {
            if (!group) {
                res.send(404, 'Group not found');
            } else {
                Group.findOne({_id: req.params.id, 'Users._id': id}, function (err, users) {
                    console.log(id);
                    console.log(users);
                    if (!err && users == null) {
                        group.Users.push(id);
                        group.save(function (err) {
                            if (!err) {
                                console.log('Updated');
                            } else {
                                res.send(500, "Mongo Error: "+ err);
                                console.log('ERROR: ' + err);
                            }
                            res.send(200, group);

                        });
                    } else {
                        res.send(400, 'This user is in the group already');
                    }

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
        Group.findOne({"Name": req.params.name}, function (err, message) {
            if (req.body.Message != null && req.body.Username != null) {
                message.Messages.push(req.body);
            }
            else console.log("Something wrong with: " + req.body);
            message.save(function (err) {
                if (err) console.log("Error: " + err);
                else console.log("User Inserted in Group");
            });
            res.send(message);
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
        Group.findOne({"Name": req.params.name}, function (err, group) {
            group.remove(function (err) {
                if (err) res.send(500, "Error: " + err);
                else res.send(200);
            });
        });
    };

    deleteRace = function (req, res) {
        Group.findOne({"Name": req.params.name}, function (err, group) {
            group.remove({" RacesPending.Race": req.body.Race}, function (err) {
                if (err) res.send(500, "Error: " + err);
                else res.send(200);
            });
        });
    };

    deleteUser = function (req, res) {
        console.log("entro");
        Group.findOne({"Name": req.params.name}, function (err, group) {

            console.log(group.Users.User33._id);
            group.save(function (err) {
                console.log(err + "He entrado");
                if (err) res.send(500, "Error: " + err);
                else res.send(200);
            });
        });
    };

    app.get('/groups', findAllGroups);
    app.get('/groups/:name', findGroupByName);
    app.post('/groups', createGroup);
    app.put('/groups/:name/user', addUser);
    app.put('/groups/:id/race', addRace);
    app.put('/groups/:name/message', addMessage);
    app.put('/groups/:name', updateGroup);
    app.delete('/groups/:name', deleteGroup);
    app.delete('/groups/:name/user', deleteUser);
    app.delete('/groups/:name/race', deleteRace);
};
