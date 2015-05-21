module.exports = function (app) {

    var jwt = require('jwt-simple');
    var User = require('../models/user.js');
    var Groups = require('../models/group.js');
    var Races = require('../models/race.js');

    findAllUsers = function (req, res) {
        console.log("GET - /users");
        User.find(function (err, users) {
            if (err) res.send(500, "Mongo Error");
            else res.send(200, users);
        });

    };


    //GET - Return a User with specified Name
    findByUsername = function (req, res) {
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

        var user = new User({
            Username: req.body.Username,
            Password: req.body.Password,
            Name: req.body.Name,
            Surname: req.body.Surname,
            Email: req.body.Email,
            Birthdate: req.body.Birthdate,
            Gender: req.body.Gender,
            Location: req.body.Location,
            Level: req.body.Level

        });

        user.save(function (err) {
            if (!err) {
                console.log("User created");
                return res.send(200, user);
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
    };

    authenticate = function(req, res) {
        User.findOne({"Username": req.body.Username}, function(err, user) {
            if (err) throw err;
            if (!user) {
                res.send(404, 'No se encuentra este nombre de usuario, revise la petición');
            } else if (user) {
                if (user.Password != req.body.Password) {
                    res.send(404, 'Password error');
                } else {
                    var token = jwt.encode(user.Username, 'secret');
                    return res.send(200, token);
                }
            }
        });
    };

    //PUT - Update a register User already exists
    updateUser = function (req, res) {
        console.log("PUT - /user/:Username");
        console.log(req.body);
        User.findOne({"Username": req.params.Username}, function (err, user) {
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
        console.log("DELETE -/user/:Username");
        User.findOne({"Username": req.params.Username}, function (err, user) {
            if (!user) {
                res.send(404, 'Not Found');
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


    //Link routes and functions
    app.get('/user', findAllUsers);
    app.get('/user/:Username', findByUsername);
    app.post('/user', addUser);
    app.put('/user/:Username', updateUser);
    app.delete('/user/:Username', deleteUser);


};