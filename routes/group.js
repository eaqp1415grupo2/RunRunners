module.exports = function (app) {

    var Group = require('../models/group.js');

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
        // if (Group.findOne({"Name": req.body.Name}) == null) {
        var group = new Group({
            Name: req.body.Name,
            Info: req.body.Info,
            Level: req.body.Level,
            Location: req.body.Location,
            Admin_Group: req.body.Admin_Group,
            Users: [{Username: req.body.Admin_Group}]
        });
        console.log(group);
        group.save(function (err) {
            if (err) console.log("Error: " + err);
            else console.log("Group Created");
        });
        res.send(group);
        //}
        //else console.log("There is already a group with this name");
    };

    addUser = function (req, res) {
        console.log(req.params.name);

        Group.findOne({"Name": req.params.name}, function (err, user) {
            console.log(req.body);
            // if (Group.findOne({"Users.Username": req.body.Username}) == null) {
            if (req.body.Username != null) user.Users.push(req.body);
            else console.log("Something wrong with: " + req.body);
            user.save(function (err) {
                if (err) console.log("Error: " + err);
                else console.log("User Inserted in Group");
            });
            res.send(user);
            //  }
            // else console.log("This User is inside this group already");
        });

    };

    addRace = function (req, res) {
        Group.findOne({"Name": req.params.name}, function (err, race) {
            if (Group.findOne({"RacesPending.Race": req.body.Race} == null)) {
                if (req.body.Race != null) race.RacesPending.push(req.body);
                else console.log("Something wrong with: " + req.body);
                race.save(function (err) {
                    if (err) console.log("Error: " + err);
                    else console.log("User Inserted in Group");
                });
                res.send(race);
            }
            else console.log("This Race is already in this group");
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

    app.get('/groups', findAllGroups);
    app.get('/groups/:name', findGroupByName);
    app.post('/groups', createGroup);
    app.put('/groups/:name/user', addUser);
    app.put('/groups/:name/race', addRace);
    app.put('/groups/:name/message', addMessage);

};
