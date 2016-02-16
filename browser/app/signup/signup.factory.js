'use strict';

app.factory('SignupFactory', function ($http) {
    var SignupFactory = {};

    SignupFactory.createNewUser = function (newuser) {
        return $http.post('/signup', newuser)
                    .then(function(response) {
                        console.log(response);
                        return response;
                    });
    };

    return SignupFactory;

});