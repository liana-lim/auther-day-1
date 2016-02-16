'use strict';

var router = require('express').Router(),
	_ = require('lodash');

var session = require('express-session');

var User = require('../../api/users/user.model');



router.use(session({
    // this mandatory configuration ensures that session IDs are not predictable
    secret: 'tongiscool',
}));

router.use(function (req, res, next) {
  if (!req.session.counter) req.session.counter = 0;
  console.log('counter', ++req.session.counter);
  next();
});

router.post('/', function (req, res, next) {
    console.log(req.body);
    User.findOne({
        email: req.body.email,
        password: req.body.password
    }).exec()
    .then(function (user) {
    	console.log(user);
        if (!user) {
            res.sendStatus(401);
        } else {
            req.session.userId = user._id;
            res.sendStatus(200);
        }
    })
    .then(null, next);

});

router.use(function (req, res, next) {
    console.log('session', req.session);
    next();
});

module.exports = router;