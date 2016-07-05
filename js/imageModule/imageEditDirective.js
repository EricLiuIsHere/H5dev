'use strict'
/*
*@ imageEditDirective.js 负责处理图片操作
-----------------------------------------------------------------------------------------------
*@ imageEditDirective模块，实现了上传图片，插入图片，删除图片，编辑图片属性以及点击图片的同时显示文本编辑面板
-----------------------------------------------------------------------------------------------
*@ 上传图片				     ：showAddImageoverLay(){ $scope.uploadImage   = function(){...} }
*@ 插入图片                  ：showAddImageOverLay(){ $scope.imageSelected = function(target){....}}
*@ 删除图片                  ：showAddImageoverLay(){ $scope.removeImage   = function(){....} }
*@ 点击图片属性回显			 : imageActive()
*@ 图片属性面板              : showImageEditPanel()
*@ 对图片拖拽，改变尺寸      ：initSelectedAndDraggable()   @editText.js
**/

var imageEditDirective = angular.module('imageEditDirective',[]);


imageEditDirective.directive('editimage',function(
	$sce,     			/*把从db读取到的html字符串解析成html，渲染到dom中*/
	$mdToast, 			/*mdToast 负责问题面板显示 以及图片面板显示*/
	$compile, 			/*解析动态加入dom中的html*/
	$mdDialog,			/*mdDialog 负责 全局 overlay 方法*/
	$document,
	$rootScope,
	projectFn,			/*提供关于project与后台交互的方法集 projectSerivce.js*/
	AuthService,		/*提供用户登录状态方法*/
	SERVER_URL,			/*定义全局常量*/
	loginFn,   			/*提供登录，退出，刷新页面保证用户登录状态方法  loginService.js*/
	imageActionService  /* 提供上传，删除图片方法集  imageDirective.js*/
){

	return{
		restrict:'AE',
		scope:{},
		templateUrl:'./template/edit.image.tmpl.html',
		link:function($scope){

			/*
			*@ 监听全局点击图片事件，点击同时显示图片编辑面板
			*
			****/
		$(document).undelegate('.imageElementAcitve', 'click').delegate('.imageElementAcitve','click',function(e){
				e.stopPropagation();
				$('.ui-selected').removeClass('ui-selected');
				$('#text-properties').remove();
				$('.img-properties').remove();


                console.log('image works')
				$('.mText').blur();
				$(this).addClass('ui-selected');
				initSelectedAndDraggable();
				showImageEditPanel($mdToast,$mdDialog,$document);	

			})

			//创建新图片
			$scope.newImages = function(){
				$('.ui-selected').removeClass('ui-selected');

				 //判断用户是否登陆，只有在登陆状态才可上传图片
				 if(loginFn.islogged().status){

				 	//如果用户登录，显示上传图片对话框
	 				var newImage = true;

				 	showAddImageOverLay($mdToast,$mdDialog,$document,newImage)
				 }else{

				 	//如果用户未登陆，显示登录对话框
		            $("#popupContainer").addClass('filter');
		            $mdDialog.show({
		                controller: function($scope,$rootScope){
		                    $scope.loginClose = function(){
		                        $mdDialog.hide();
		                        setTimeout(function(){
		                            $("#popupContainer").removeClass('filter');
		                        },250)
		                    }// end $scope.loginClose

		                    $scope.loginBtn = function(){
		                        $scope.loadingLogin = true;
		                        $scope.credentials = { "username":$scope.user.firstName,"password":$scope.user.passWord};
		                        loginFn.login($scope.credentials).then(function(data){

			                        if(data.status){
		                                $rootScope.currentUser  = $rootScope.getCurrentUser();
		                                $rootScope.isAuthorized = loginFn.islogged().status;

		                                //显示添加图片overlay
	                               		var newImage = true;
			 							showAddImageOverLay($mdToast,$mdDialog,$document,newImage)
									}else{
		                            	$scope.loadingLogin = false;
		                      			$scope.userError = true;
		                            }
			                    });//end loginFn.login(....)
	                        }// end $scop.loginBtn
		                },
		                templateUrl:'./template/user.login.tmpl.html',
		                parent : $("#main"),
		                hideDelay: false
              		});// end $mdDialog.show(....);
				}

			};// end $scope.newImages


		} // end link:function(){.....}
	}
}); // end imageEditDirective.directive







/*
* @showImageEditPanel
* @ 用户点击图片显示图片编辑面板
*
*
********/
function showImageEditPanel($mdToast,$mdDialog,$document){
	$mdToast.show({
     	controller: function($scope){

     	   //设置默认值
     	   // console.log($('.ui-selected').data('opacity')+"...$('.ui-selected').data('opacity')")
     	  
     	  //  var activeRaius    = !$('.ui-selected').data('radius') ? 0:$('.ui-selected').data('radius') ;
     	  //  var activeDelay    = typeof($('.ui-selected').attr('swiper-animate-delay')    == undefined)?0:$('.ui-selected').attr('swiper-animate-delay').replace('s','')
     	  //  var activeOpacity  = !$('.ui-selected').data('opacity')? 1:$('.ui-selected').data('opacity') ;
     	  //  var activeDuration = typeof($('.ui-selected').attr('swiper-animate-duration') == undefined)?0:$('.ui-selected').attr('swiper-animate-duration').replace('s','')
           
 
        //    $scope.AnimateSpeed = {"size":activeDuration}
        //    $scope.AnimateDelay = {"size":activeDelay}
	       // $scope.imageRadius  = {"size":activeRaius};
	       // $scope.selected     = $(".ui-selected").data('animate');
        //    $scope.opacity      = {"numberValue":activeOpacity};



     	  //  var activeRaius    = !$('.ui-selected').data('radius') ? 0:$('.ui-selected').data('radius') ;
     	  //  var activeDelay    = typeof($('.ui-selected').attr('swiper-animate-delay')    == undefined)?0:$('.ui-selected').attr('swiper-animate-delay').replace('s','')
     	  //  var activeOpacity  = !$('.ui-selected').data('opacity')? 1:$('.ui-selected').data('opacity') ;
     	  //  var activeDuration = typeof($('.ui-selected').attr('swiper-animate-duration') == undefined)?0:$('.ui-selected').attr('swiper-animate-duration').replace('s','')
           
 
        //    $scope.AnimateSpeed = {"size":activeDuration};
        //    $scope.AnimateDelay = {"size":activeDelay};
	       // $scope.imageRadius  = {"size":activeRaius};
	       // $scope.selected     = $(".ui-selected").data('animate');
        //    $scope.opacity      = {"numberValue":activeOpacity};


         	  var activeRaius    = !$('.ui-selected .imageContainer .mImage').attr('data-radius') ? 0:$('.ui-selected .imageContainer .mImage').attr('data-radius') ;
  			  var activeDelay    = (typeof($('.ui-selected').attr('swiper-animate-delay'))  == 'undefined')?0:$('.ui-selected').attr('swiper-animate-delay').replace('s','');
  			  var activeOpacity  = !$('.ui-selected .imageContainer .mImage').attr('data-opacity')? 1:$('.ui-selected .imageContainer .mImage').attr('data-opacity') ;
  			  var activeDuration = (typeof($('.ui-selected').attr('swiper-animate-duration')) == 'undefined')?0:$('.ui-selected').attr('swiper-animate-duration').replace('s','')
 
  		      $scope.AnimateSpeed = {"size":Number(activeDuration)}
  			  $scope.AnimateDelay = {"size":Number(activeDelay)};
  			  $scope.imageRadius  = {"size":Number(activeRaius)};
  			  $scope.selected     = $('.ui-selected').attr('swiper-animate-effect');
  			  $scope.opacity      = {"numberValue":Number(activeOpacity)};

           //设置动画透明度
		    $scope.getImageOpacity   = function(){
	   	      //  console.log('$scope.opacity.numberValue'+$scope.opacity.numberValue)
				$('.ui-selected .imageContainer .mImage').css('opacity',$scope.opacity.numberValue);
				$('.ui-selected .imageContainer .mImage').attr('data-opacity',$scope.opacity.numberValue);
				refresh();
			}

			//选择动画效果
			$scope.imageAnimate 	= function(){

		    	imageAnimation($scope.selected);
	    		function imageAnimation(x){

	    			$('.ui-selected').attr('swiper-animate-effect',x);
					var speed = $('.ui-selected').attr('swiper-animate-duration');
					var delay = $('.ui-selected').attr('swiper-animate-delay');

					/*
					*@ $('.ui-selected').removeClass() ..........
					*@ 这段代码满足两种情况
					*@ a.用户先选择延时及时长后，再切换画效果的情况下，选中的动画效果会基于已设定的参数运行
					*@ b.用户未选择延时及时长后，选中的动画效果会运行
 					***********/
				    $('.ui-selected').removeClass()
				    				 .addClass(x + ' animated ui-selected ui-draggable ui-resizable imageElement imageElementAcitve')
				    				 .css({"animation-name":x,"animation-duration":speed,"animation-delay":delay})
				    				 .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){

				    });

				}
		    }

		   //设置图片圆角
		   $scope.setImageRadiusSize = function(){

				$('.ui-selected .imageContainer .mImage').attr('data-radius',$scope.imageRadius.size);
				$(".ui-selected .imageContainer .mImage").css("borderRadius",$scope.imageRadius.size+"px");
				setTimeout(function(){
                    refresh();
                  },10);
		    }




		   //设置动画延时 / 时长
	       $scope.getImageAnimateSpeed = function(){
                /*
                *@ var animate = = "bounceInLeft"
                *@ 当用户未选择动画效果的情况下，选择延时或时长，元素会根据默认动画效果执行
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
				if($scope.selected){
					aniname = $scope.selected +"";
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

		   $scope.setImageLink = function(){
				$("#popupContainer").addClass('filter');
    			$mdDialog.show({
    				controller:function($scope){
    				  //再次点击添加链接,显示之前的value
    				  $scope.textlink="";

				      $scope.textlink = $('.ui-selected').attr('data-link');
				      // console.log('update link twice:'+$('.ui-selected').attr('data-link'))
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
    				parent:$("#main"),
    				hideDelay:false
    			});
    	   }
		},
        templateUrl: './template/imagePropertyPanel.html',
        parent : $document[0].querySelector('#editModulePosition'),
        hideDelay: false
	});
}


/*
* @ showAddImageOverlay
* @ 用户创建新图片触发此方法
*
*****/
function showAddImageOverLay($mdToast,$mdDialog,$document,newImage){
	$("#popupContainer").addClass('filter');

 	$mdDialog.show({
		controller: function($scope,$compile,getImageList,imageActionService,loginFn){
  	       // getImageList 从app.js 传入 用来获取已上传数据，并渲染到添加图片页面
  		   $scope.imageList = getImageList.data;

  		   $scope.userName  = loginFn.islogged().email;

  		  // console.log('userName:'+$scope.userName)

	       $scope.imageOverlayClose = function(){
		   		$mdDialog.hide();
       			setTimeout(function(){$("#popupContainer").removeClass('filter');},250)
	       }


	       //从已上传列表中，选择图片
		   $scope.imageSelected = function(target){
		   	//console.log(target);
		   	if(target){
		   		target = target.split("h5dev")[1];
		   	}
			    $compile(
			    	     $('<div class="ui-selected imageElement imageElementAcitve" style="position:absolute;" data-type="image"> '+
			    				'<div class="imageContainer" style="overflow:hidden;">'+
			    					'<img src=".'+target+'" class="mImage" style="border-radius:0px;opacity:1;width:100%;height:100%;" onclick="imageActive(this)"/>'+
			    				'<div>'+
			    			'</div>').appendTo($('.isEdit')
			    		  )
			    		)($scope);


			    showImageEditPanel($mdToast,$mdDialog,$document);
			    initSelectedAndDraggable();
			    //图片转为base64并加载到页面 START
			 //    function convertImgToBase64(url, callback, outputFormat){
				//     var canvas = document.createElement('CANVAS'),
				//         ctx = canvas.getContext('2d'),
				//         img = new Image;
				//     img.crossOrigin = 'Anonymous';
				//     img.onload = function(){
				//         canvas.height = img.height;
				//         canvas.width = img.width;
				//         ctx.drawImage(img,0,0);
				//         var dataURL = canvas.toDataURL(outputFormat || 'image/png');
				//         callback.call(this, dataURL);
				//         canvas = null; 
				//     };
				//     img.src = url;
				// }
				// var newimageURL = $("#pagesList .isEdit .ui-selected img").attr('src');

				// convertImgToBase64(newimageURL, function(base64Img){
				// 	$("#pagesList .isEdit .ui-selected img").attr('src', base64Img);
				// });
				//图片转为base64并加载到页面 END
				$mdDialog.hide();
	       		setTimeout(function(){$("#popupContainer").removeClass('filter');refresh()},500)

		   }

            //上传图片
		    $scope.uploadImage = function(element){
	
		    	 $scope.$apply(function(scope) {
			         var photofile = element.files[0];
			         var reader = new FileReader();
			         imageActionService.addImage(photofile,$scope);
                     
                     //read.onload 没有用？你试试看
			         reader.onload = function(e) {
			           $scope.prev_img = e.target.result;
			         
			           imageActionService.addImage(photofile,$scope);
			         };

			     });
		    }


		    //删除已上传图片
		    $scope.removeImage = function(imageId){

		    	if(confirm("确定删除吗")){
			      	imageActionService.removeImage(imageId);
			      	$("#"+imageId).remove();
			      	 return true;
			      }
			      else{
			      	  return false;
		     	 }
		    }

		},
	    resolve:{
		      	getImageList :function(imageActionService){   return imageActionService.loadImage();}
		},
		templateUrl: './template/addImage.tmpl.html',
	    parent: $('#main')
	});
}



/*
*@ imageActive
*@ 用户点击图片触发，回显属性值到编辑面板
*
********/
function imageActive(curImage){



	var imageRadius = $(curImage).attr("style").indexOf("border-radius")
	console.log('imageRadius:'+imageRadius)
	if(imageRadius>-1) {
		var radiusSize  = $(curImage).attr('data-radius');
		var radiusSizeR =  radiusSize == undefined ? 0 :radiusSize;
		setImageValue('#imageRadiusid',radiusSizeR)
	}else{$('#imageRadiusid').val("0")}


	var vopacity =$(curImage).attr("style").indexOf("opacity")
	 	if(vopacity>-1) {
 	 	var num  = $(curImage).attr('data-opacity');
 	 	var numR = num == undefined ? 1 :num;
 		setImageValue('#imageOpacityid',numR)
	} else{$('#imageOpacityid').val("1")}




 	var animateId = $(curImage).parent().parent().attr('style').indexOf('animation-name');
 	// console.log('animateId:'+animateId)
 	if(animateId>-1) {
 		setTimeout(function(){
	 		var animateName = $(curImage).parent().parent().css("animationName");
	 		//console.log('animateName:'+animateName)
	 	 	$("#js--imageAnimations option").each(function(){
			    if( $(this).val() == animateName ){
			      this.selected = true;
			      return false;
			    }
			});

 		},100)
 	}else{$('#js--imageAnimations').val("")}



 	var animationDurationId =	$(curImage).parent().parent().attr("style").indexOf("animation-duration");
 	if(animationDurationId>-1) {
 	 	var animationDurationNum = $(curImage).parent().parent().attr('swiper-animate-duration')
 	 	var newDuration 		 = animationDurationNum.replace('s','')
 	 //	console.log(newDuration+":animationImageDelayId")
 		setImageValue('#animationImageDurationId',newDuration)
 	}else{
 		setImageValue('#animationImageDurationId',0)
 	 }



 	var animationDelayId = $(curImage).parent().parent().attr("style").indexOf("animation-delay");
 	if(animationDelayId>-1) {
 	 	var animationDelayNum = $(curImage).parent().parent().attr('swiper-animate-delay');
 	 	var newDelay 	      = animationDelayNum.replace('s','')
 	 //	console.log(newDelay+":animationDelayNum")
 		setImageValue('#animationImageDelayId',newDelay)
 	}else{
 		setImageValue('#animationImageDelayId',0)
 	}

}

function setImageValue(elementId,value){
		setTimeout(function(){
			$(elementId).html(value)
			console.log(elementId+":"+value);
		},100);
}
