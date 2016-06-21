'use strict'
/*
*@ pageSettingService.js 配置页面相关属性
-----------------------------------------------------------------------------------------------
*@ pageSettingServic 提供了页面的滑动方向，以及其他配置
-----------------------------------------------------------------------------------------------
**/

var pageSetting = angular.module('pageSettingService',[]);

pageSetting.factory('pageSettingService',function(){
	var pageSetting = {}
 
	var _defaultSetting = '<script type="text/javascript"> var mySwiper=new Swiper(".swiper-container",{ prevButton:".swiper-button-prev",nextButton:".swiper-button-next",direction:"vertical",onInit:function(swiper){swiperAnimateCache(swiper);swiperAnimate(swiper)},onSlideChangeEnd:function(swiper){swiperAnimate(swiper)}})</script>';

	pageSetting.setPageSetting = function(direction){
		console.log(direction+":direction ")

		_defaultSetting = '<script type="text/javascript">'+
			                   ' var mySwiper=new Swiper(".swiper-container",'+
			                   '{ prevButton:".swiper-button-prev",'+
			                     'nextButton:".swiper-button-next",'+
			                     'direction:"'+direction+'",'+
			                     'onInit:function(swiper){'+
			                     		'swiperAnimateCache(swiper);swiperAnimate(swiper)'+
			                     		'},'+
			                     'onSlideChangeEnd:function(swiper){swiperAnimate(swiper)}'+
			                     '})'+
			                '</script>';
		pageSetting.direction = direction;
		//console.log(_defaultSetting)
	}

	pageSetting.getPageSetting = function(){
		return _defaultSetting;
	}

	return pageSetting;
});
