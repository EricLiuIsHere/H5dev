"use strict";


var app = angular.module('mainApp',[
  'ui.bootstrap',
  //'eidtToolDirective',
  'editText',
  'editBg',
  'imageEditDirective',
  'homeController',
  'applicationController',
  "kendo.directives",
  'projectController',
  'leftNav',
  'ui.router',
  'ngMaterial',
  'ngMessages',
	'projectService',
  'AuthService',
  'loginDirectiveModule',
  'sessionService',
  'loginService',
  'pageSettingService',
  'imageService'],function($httpProvider) {





$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

//解析数据传输格式
var param = function(obj) {
    var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
    for(name in obj) {
      value = obj[name];
    //    console.log(value+"///value")
      if(value instanceof Array) {
        for(i=0; i<value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value instanceof Object) {
        for(subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value !== undefined && value !== null)
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
      // console.log(query+"/// query")
    }
      
    return query.length ? query.substr(0, query.length - 1) : query;
  };

  // Override $http service's default transformRequest
  $httpProvider.defaults.transformRequest = [function(data) {
    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
  }];
}).constant('AUTH_EVENTS',{
  loginSuccess     : 'auth-login-success',
  loginFailed      : 'auth-login-failed',
  logoutSuccess    : 'auth-logout-success',
  sessionTimeout   : 'auth-session-timeout',
  notAuthenticated : 'auth-not-authenticated',
  notAuthorized    : 'auth-not-authorized'
}).constant('SERVER_URL',{
  /*
    
    声明常量，用于全局变量值更换，可以注到其他方法中
    demo path projectService.js
    project.factory('projectFn',function($http,$q,$timeout,$compile, SERVER_URL ,loginFn){
    .....
    })

  */
  testUrl:"",
  //liveUrl:"http://9.112.70.78:3000/"

  liveUrl:"http://9.115.24.168:3000/"
  //liveUrl:"http://9.112.70.78:3000/"
  // liveUrl:"http://170.225.225.31:85/"
}).constant('USER_ROLES',{}).config(function($stateProvider,$urlRouterProvider){
	$urlRouterProvider.otherwise('/');
	$stateProvider.state('homePage',{
		url:'/',
		views:{
			'':{templateUrl:'./template/home.html',
		 		controller:'homeController',
		 		resolve:{
		 			editPage:function(projectFn){
		 			    // var projectIdCallBack = projectFn.getProjectId();

		 			    // if(projectIdCallBack){
		 			    // 	return projectFn.loadEditPage(projectIdCallBack);	
		 			    // }
		 			},
					getPageLength:function(projectFn){
						 	// return projectFn.getPageLength();
					}
		 		}
			}
		}
	}).state('dashboard',{
		url:'/dashboard',
		views:{
			'':{
           templateUrl:'./template/page.dashboard.tmpl.html',
             controller:'projectController',
             resolve:{
                getMyProjectsList:function(projectFn,loginFn){
                       var userName = loginFn.islogged().email;
                     //console.log('@app.js dec:loading project by userName:'+userName)
                      return projectFn.getProjectList(userName).then(function(data){
                        return data;
                     });
                },
                isLogin:function(loginFn){

                    return loginFn.islogged();
                }
              }
      }
    }
	})
});

app.run(function($rootScope,loginFn){
  $rootScope.$on('$stateChangeStart',function(event,next){
      // console.log('@app.js test refresh dashboard page');
      // console.log('@app.js Fn:loginFn.islogged().status:'+loginFn.islogged().status)
      // console.log('@app.js Fn:loginFn.islogged().userName:'+loginFn.islogged().userName)
      // console.log('@app.js Fn:loginFn.islogged().userPhoto:'+loginFn.islogged().userPhoto)
      if(loginFn.islogged().status){
          $rootScope.currentUser = {
            "userName":loginFn.islogged().userName,
            "userPhoto":loginFn.islogged().userPhoto
          }
      }

  })
});