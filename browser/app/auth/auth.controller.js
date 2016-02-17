'use strict';

app.controller('authCtrl', function ($scope, AuthFactory, $state) {
    $scope.user = {}; 
    $scope.newuser = {};  

    $scope.submitLogin = function (user) {
        AuthFactory.login($scope.user)
        .then(function(response) {
            $state.go('stories');
        });
    };

    $scope.signupNewUser = function (newuser) {
        AuthFactory.createNewUser($scope.newuser)
        .then(function(response) {
            $state.go('stories');
        });
    };

    $scope.userSignOut = function (user) {
        AuthFactory.signout($scope.user)
        .then(function (response) {
            $state.go('home');
        });
    }



});