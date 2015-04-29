module.exports = function(app) {


    var User  = require('../models/user.js');
    var Groups = require('../models/group.js');
    var Races = require('../models/race.js');

    findAllUsers = function(req, res) {
        console.log("GET - /users");

        return User.find(function(err, users) {
            Races.populate(users, { path : 'RacesPending'}, function(err, users){
                Groups.populate(users, { path : 'Group'}, function(err, users){

                    res.send(users);
                    console.log(users);
                    console.log(Races);
                });
            });
        });

    };


    //GET - Return a User with specified Name
    findByName = function(req, res) {
        console.log("GET - /user/:Name");
        //  var name = req.params.Name;
        return User.findOne({"Name": req.params.Name},function(err, user) {
            if(!user) {
                res.statusCode = 404;
                return res.send({ error: 'No se encuentra este nombre de usuario, revise la petición' });
            }
            if(!err) {
                return res.send({ status: 'OK', user:user });

            } else {
                res.statusCode = 500;
                console.log('Internal error(%d): %s',res.statusCode,err.message);
                return res.send({ error: 'Server error' });
            }
        });
    };


    //POST - Insert a new User in the DB
    addUser = function(req, res) {
        console.log('POST - /user');
        console.log(req.body);

        var user = new User({
            Username :  req.body.Username,
            Password :  req.body.Password,
            Name :      req.body.Name,
            Surname :   req.body.Surname,
            Email :     req.body.Email,
            Birthdate : req.body.Birthdate,
            Gender :    req.body.Gender,
            Location :  req.body.Location,
            Level :     req.body.Level,
            Group :     req.body.Group,
            RacesDone : req.body.RacesDone,
            RacesPending: req.body.RacesPending

        });

        user.save(function(err) {
            if(!err) {
                console.log("User created");
                return res.send({ status : 'OK' , user:user});
            } else {
                console.log(err);


                if (err.name == 'ValidationError') {
                    res.statusCode = 400;
                    res.send({error: 'Validation error'});
                } else {
                    res.statusCode = 500;
                    res.send({error: 'Server error'});
                }
                console.log('Internal error(%d): %s', res.statusCode, err.message);
            }
        });

        res.send(user);
    };


    //PUT - Update a register User already exists
    updateUser = function(req, res) {
        console.log("PUT - /user/:Name");
        console.log(req.body);
        return User.findOne({"Name": req.params.Name},function(err, user) {
            if(!user) {
                res.statusCode = 404;
                return res.send({error: 'Not Found' });
            }

            if (req.body.Username != null) user.Username = req.body.Username;
            if (req.body.Password != null) user.Password = req.body.Password;
            if (req.body.Name != null) user.Name = req.body.Name;
            if (req.body.Surname != null) user.Surname = req.body.Surname;
            if (req.body.Email != null) user.Email = req.body.Email;
            if (req.body.Birthdate != null) user.Birthdate  = req.body.Birthdate;
            if (req.body.Gender != null) user.Gender = req.body.Gender;
            if (req.body.Location != null) user.Location = req.body.Location;
            if (req.body.Level != null) user.Level = req.body.Level;


            return user.save(function(err) {
                if(!err) {
                    console.log('Updated');
                    return res.send({ status: 'OK', user:user });
                } else {
                    if(err.name == 'ValidationError') {
                        res.statusCode = 400;
                        res.send({ error: 'Validation error' });
                    } else {
                        res.statusCode = 500;
                        res.send({ error: 'Server error' });
                    }
                    console.log('Internal error(%d): %s',res.statusCode,err.message);
                }

                res.send(user);
            });
        });
    }

    //DELETE - Delete a User with specified Name
    deleteUser = function(req, res) {
        console.log("DELETE -/user/:Name");
        return User.findOne({"Name": req.params.NameRaces},function(err, user) {
            if(!user) {
                res.statusCode = 404;
                return res.send({ error: 'Not found' });
            }

            return user.remove(function(err) {
                if(!err) {
                    console.log('Removed user');
                    return res.send({ status: 'OK' });
                } else {
                    res.statusCode = 500;
                    console.log('Internal error(%d): %s',res.statusCode,err.message);
                    return res.send({ error: 'Server error' });
                }
            })
        });
    }



    //Link routes and functions
    app.get('/users',findAllUsers );
    app.get('/user/:Name', findByName);
    app.post('/user', addUser);
    app.put('/user/:Name', updateUser);
    app.delete('/user/:Name', deleteUser);



}