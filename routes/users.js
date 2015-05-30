module.exports = function (app) {

    var jwt = require('jwt-simple');
    var moment = require('moment');
    var User = require('../models/user.js');
    var Groups = require('../models/group.js');
    var Races = require('../models/race.js');
    var Secret = require('../config/secret.js');

    findAllUsers = function (req, res) {
        console.log("GET - /users");
        User.find(function (err, users) {
            if (err) res.send(500, "Mongo Error");
            else res.send(200, users);
        });

    };


    //GET - Return a User with specified Name
    findByID = function (req, res) {
        console.log("GET - /user/:id");
        //  var name = req.params.Name;
        console.log(req);
        var id = jwt.decode(req.params.id, Secret);
        User.findOne({_id: id.iss}, function (err, user) {
            if (!user) {
                res.send(404, 'No se encuentra este nombre de usuario, revise la petición');
            }
            if (!err) {
                res.send(200, user);

            } else {
                console.log('Internal error: %s', err.message);
                res.send(500, 'Server error');
            }
        });
    };

    //GET - Return a User with specified Name
    //GET - Return a User with specified Name
    findUsername = function (req, res) {
        console.log("GET - /user/:Username");
        //  var name = req.params.Name;
        User.findOne({"Username": req.params.Username}, function (err, user) {
            if (!user) {
                res.send(404, 'No se encuentra este nombre de usuario, revise la petición');
            }
            if (!err) {
                res.send(200, user);

            } else {
                console.log('Internal error: %s', err.message);
                res.send(500, 'Server error');
            }
        });
    };


    //POST - Insert a new User in the DB
    addUser = function (req, res) {
        console.log('POST - /user');
        console.log(req.body);
        User.findOne({Username: req.body.Username}, function (err, user) {
            if (!user) {
                var user = new User({
                    Username: req.body.Username,
                    Password: req.body.Password,
                    Name: req.body.Name,
                    Surname: req.body.Surname,
                    Email: req.body.Email,
                    Birthdate: req.body.Birthdate,
                    Gender: req.body.Gender,
                    Location: req.body.Location,
                    Level: req.body.Level,
                    Role: 'registered',
                    Type: 'local'

                });

                user.save(function (err) {
                    if (!err) {
                        var expires = moment().add(2, 'days').valueOf();
                        var token = jwt.encode({iss: user._id, exp: expires}, Secret);
                        res.send(200, token);
                    } else {
                        console.log(err);
                        if (err.name == 'ValidationError') {

                            res.send(400, 'Validation error');
                        } else {
                            res.send(500, 'Server error');
                        }
                        console.log('Internal error: %s', err.message);
                    }
                });
                res.send(user);
            } else {
                res.send(400, 'Tere is a User with this Username');
            }
        });
    };

    authenticate = function (req, res) {
        console.log(req.body);
        User.findOne({"Username": req.body.Username}, function (err, user) {
            if (err) throw err;
            if (!user) {
                res.send(404, 'No se encuentra este nombre de usuario, revise la petición');
            } else if (user) {
                console.log(user);
                if (user.Password != req.body.Password) {
                    res.send(404, 'Password error');
                } else {
                    var expires = moment().add(2, 'days').valueOf();
                    var token = jwt.encode({iss: user._id, exp: expires}, Secret);
                    res.send(200, token);
                }
            }
        });
    };

    //PUT - Update a register User already exists
    updateUser = function (req, res) {
        console.log("PUT - /user/:Username");
        console.log(req.body);
        var id = jwt.decode(req.params.id, Secret);
        User.findOne({_id: id.iss}, function (err, user) {
            if (!user) {
                res.send(404, 'Not Found');
            }
            else {
                if (req.body.Username != null) user.Username = req.body.Username;
                if (req.body.Password != null) user.Password = req.body.Password;
                if (req.body.Name != null) user.Name = req.body.Name;
                if (req.body.Surname != null) user.Surname = req.body.Surname;
                if (req.body.Email != null) user.Email = req.body.Email;
                if (req.body.Birthdate != null) user.Birthdate = req.body.Birthdate;
                if (req.body.Gender != null) user.Gender = req.body.Gender;
                if (req.body.Location != null) user.Location = req.body.Location;
                if (req.body.Level != null) user.Level = req.body.Level;


                user.save(function (err) {
                    if (!err) {
                        console.log('Updated');
                        res.send(200, user);
                    } else {
                        if (err.name == 'ValidationError') {

                            res.send(400, 'Validation error');
                        } else {

                            res.send(500, 'Server error');
                        }
                        console.log('Internal error: %s', res.statusCode, err.message);
                    }

                    res.send(user);
                });
            }
        });
    };

    //DELETE - Delete a User with specified Name
    deleteUser = function (req, res) {
        console.log("DELETE -/user/:id");
        var id = jwt.decode(req.params.id, Secret);
        User.findOne({"_id": id.iss}, function (err, user) {
            if (!user) {
                res.send(404, 'Not Found');
            }
            var races = user.Races;
            var groups = user.Groups;
            for (var i = 0; i < races.length; i++) {
                Race.findOne(races[i]._id, function (err, race) {
                    race.Users.pull(id.iss);
                    race.save(function (err) {
                        if (!err) {
                            console.log('User Removed');
                        } else {
                            console.log('ERROR: ' + err);
                            res.send(500, "Mongo Error");
                        }
                    });
                });
            }
            for (var j = 0; j < races.length; j++) {
                Group.findOne(groups[j]._id, function (err, group) {
                    group.Users.pull(id.iss);
                    group.save(function (err) {
                        if (!err) {
                            console.log('User Removed');
                        } else {
                            console.log('ERROR: ' + err);
                            res.send(500, "Mongo Error");
                        }
                    });
                });
            }
            user.remove(function (err) {
                if (!err) {
                    console.log('Removed user');
                    res.send(200);
                } else {
                    console.log('Internal error(%d): %s', res.statusCode, err.message);
                    res.send(500, 'Server Error');
                }
            })
        });
    };

    findRaces = function (req, res) {

        var id = jwt.decode(req.params.id, Secret);
        User.findOne({_id: id.iss}, function (err, user) {
            if (!user) {
                res.send(404, 'User Not Found');
            }
            else {
                if (err) res.send(500, 'Mongo Error');
                else {
                    var races = user.Races;
                    console.log(races);
                    res.send(200, races);
                }
            }
        });
    };

    findGroups = function (req, res) {

        var id = jwt.decode(req.params.id, Secret);
        User.findOne({_id: id.iss}, function (err, user) {
            if (!user) {
                res.send(404, 'User Not Found');
            }
            else {
                if (err) res.send(500, 'Mongo Error');
                else {
                    var groups = user.Groups;
                    console.log(groups);
                    res.send(200, groups);
                }
            }
        });
    };

    //Link routes and functions
    app.get('/user', findAllUsers);
    app.get('/user/:id', findByID);
    app.post('/user', addUser);
    app.post('/user/auth', authenticate);
    app.put('/user/:id', updateUser);
    app.delete('/user/:id', deleteUser);
    app.get('/user/:id/races', findRaces);
    app.get('/user/:id/groups', findGroups);
    app.get('/user/username/:Username', findUsername);


};