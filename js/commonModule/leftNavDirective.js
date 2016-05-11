"use strict";
/*
*@ leftNavDirective.js 负责home.html左侧缩略图生成
-----------------------------------------------------------------------------------------------
*@ leftNavDirective模块会根据用户添加操作在左侧生成缩略图
-----------------------------------------------------------------------------------------------
*@ 创建新页面				 ：$scope.createNewPage() = function(){}
**/



angular.module('leftNav',[]).directive('pageleft',function($mdToast,$document){
   "use strict"
	return{
		restrict:"AE",
		templateUrl:"./template/page.left.tmpl.html",
		scope:{},
		link:function($scope){
            var indexArray=10;
			$scope.createNewPage = function(){
				//第一个页面必须有 swiper-slide-active
			    $('.swiper-slide').hasClass('isEdit')?$('.swiper-slide').removeClass('isEdit').css("display","none"):'';
				var newSlide = $('<div class="swiper-slide isEdit"></div>'); 
				$(".isEdit").css('display','block');
                newSlide.appendTo($('#pagesList'));
                showBackgroundEditPanel($mdToast,$document);
			}
		}
	}
});
