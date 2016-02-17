'use strict'; 

var router = require('express').Router(),
        _ = require('lodash');
var session = require('express-session');
var User = require('../api/users/user.model');
var passport = require('passport');

router.post('/login', function (req, res, next) {
    User.findOne({
        email: req.body.email,
        password: req.body.password
    }).exec()
    .then(function (user) {
        if (!user) {
            res.sendStatus(401);
        } else {
            req.session.userId = user._id;
            res.sendStatus(200);
        }
    })
    .then(null, next);

});

router.post('/signup', function (req, res, next) {
    User.create(req.body)
    .then(function (user) {
        req.session.userId = user._id;
        res.status(201).json(user);
    })
    .then(null, next);
});

router.use('/signout', function (req, res, next) {
    req.session.destroy();
    res.sendStatus(200);
});

//google authentication and login 
router.get('/google', passport.authenticate('google', { scope : 'email' }));

// handle the callback after google has authenticated the user
router.get('/google/callback',
  passport.authenticate('google', {
    successRedirect : '/',
    failureRedirect : '/'
  }));





router.use(function (req, res, next) {
    console.log('session', req.session);
    next();
});

module.exports = router;