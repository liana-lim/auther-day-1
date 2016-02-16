'use strict';

app.controller('signupCtrl', function ($scope, SignupFactory, $state) {
    $scope.newuser = {};   

    $scope.signupNewUser = function () {
        console.log($scope.newuser);


        SignupFactory.createNewUser($scope.newuser)
            .then(function(response) {
                $state.go('stories');
            });

    };

});