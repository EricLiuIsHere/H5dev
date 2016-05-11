"use strict";


var authService = angular.module('AuthService',['session']);
authService.factory('AuthService',function($http,$rootScope,Session,SERVER_URL){
	var userInfo = []
	var authService = {};
	authService.login = function(credentials){
		return $http
				.post(SERVER_URL.liveUrl+'login',credentials)
				.then(function(res){
					Session.create(res.data);
					// for(var i in res.data){
					// 	console.log(i+":"+res.data[i])
					// }
					
					return res.data;
				},function(data){

				});
	};
	authService.isAuthenticated = function(){
		return !!Session.userName;
	};
	authService.isAuthorized = function(authorizedRoles){
		if(!angular.isArray(authorizedRoles)){
			authorizedRoles = [authorizedRoles];
		}
		return(authService.isAuthenticated() &&
			authorizedRoles.indexOf(Session.userRole)!== -1);
	}

	authService.setUserInfo = function(userName,userPhoto){
        // userInfo.length = 0;
		userInfo.push({"userName":userName,"userPhoto":userPhoto});
		return userInfo;
	}

	authService.getUserInfo = function(){
		var u = authService.setUserInfo();
		return userInfo;
	}
	return authService;
});
