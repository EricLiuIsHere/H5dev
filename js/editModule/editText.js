"use strict";
/*
*@ editText.js 负责处理文本编辑
-----------------------------------------------------------------------------------------------
*@ editText模块，实现了创建文本，对文本的拖拽，属性更改，以及点击文本的同时显示文本编辑面板
-----------------------------------------------------------------------------------------------
*@ 创建新文本				 ：$scope.newText = function(){ createNewText($mdToast,$document);};
*@ 初始化文本                ：createNewText()
*@ 初始化对文本拖拽，改变尺寸：initSelectedAndDraggable()
*@ 点击文本属性回显			 : textActive()
*@ 文本属性面板              : showTextEditPanel()
**/




var editText = angular.module('editText',[]);

editText.directive('edittext',function(
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
		templateUrl:'./template/edit.text.tmpl.html',
		scope:{},
		link:function($scope){

           // $(document).on('click','.editContainer',function(){
           // 	$('.ui-selected').removeClass('ui-selected');
           // })
//监听重新编辑后的文本点击事件

			$(document).undelegate('.textElementActive', 'click').delegate('.textElementActive','click',function(e){

				e.stopPropagation();
				$('.ui-selected').removeClass('ui-selected');
			    $('#text-properties').remove();
				$('.img-properties').remove();
			    
                console.log('test works works')
			    $('.mText').blur();
				$(this).addClass('ui-selected');				
				$('.ui-selected >.mText').focus();
				initSelectedAndDraggable();
				showTextEditPanel($mdToast,$document);
				// console.log("@editText.js line 83 Dec UPDATE"+$(this).parent().attr('class'));	
			})




            /*
            *@ 读取已保存的项目到编辑页面
            *
            ****/
            var loadingProjectById = projectFn.getProjectId();
// console.log("loadingProjectById:"+loadingProjectById)
			if(loadingProjectById){
// console.log("works:"+loadingProjectById)
				projectFn.loadEditPage(loadingProjectById).then(function(data){

					//动态绑定ng-bind-html到 dom结点，通过$compile来解析 ng指令
					$compile($("#pagesList").attr('ng-bind-html','page.editCode'))($scope)

					$scope.page = { "editCode":""};

					//通过$sce,格式化html。db存储的html是字符串，angularjs需要通过$sce来格式化
					$scope.page.editCode = $sce.trustAsHtml(data.pages.editCode);
					//console.log(data.pages.projectName);

					//load left Thumbnail
					// setTimeout(function(){
					// 	$('.col-leftclick .swiper-slide').remove();
					// 	$.each($('.box .page'), function(i,val){  
					// 	      $('.box .page').eq(i).append(data.pages.leftCode[i]);
					// 	      //console.log('================='+data.pages.leftCode[i]);
					// 	  });
					//   },450); 

					console.log('data.pages.pageSetting.direction:'+data.pages.pageSetting.direction);
					$('#sliderDirection').attr('data-direction',data.pages.pageSetting.direction);
					pageSettingService.setPageSetting(data.pages.pageSetting.direction);
					//将当前项目id绑定到dom结点，用于保存更新项目
					console.log('checko12');
					$("#pagesList").attr('data-projectid',loadingProjectById);
                    $(".currentprojectname").text(data.projectname);

                    console.log('checko13');
                    //设置默认显示页面
					setTimeout(function(){
						console.log("A")
						$('#pagesList .swiper-slide').eq(0).addClass('isEdit').show();
							console.log("AA  "+$('#sliderDirection').attr('data-direction') )
						if($("#sliderDirection").attr('data-direction') == ''){
							console.log("B")
					         $("#sliderDirection").attr('data-direction','vertical');
					         pageSettingService.setPageSetting('vertical');
					         //$("#sliderDirection").attr('src','./images/slider-vertical.png');
        					 $("#sliderDirection i").removeClass('icon-resize-horizontal').addClass('icon-resize-vertical');
					         console.log(" BB")
					     }else if ($("#sliderDirection").attr('data-direction') == 'horizontal'){
					     	 console.log(" C")
					        $("#sliderDirection").attr('data-direction','horizontal')
					        pageSettingService.setPageSetting('horizontal');
					        //$("#sliderDirection").attr('src','./images/slider-horizontal.png');
					        $("#sliderDirection i").removeClass('icon-resize-vertical').addClass('icon-resize-horizontal');
					        console.log(" cC")
					     }else if ($("#sliderDirection").attr('data-direction') == 'vertical'){
					     	console.log("D")
					        $("#sliderDirection").attr('data-direction','vertical')
					        pageSettingService.setPageSetting('vertical')
					        //$("#sliderDirection").attr('src','./images/slider-vertical.png');
					        $("#sliderDirection i").removeClass('icon-resize-horizontal').addClass('icon-resize-vertical');
					        console.log("DD")
					     }
					     $("div.page:eq(0)").addClass('col-leftclick');
					},50)

					//console.log('loading project')


				/*$(document).on('click','.textElementActive',function(){
					$('.ui-selected').removeClass('ui-selected');
				    $('#text-properties').remove();
					$('.img-properties').remove();
				    

				    $('.mText').blur();
					$(this).addClass('ui-selected');				
					$('.ui-selected >.mText').focus();
					initSelectedAndDraggable();
					showTextEditPanel($mdToast,$document);
				console.log("@editText.js line 83 Dec UPDATE"+$(this).parent().attr('class'));	
				});*/

				/*$(document).on('click','.imageElement',function(e){
					e.stopPropagation();
	
					$('.ui-selected').removeClass('ui-selected');
					$('#text-properties').remove();
					$('.img-properties').remove();

					$("#right_1").addClass('isEdit');
					$('.mText').blur();
					$(this).addClass('ui-selected');
					initSelectedAndDraggable();
					showImageEditPanel($mdToast,$mdDialog,$document);	
				});*/




	           },function(){})
			}


			//创建新文本
			$scope.newText = function(){
                createNewText($mdToast,$document);
    			//$("#color-chooser-bg").next().find('.k-selected-color').css('box-shadow','none');
                refresh();
			};
		}
	}
})



//创建文本
function createNewText($mdToast,$document){
	$('.img-properties').remove();
	$('.ui-selected').addClass('ui-selectee');
	$('.ui-selected').removeClass('ui-selected');


	//var iText = $('<div class="ui-selected textElement textElementActive" data-type="text" style=" position:absolute;"><div  class="mText"  style="font-size:1.2em;min-width:100px;line-height:1.2em;opacity:1;border-radius:0px;font-family: Helvetica;" contenteditable="true">请输入文本</div></div>');
    var iText = $('<div class="ui-selected textElement textElementActive" data-type="text" style=" position:absolute;"><div  class="mText"  style="font-size:1.2em;min-width:100px;line-height:1.2em;opacity:1;border-radius:0px;font-family: Helvetica;" onKeyUp="refresh()" onkeypress="refresh()" onkeydown="refresh()" contenteditable="true" onclick="textActive(this)">请输入文本</div></div>');
    var currentPage = $('.isEdit');
    iText.appendTo(currentPage);
    showTextEditPanel($mdToast,$document);
    initSelectedAndDraggable();
    $('.ui-selected').removeClass('ui-selectee');
    refresh();
}



//显示文本编辑面板
function showTextEditPanel($mdToast,$document){

	$mdToast.show({
      controller: function($scope,$mdDialog){

        /*
        *@ var activeFontSize = ............
        *@ 设置属性面板中的各项默认值
        *@ 默认值通过 $('.ui-selected > .mText').data('xxxx')获取
        ********/
        var activeFontSize		= !$('.ui-selected > .mText').attr('data-fontsize')		? 14 :$('.ui-selected > .mText').attr('data-fontsize');
        var activelineHeight	= !$('.ui-selected > .mText').attr('data-lineheight')	? 1.2:$('.ui-selected > .mText').attr('data-lineheight');
        var activeBorderRadius  = !$('.ui-selected > .mText').attr('data-borderradius')	? 0  :$('.ui-selected > .mText').attr('data-borderradius');
        var activeOpacity       = !$('.ui-selected > .mText').attr('data-opacity')		? 1  :$('.ui-selected > .mText').attr('data-opacity');
		var activeAnimation      = (typeof($('.ui-selected').attr('swiper-animate-effect')) == 'undefined')?0:$('.ui-selected').attr('swiper-animate-effect')
        var activeDuration      = (typeof($('.ui-selected').attr('swiper-animate-duration')) == 'undefined')?0:$('.ui-selected').attr('swiper-animate-duration').replace('s','')
        var activeDelay         = (typeof($('.ui-selected').attr('swiper-animate-delay'))    == 'undefined')?0:$('.ui-selected').attr('swiper-animate-delay').replace('s','')
        var activeFamily        =  !$('.ui-selected > .mText').css('fontFamily') ? '': $('.ui-selected > .mText').css('fontFamily')
       
       setTimeout(function(){
	       	 if($('.ui-selected > .mText').attr('style').indexOf("text-align")<0){
	 			 $(".textAlign").removeClass('fontItemActive')
	 			 $(".textAligncenterId").addClass("fontItemActive");
			 }else{
				 $(".textAlign").removeClass('fontItemActive')
				 	var pos = $('.ui-selected > .mText').css('textAlign');
				 	$(".textAlign"+pos+"Id").addClass('fontItemActive')
			 }
			 if($('.ui-selected > .mText').css('font-weight')=="bold"){
				 $(".B-but").addClass("fontItemActive");
			 }else{
				 $(".B-but").remove("fontItemActive");
			 }
			 if($('.ui-selected > .mText').css('font-style')=="italic"){
				 $(".B-I").addClass("fontItemActive");
			 }else{
				 $(".B-I").remove("fontItemActive");
			 }
			 if($('.ui-selected > .mText').css('text-decoration')=="underline"){
				 $(".B-U").addClass("fontItemActive");
			 }else{
				 $(".B-U").remove("fontItemActive");
			 }
       },100)

        //初始化新建元素的属性值 显示
        $scope.radius 	  = {"size" : Number(activeBorderRadius)}
        $scope.opacity 	  = {"numberValue": Number(activeOpacity)}
        $scope.fontSize   = {"size" : Number(activeFontSize)}
        $scope.lineHeight = {"size" : Number(activelineHeight)}
		$scope.selectedAnimation = activeAnimation
        $scope.AnimateSpeed = {"size":Number(activeDuration)}
        $scope.AnimateDelay = {"size":Number(activeDelay)}
 		 $scope.selected          = activeFamily;
        

        // $scope.item.value   = "Helvetica";
      	//设置字体大小
      	$scope.getFontSize = function(){

			$('.ui-selected > .mText').css('fontSize',($scope.fontSize.size/10)+"em");
			//通过读取data-xxx 属性 设定创建元素时的默认值
			$('.ui-selected > .mText').attr('data-fontSize',$scope.fontSize.size);
			refresh();
		}



		//设置行高
      	$scope.getLineHeight = function(){

      		var lineHeightValue = $scope.lineHeight.size+"em";
			$('.ui-selected > .mText').css('lineHeight',lineHeightValue);
			//通过读取data-xxx 属性 设定创建元素时的默认值
			$('.ui-selected > .mText').attr('data-lineHeight',$scope.lineHeight.size);
			refresh();
		}

		//设置字体
		$scope.fontFamily = [{"name":"Helvetica","value":"Helvetica"},{"name":"Arial","value":"Arial"},{"name":"Verdana","value":"Verdana"},{"name":"Tahoma","value":"Tahoma"},{"name":"Georgia","value":"Georgia"},{"name":"sans-serif","value":"sans-serif"},{"name":"monospace","value":"monospace"},{"name":"fantasy","value":"fantasy"},{"name":"cuisive","value":"cuisive"},{"name":"Helvetica, sans-serif","value":"Helvetica, sans-serif"},{"name":"Arial, sans-serif","value":"Arial, sans-serif"},{"name":"Lucida Grande', sans-serif","value":"Lucida Grande', sans-serif"},{"name":"Verdana,sans-serif","value":"Verdana,sans-serif"},{"name":" Tahoma, sans-serif","value":" Tahoma, sans-serif"},{"name":"'Trebuchet MS', sans-serif","value":"'Trebuchet MS', sans-serif"},{"name":"Georgia, serif","value":"Georgia, serif"},{"name":"Times, serif","value":"Times, serif"}];
		$scope.setFontFamily = function(){
			$('.ui-selected > .mText').css('fontFamily','"'+$scope.selected+'"');
			refresh();
		}

		//设置字体颜色
		$scope.$watch("setFontColor",function(newColor,oldColor){
			$('.ui-selected > .mText').css('color',newColor);
		});

		//设置加粗
		$scope.setFontBold = function(){
			if($('.ui-selected  > .mText').css("fontWeight") != "bold"){
				$('.ui-selected > .mText').css("fontWeight","bold");
				// $("#fontBlodId").addClass("fontItemActive");
				$(".B-but").addClass("fontItemActive");
			}else if($('.ui-selected > .mText').css("fontWeight") == "bold"){

				$('.ui-selected > .mText').css("fontWeight","");
				// $("#fontBlodId").removeClass("fontItemActive");
				$(".B-but").removeClass("fontItemActive");
			}
			refresh();
		};

		//设置斜体
		$scope.setFontItalic = function(){
			if($('.ui-selected  > .mText').css("fontStyle") != "italic"){
				$('.ui-selected > .mText').css("fontStyle","italic");
						// $("#fontItalicId").addClass("fontItemActive");
					$(".B-I").addClass("fontItemActive");
			}else if($('.ui-selected > .mText').css("fontStyle") == "italic"){

					 $('.ui-selected > .mText').css("fontStyle","");
						// $("#fontItalicId").removeClass("fontItemActive");
						$(".B-I").removeClass("fontItemActive");
			}
			refresh();
		}

		//设置下划线
		$scope.setTextDecoration = function(){
			if($('.ui-selected  > .mText').css("textDecoration") != "underline"){

				$('.ui-selected > .mText').css("textDecoration","underline");
					// $("#textDecorationId").addClass("fontItemActive");
				$(".B-U").addClass("fontItemActive");

			}else if($('.ui-selected > .mText').css("textDecoration") == "underline"){

				$('.ui-selected > .mText').css("textDecoration","");
					// $("#textDecorationId").removeClass("fontItemActive");
				$(".B-U").removeClass("fontItemActive");
			}
			refresh();
			
		}

		//设置元素对齐
		$scope.setTextAlign = function(textPos){
			$(".textAlign").removeClass('fontItemActive');
			refresh();
			
			setTimeout(function(){
				$('.ui-selected > .mText').css("textAlign",textPos);
				$(".textAlign"+textPos+"Id").addClass("fontItemActive");
				refresh();
			},100)
		}

		//设置圆角
		$scope.getRadiusSize = function(){
			$('.ui-selected').css("borderRadius",$scope.radius.size+"px");

			//通过读取data-xxx 属性 设定创建元素时的默认值
			$('.ui-selected > .mText').attr('data-borderradius',$scope.radius.size);
			refresh();
		}

		//设置文本背景
		$scope.$watch("setFontBackgroundColor",function(newValue,oldValue){
			$('.ui-selected').css("backgroundColor",newValue);
		});

		//设置透明度
		$scope.getFontOpacity  = function(){
			$('.ui-selected > .mText').css("opacity",$scope.opacity.numberValue);

			//通过读取data-xxx 属性 设定创建元素时的默认值
			$('.ui-selected > .mText').attr('data-opacity',$scope.opacity.numberValue);
			refresh();
		};


		//监听文本链接是否有变化，有变化更新之
		$scope.$watch("setFontLink",function(newValue,oldValue){
			$('.ui-selected > .mText').attr("data-link",newValue);
		})


		//选择动画效果
		$scope.textAnimate = function(){
			testAnimation($scope.selectedAnimation);
    		function testAnimation(x){

		    	$('.ui-selected').attr('swiper-animate-effect',x);
				var speed = $('.ui-selected').attr('swiper-animate-duration');
				var delay = $('.ui-selected').attr('swiper-animate-delay');

				//添加属性用于元素点击时属性回显
				$('.ui-selected').attr('data-duration',speed);
				$('.ui-selected').attr('data-delay',delay);

				/*
				*@ $('.ui-selected').removeClass() ..........
				*@ 这段代码满足两种情况
				*@ a.用户先选择延时及时长后，再切换画效果的情况下，选中的动画效果会基于已设定的参数运行
				*@ b.用户未选择延时及时长后，选中的动画效果会运行
					***********/
			    $('.ui-selected').removeClass()
			    				 .addClass(x + ' animated ui-selected ui-draggable ui-resizable textElement textElementActive')
			    				 .css({"animation-name":x,"animation-duration":speed,"animation-delay":delay})
			    				 .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
			    });
			}
		}


		//设置动画延时 / 时长
      	$scope.getAnimateSpeed = function(){
      		    /*
                *@ var animate = = "bounceInLeft"
                *@ 当用户未选择动画效果时，选择延时或时长，元素会根据默认动画效果执行
                */
				var aniname = "bounceInLeft";
				var speed = "1s";
				var delay = "0s";


				if($scope.AnimateSpeed){
					speed = $scope.AnimateSpeed.size + "s";
				}
				if($scope.AnimateDelay){
					delay = $scope.AnimateDelay.size + "s";
				}
				if($scope.selectedAnimation){
					aniname = $scope.selectedAnimation +"";
				}

				$('.ui-selected').css({"animation-name":"name","animation-duration":"s","animation-delay":"s"});

				function test(){
					$('.ui-selected').css({"animation-name":aniname,"animation-duration":speed,"animation-delay":delay}).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
					 	//$('.ui-selected').css("opacity",1);
					});

					$('.ui-selected').attr('swiper-animate-duration',speed);
					$('.ui-selected').attr('swiper-animate-delay',delay);
				}
				setTimeout(test,100);
		}


		//添加文本链接
		$scope.setTextLink = function(){
			$("#popupContainer").addClass('filter');
			$mdDialog.show({
				controller:function($scope){
				  $scope.textlink="";
				  $scope.textlink = $('.ui-selected').attr('data-link');

				  $scope.linkClose = function(){
	    			 $mdDialog.hide();
               		 setTimeout(function(){$("#popupContainer").removeClass('filter');},250)
	    		  }

				  $scope.saveLink = function(){
				    $scope.loadingAdd = true;
				 	var linkText = $.trim($scope.textlink);
				  	if(linkText==""){
				  	   $(".ui-selected").removeAttr('onclick');
				  	}else{
				  	   $(".ui-selected").attr("onclick","window.open('"+$scope.textlink+"','target','param')");
				  	}

				   $scope.loadingAdd = false;
				   $mdDialog.hide();
               		setTimeout(function(){$("#popupContainer").removeClass('filter');},250)

				   	$("#addBox").show();
				   	$('.ui-selected').attr('data-link',$scope.textlink);
					setTimeout(function(){$("#addBox").fadeTo(3000).hide();	},1000);
				  }
				},
				templateUrl:'./template/page.addLink.tmpl.html',
				// locals:{
				// 	    items:$('.ui-selected').data('link')
				// },
				parent:$("#main"),
				hideDelay:false
			});
		}
	},
      templateUrl: './template/fontPropertyPanel_text.html',
      parent :$('#editModulePosition'),
      hideDelay: false
      // position: $scope.getToastPosition()
    });
}//end of showTextEditPanel function






function textActive(curText){
	$('.ui-selected').addClass('ui-selectee').removeClass('ui-selected');
	refresh();
	setTimeout(function(){
                $('.ui-selected').removeClass('ui-selectee');
                  },100);

	// console.log($('.ui-draggable').removeClass('ui-draggable'))	
	// initSelectedAndDraggable();
    /*
    * Demo
    * $(curText).attr("style").indexOf("font-size")
    * 判断当前点击元素是否存在内联样式属性:font-size，存在返回0
    */
  	var fontSize =	$(curText).attr("style").indexOf("font-size");

 	if(fontSize>-1) {

 	/**
    * $(curText).attr("data-fontsize");
    * -如果用户对文本字体大小进行设置，会添加data-fontsize属性，具体方法在 $scope.getFontSize = function(){....} 中实现
    * -通过获取元素上的data-fontsize属性里的值来实现属性值回显
    *
    */
		var numFontSize = $(curText).attr("data-fontsize");

		console.log(numFontSize+"////numFontSize")
	    var fontS       = numFontSize == undefined?14:numFontSize;
 		setValue('#txtNumid',fontS)
 		
 	}else{
 	/*
 	* 设置默认属性值
 	*/
 		$('#txtNumid').html("14")
 	}





	var lineheight = $(curText).attr("style").indexOf("line-height");
	if(lineheight>-1) {
 	 	var numLineHeight  = $(curText).attr("data-lineheight");
 	 	var numLineHeightR = numLineHeight == undefined?1.2:numLineHeight;
 		setValue('#txtHeightid',numLineHeightR)
 	} else{$('#txtHeightid').val("0")}


 	var vopacity  = $(curText).attr("style").indexOf("opacity")
	if(vopacity>-1) {
 	 	var num   = $(curText).attr("data-opacity");
 	 	var numP  =  num == undefined ? 1 : num;
 		setValue('#txtOpacityid',numP)
 	} else{$('#txtOpacityid').val("1");}
 	//border-radius

	var borderradius =$(curText).parent().attr("style").indexOf("border-radius")
 	if(borderradius>-1) {
	 	var num   = $(curText).attr("data-borderradius");
	 	var numB  = num == undefined ? 0 : num;
	 	setValue('#txtRadiusid',numB)
 	}else{$('#txtRadiusid').val("0");}

 	var fontFamily= $(curText).attr("style").indexOf("font-family")
 	if(fontFamily>-1) {
 		setTimeout(function(){
 			var lista = $(curText).css("fontFamily");
	 	 	$("#fontFamilyid option").each(function(){
			    if( $(this).val() == lista ){
			      this.selected = true;
			      return false;
			    }
			});
 		},100)
 	}else{$('#fontFamilyid').val("")}


 	var fontBlod = $(curText).attr("style").indexOf("font-weight")
 	if(fontBlod>-1) {

 		setTimeout(function(){
 			$("#fontBlodId").addClass('fontItemActive')
 		},100)

 	}else{$("#fontBlodId").removeClass('fontItemActive')}


 	var textDecorationId =$(curText).attr("style").indexOf("text-decoration")
 	if(textDecorationId>-1) {
   		setTimeout(function(){
 			$("#textDecorationId").addClass('fontItemActive')
 		},100)
 	}else{$("#textDecorationId").removeClass('fontItemActive')}



 	var fontItalicId = $(curText).attr("style").indexOf("font-style")
 	if(fontItalicId>-1) {
 		setTimeout(function(){
 			$("#fontItalicId").addClass('fontItemActive')
 		},100)
 	}else{$("#fontItalicId").removeClass('fontItemActive')}


 	// var fontAlign   = $(curText).attr("style").indexOf("text-align")
 	// if(fontAlign>-1) {
 	// 	setTimeout(function(){
	 // 		$(".textAlign").removeClass('fontItemActive')
	 // 	    var pos = $(curText).css('textAlign');
	 // 		$(".textAlign"+pos+"Id").addClass('fontItemActive')
 	// 	},200)

 	// }else{
 	// 	$(".textAligncenterId").addClass('fontItemActive')
 	// }


 	var animateId  = $(curText).parent().attr('style').indexOf('animation-name');
 	if(animateId>-1) {
 		setTimeout(function(){
	 		var animateName = $(curText).parent().css("animationName");
	 	 	$("#animateTextId option").each(function(){
			    if( $(this).val() == animateName ){
			      this.selected = true;
			      return false;
			    }
			});

 		},100)
 	}else{$('#animateTextId').val("0")}




 	var animationDurationId 	 =	$(curText).parent().attr("style").indexOf("animation-duration");
 	if(animationDurationId>-1) {
 	 	var animationDurationNum = $(curText).parent().attr('swiper-animate-duration')
 	 	var newDuration 		 = animationDurationNum.replace('s','')
 		setValue('#animationDurationId',newDuration)
 	}else{$('#animationDurationId').val("0") }



 	var animationDelayId	    = $(curText).parent().attr("style").indexOf("animation-delay");
 	if(animationDelayId>-1) {
 	 	var animationDelayNum   = $(curText).parent().attr('swiper-animate-delay');
 	 	var newDelay 			= animationDelayNum.replace('s','')
 		setValue('#animationDelayId',newDelay)
 	}else{$('#animationDelayId').val("0") }
}


function setValue(elementId,value){
	var ele    = elementId;
	var eleVal = value;
	// console.log('font value:'+value)
	setTimeout(function(){
		$(ele).val(eleVal)
	},100);
}

/*
*Description:
*****/

function initSelectedAndDraggable(){

$( ".isEdit > div" ).draggable({
    start: function(ev, ui) {
    	ev.stopPropagation();
     	var l = ( 100 * parseFloat($(this).css("left")) / parseFloat($(this).parent().css("width")) )+ "%" ;
	 	var t = ( 100 * parseFloat($(this).css("top")) / parseFloat($(this).parent().css("height")) )+ "%" ;
			     $(this).css("left" , l);
			     $(this).css("top" , t);
			     //refresh();
    },
    drag: function(ev, ui) {
    	ev.stopPropagation();
     var l = ( 100 * parseFloat($(this).css("left")) / parseFloat($(this).parent().css("width")) )+ "%" ;
			     var t = ( 100 * parseFloat($(this).css("top")) / parseFloat($(this).parent().css("height")) )+ "%" ;
			     $(this).css("left" , l);
			     $(this).css("top" , t);
			     //refresh();
    },
    stop: function(ev, ui) {
    	ev.stopPropagation();
     var l = ( 100 * parseFloat($(this).css("left")) / parseFloat($(this).parent().css("width")) )+ "%" ;
			     var t = ( 100 * parseFloat($(this).css("top")) / parseFloat($(this).parent().css("height")) )+ "%" ;
			     $(this).css("left" , l);
			     $(this).css("top" , t);
			     refresh();
    }
}).resizable({ handles: 'se,sw,ne,nw',
		stop:function (event, ui){
                 event.stopPropagation();
	    		 var l = ( 100 * parseFloat($(this).css("left")) / parseFloat($(this).parent().css("width")) )+ "%" ;
			     var t = ( 100 * parseFloat($(this).css("top")) / parseFloat($(this).parent().css("height")) )+ "%" ;
			     $(this).css("left" , l);
			     $(this).css("top" , t);
			     //console.log(this)
			     refresh();

                        
	
			     var w = ( 100 * parseFloat($(this).css("width")) / parseFloat($(this).parent().css("width")) )+ "%" ;
			     var h = ( 100 * parseFloat($(this).css("height")) / parseFloat($(this).parent().css("height")) )+ "%" ;
			     
			     console.log('width:'+w+"-height:"+h);

			     $(this).css("width" , w);
			     $(this).css("height" ,'auto');
			     refresh();
			}
});

//修复textelement 高度issue
$('.textElement .ui-resizable-handle').css('display','');
$( ".isEdit " ).selectable();



// // manually trigger the "select" of clicked elements
// $( ".isEdit > div.imageElement" ).click( function(e){
// 	$('.ui-selected').removeClass('ui-selected');
// 	$(this).addClass('ui-selected')

// });


	 $('.isEdit').droppable(

			{
				containment:".mainbox",
				drop: function (event, ui) {
					// debugger;
					event.stopPropagation();
					refresh();
					console.log(' draggable works')

			        var pos = ui.draggable.offset();
			        var dPos = $(this).offset();
                    // console.log('work');
			        // Pixxel value of positions
			        var elementTopPosition = pos.top - dPos.top;
			        var elementLeftPosition = pos.left - dPos.left;

			        // Getting parent element height and width
			        var parentWidth = jQuery(".isEdit").outerWidth();   // <=== Here
			        var ParentHeight = jQuery(".isEdit").outerHeight(); // <===

			        // Coverting to percentage
			        var topInPercentage = (100 * elementTopPosition) / ParentHeight;
			        var leftInPercentage = (100 * elementLeftPosition) / parentWidth;
			        $(ui).css({top: topInPercentage + '%', left: leftInPercentage + '%'});

			    }
			}


		)



}
