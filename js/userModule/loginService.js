'use strict';
/*
* sessionFn  解决用户刷新页面后仍然是登录状态
*
***********/
angular.module('loginService',[])
	.factory('loginFn',function($http,$q,$rootScope,sessionFn,SERVER_URL){
		return {
			login:function(credentials){
				var deffered = $q.defer();
				$http.post(SERVER_URL.liveUrl+'login',credentials)
					.success(function(data){
							if(data.status){
								sessionFn.set('user',JSON.stringify(data));
								$rootScope.setCurrentUser(data);
							}
							deffered.resolve(data);
						
			
					})
					.error(function(data){
							deffered.reject(data);
					});

					 return deffered.promise;

			},
			logout:function(){
				sessionFn.destroy('user')
			},
			islogged:function(){
				if(sessionFn.get('user')){
					var objN = JSON.parse(sessionFn.get('user'));
					return objN;
				}else {
					return false
				};
			}
		}
	})
