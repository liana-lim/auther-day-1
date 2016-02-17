'use strict';

app.factory('AuthFactory', function ($http) {
    var AuthFactory = {};

    AuthFactory.createNewUser = function (newuser) {
        return $http.post('/auth/signup', newuser) //why need /api for signup and not login
        .then(function(response) {
            console.log(response);
            return response;
        });
    };

    AuthFactory.login = function (user) {
        return $http.post('/auth/login', user)
        .then(function(response) {
            console.log(response);
            return response;
        });
    };

    AuthFactory.signout = function (user) {
        return $http.post('/auth/signout', user)
        .then(function (response) {
            console.log(response, "Signedout");
            return response;
        });
    };

    return AuthFactory;

});