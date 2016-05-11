"use strict";

angular.module('applicationController',[])
	.controller('applicationController',function($scope,$rootScope,USER_ROLES,AuthService,loginFn){

	$scope.userRoles = USER_ROLES;
	$rootScope.isAuthorized = loginFn.islogged();
	$rootScope.$broadcast('')	

	$rootScope.setCurrentUser = function(user){
		$rootScope.currentUser = user;
		// console.log(user.userName+"//// user")
		// console.log(user.userPhoto+"//// user")
	}

	$rootScope.getCurrentUser = function(){
		// console.log(loginFn.islogged()+"loginFn.islogged()")
		return loginFn.islogged();
	}
})
