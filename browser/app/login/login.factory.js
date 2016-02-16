'use strict';

app.factory('LoginFactory', function ($http) {
	var LoginFactory = {};

	LoginFactory.authorize = function (user) {
		return $http.post('/login', user)
					.then(function(response) {
						console.log(response);
						return response;
					});
	};

	return LoginFactory;

});