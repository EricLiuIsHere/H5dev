"use strict";
/*
*@ editBackground.js 负责处理背景颜色
-----------------------------------------------------------------------------------------------
*@ editBackground模块，显示背景颜色编辑面板
-----------------------------------------------------------------------------------------------
*@ 背景属性面板              : showBackgroundEditPanel()
**/



var editBg = angular.module('editBg',[]);

editBg.directive('editbg',function(
	$sce,      		//用于解析html的angularjs服务  			@angular.js
	$mdDialog, 		//提供对话框的模块             			@angular-material.js
	$mdToast,  		//提供文本/图片编辑面板        			@angular-material.js
	$compile,  		//提供动态插入html的解析服务，解析有ng指令 
	$document, 		//angularjs 内部服务 
	$rootScope,		//angularjs 内部服务
	projectFn, 		//提供项目接口                       	@projectService.js
	AuthService,	//提供用户登陆验证                  	@AuthService.js
	SERVER_URL, 	//提供全局常量
	loginFn,     	//提供登陆验证，登陆状态，退出方法  	@loginService.js
	pageSettingService
){
	return {
		restrict:'AE',
		templateUrl:'./template/edit.background.tmpl.html',
		scope:{},
		link:function($scope){

			// $(document).undelegate('.isEdit', 'click').delegate('.isEdit','click',function(e){
			// 	console.log('ddds');
			// 	e.stopPropagation();
			// 	$('#background-properties').remove();
			// 	$('#text-properties').remove();
			// 	$('.img-properties').remove();
			// 	showBackgroundEditPanel($mdToast,$document);
			// })

			$scope.showBgPanel = function(){
				$('#text-properties').remove();
				$('.img-properties').remove();
                showBackgroundEditPanel($mdToast,$document);
                
                
			};

		}
	}
})


//显示背景编辑面板
function showBackgroundEditPanel($mdToast,$document){

	$mdToast.show({
      controller: function($scope,$mdDialog){

	},
      templateUrl: './template/backgroundPropertyPanel.html',
      parent :$('#editModulePosition'),
      hideDelay: false
    });
}



