var expires = moment().add('days', 7).valueOf();
var token = jwt.encode({
    iss: user.id,
    exp: expires
}, app.get('jwtTokenSecret'));

res.json({
    token : token,
    expires: expires,
    user: user.toJSON()
});