'use strict'; 

var app = require('express')();
var path = require('path');
var session = require('express-session');
var passport = require('passport');
var User = require('../api/users/user.model');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


app.use(session({
    // this mandatory configuration ensures that session IDs are not predictable
    secret: 'tongiscool',
}));



passport.use(
    new GoogleStrategy({
        clientID: '288893499258-ildcpfjiih4nf42i0f9h7gogp48nr91d.apps.googleusercontent.com',
        clientSecret: 'SB-v5xHA1oQsUeAfH9gAO5cd',
        callbackURL: 'http://127.0.0.1:8080/auth/google/callback'
    },
    // google will send back the token and profile
    function (token, refreshToken, profile, done) {

        User.findOne({ 'google.id' : profile.id }, function (err, user) {
            // if there is an error, stop everything and return that
            // ie an error connecting to the database
            if (err) return done(err);
            // if the user is found, then log them in
            if (user) {
                return done(null, user); // user found, pass along that user
            } else {
                // if there is no user found with that google id, create them
                var newUser = new User();
                // set all of the google information in our user model
                newUser.google.id = profile.id; // set the users google id                   
                newUser.google.token = token; // we will save the token that google provides to the user                    
                newUser.google.name = profile.displayName; // look at the passport user profile to see how names are returned
                newUser.google.email = profile.emails[0].value; // google can return multiple emails so we'll take the first
                // don't forget to include the user's email, name, and photo
                newUser.email = newUser.google.email; // required field
                newUser.name = newUser.google.name; // nice to have
                newUser.photo = profile.photos[0].value; // nice to have
                // save our user to the database
                newUser.save(function (err) {
                    if (err) done(err);
                    // if successful, pass along the new user
                    else done(null, newUser);
                });
            }
        });
    })
);

// in general, serialize is taking data and putting it into a format that can be sent over a network
passport.serializeUser(function (user, done) {
    done(null, user._id);
});

// think encrypt / decrypt
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

app.use(passport.initialize());
app.use(passport.session());


app.use(function (req, res, next) {
	if (!req.session.counter) req.session.counter = 0;
	console.log('counter', ++req.session.counter);
	next();
});

app.use(require('./logging.middleware'));

app.use(require('./requestState.middleware'));

app.use(require('./statics.middleware'));

app.use('/api', require('../api/api.router'));

app.use('/auth', require('../auth/index.js'));

var validFrontendRoutes = ['/', '/stories', '/users', '/stories/:id', '/users/:id', '/signup', '/login'];

var indexPath = path.join(__dirname, '..', '..', 'public', 'index.html');

validFrontendRoutes.forEach(function (stateRoute) {
	app.get(stateRoute, function (req, res) {
		res.sendFile(indexPath);
	});
});

app.use(require('./error.middleware'));

module.exports = app;