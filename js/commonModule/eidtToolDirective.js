 'use strict';
/*
*@ eidtToolDirective.js 负责对文本/图片的 保存、预览、删除操作。
-----------------------------------------------------------------------------------------------
*@ eidtToolDirective 模块实现了对文本及图片的保存、预览、删除操作。属于common module
-----------------------------------------------------------------------------------------------
*@ 保存                      ：$scope.savePage      = function(){....}
*@ 预览                      : $scope.previewPage() = function(){....}
*@ 删除                      ：$scope.remove()      = function(){....}
*@ 显示userGuide             : $scope.userGuide     = function(){}
**/
var eidtToolDirective = angular.module('eidtToolDirective', []);

eidtToolDirective.directive('toolbar1', function(
  $mdDialog,//提供对话框的模块                  @angular-material.js
  $mdToast, //提供文本/图片编辑面板             @angular-material.js
  $document, //angularjs 内部服务
  $rootScope,//angularjs 内部服务
  projectFn, //提供对项目操作的restful接口      @projectService.js
  loginFn,    //管理用户登录状态的restful接口   @loginService.js
pageSettingService //提供页面设置属性接口     @pageSettingService.js
  ) {

  return {
    restrict: "AE",
    scope: {},
    templateUrl: "./template/toolBar.html",
    link: function($scope, $rootScope) {
      $scope.remove = function() {
        $(".ui-selected").remove();
      }

/////////////////// 用户第一次登陆 显示userguide ///////////////

   function setCookie(name,value){
      var Days = 30;
      var exp = new Date();
      exp.setTime(exp.getTime() + Days*24*60*60*1000);
      document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
    }

    function getCookie(name){
      var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
      if(arr=document.cookie.match(reg)){
        return unescape(arr[2]);
      }else{
        return null;
      }
     
    }
    var cookie = getCookie('userGuide');

    if(!cookie){
       $mdDialog.show({
          controller: function($scope) {
              $("#popupContainer").addClass('filter');
              $scope.close = function(){
                  $mdDialog.hide();
                  setTimeout(function(){$("#popupContainer").removeClass('filter');},250)
              }         

              setCookie('userGuide','true');          
          },
          templateUrl: './template/guide.tmpl.html',
          parent:$("#main"),
          hideDelay: false
        });
    }


    $scope.userGuide = function() {      
       $mdDialog.show({
          controller: function($scope) {
              $("#popupContainer").addClass('filter');
              $scope.close = function(){
                  $mdDialog.hide();
                  setTimeout(function(){$("#popupContainer").removeClass('filter');},250)
              }                   
          },
          templateUrl: './template/guide.tmpl.html',
          parent:$("#main"),
          hideDelay: false
        });         
    }

    $scope.userSlider = function(){
     if($("#sliderDirection").attr('data-direction') == ''){
      console.log("      ")
         $("#sliderDirection").attr('data-direction','vertical');
         pageSettingService.setPageSetting('vertical');
         
         $("#sliderDirection").attr('src','./images/slider-vertical.png');

     }else if ($("#sliderDirection").attr('data-direction') == 'horizontal'){
       console.log("   horizontal   ")
        $("#sliderDirection").attr('data-direction','vertical')
        pageSettingService.setPageSetting('vertical')
        $("#sliderDirection").attr('src','./images/slider-vertical.png');
     }else if ($("#sliderDirection").attr('data-direction') == 'vertical'){
       console.log("  vertical    ")
        $("#sliderDirection").attr('data-direction','horizontal')
        pageSettingService.setPageSetting('horizontal')
        $("#sliderDirection").attr('src','./images/slider-horizontal.png');
     }

    }
    
    $scope.previewPage = function() {
      
       $("#popupContainer").addClass('filter');
       $mdDialog.show({
          controller: function($scope, $compile, $sce,pageSettingService) {
            $compile($("#previewContent").attr('ng-bind-html', 'page.preivewCode'))($scope)
            $scope.page = {
              "preivewCode": ""
            };
            
           var direction = pageSettingService.getPageSetting();
           console.log(direction+"///direction")
           var previewOnce = $("#pagesList").html();
           var strHtml = previewOnce.replace(/display/g, " ")
                          .replace(/isEdit/g, " ")
                          .replace(/icon-undo/g, " ")
                          .replace(/ui-selectable/g,'')
                          .replace(/ui-draggable/g,'')
                          .replace(/ui-selectee/g,'')
                          .replace(/ui-selected/g,'')
                          .replace(/right_/g,'')
                          .replace(/display: flex;/g,' ')
                          .replace(/onclick="imageActive(this)"/g,'')
                          .replace(/contenteditable="true"/g,' ')
                          .replace(/onclick="textActive(this)"/g,'')
                          .replace(/textElementActive/g,' ')
                          .replace(/imageElementAcitve/g,'')
                          .replace(/class="[^\"]*(animated)[^\"]*(textElement)[^\"]*"/g,'class=" ani textElement"')
                          .replace(/class="[^\"]*(animated)[^\"]*(imageElement)[^\"]*"/g,'class=" ani imageElement"')
                          // .replace(/style="[^\"]*(animation-name|animation-duration|animation-delay)+:[^\:]*;[^\"]*"/g,' ')
                          .replace(/<div class="ui-resizable-handle(.)*?div>/g, '')
                          .replace(/ui-resizable/g,'') + direction;
                          // '<script type="text/javascript"> var mySwiper=new Swiper(".swiper-container",{ prevButton:".swiper-button-prev",nextButton:".swiper-button-next",direction:"'++'",onInit:function(swiper){swiperAnimateCache(swiper);swiperAnimate(swiper)},onSlideChangeEnd:function(swiper){swiperAnimate(swiper)}})</script>';
            $scope.page.preivewCode = $sce.trustAsHtml(strHtml);
              
            //console.log("@editToolDirective.js DEC print $scope.page.preivewCode is:"+$scope.page.preivewCode);
            $scope.closePreview = function() {
               $mdDialog.hide();
             // $('#previewPageInEditStatus').css('display', 'none');
              $("#popupContainer").removeClass('filter');


              var i = $(".page.col-leftclick span").html();
              $("#right_" + (i)).show();
            }
          },
          templateUrl: "./template/page.previewPage.tmpl.html",
          parent: $('#main'),
          hideDelay: false
            // position: $scope.getToastPosition()
        });
      }



/*
*@保存按钮
*
*
***/
      $scope.savePage = function() {
        /*
        *projectFn.getPageLength()
        *@ project/Module/projectService.js
        *
        */
          var pageLength = projectFn.getPageLength();

          if (loginFn.islogged().status) {

                /**
                * loginFn.islogged()
                * @ userModule/loginService.js
                * 返回:
                *
                * { 
                *   status    ：true | false 用户登录状态
                *   userName  ：用户名
                *   userPhoto : 用户头像链接
                *  }
                */
                if(projectIdIsNull()){
                    addProjectFn($mdDialog, $document);  
                }else{
                    saveProjectFn();
                }
          
          }else{


                $mdDialog.show({
                  controller: function($scope, $rootScope,loginFn) {
                     $("#popupContainer").addClass('filter');
                      $scope.loadingLogin   = false;
                      $scope.button_clicked = false;
                      $scope.loginClose = function(){
                          $mdDialog.hide();
                          $('.reveal-modal').hide();
                          $('.reveal-modal-bg').hide();
                          setTimeout(function(){$("#popupContainer").removeClass('filter');},250)
                      }

                      $scope.loginBtn = function(){
                        $scope.loadingLogin   = true;
                        $scope.button_clicked = true;
                         $scope.credentials = { "username":$scope.user.firstName,"password":$scope.user.passWord};
                         loginFn.login($scope.credentials).then(function(data){

                           if(data.status){
                                $rootScope.currentUser  = $rootScope.getCurrentUser();
                                $rootScope.isAuthorized = loginFn.islogged().status;
                                $scope.loadingLogin = false;
                                //$mdDialog.hide();
                                //setTimeout(function(){$("#popupContainer").removeClass('filter');},250)
                                addProjectFn($mdDialog, $document) 
                            }else{
                                // console.log('fail')
                                $scope.loading = false;
                                $scope.error = "用户名或密码错误";
                            }
                          
                           
                         });
                      }

                  },
                  templateUrl: './template/user.login.tmpl.html',
                  parent:$("#main"),
                  hideDelay: false
                });         
          }
      }


/*
*@描述：projectIdIsNulll
*@作用：判断当前项目是否是新建项目
**/
      function projectIdIsNull() {
        var status = typeof($("#pagesList").data('projectid')) == "undefined" ? true : false;
        return status;
      }

/*
*@描述：saveProjectFn
*@作用：非新建项目点击保存按钮出发此方法
*@详情：.....
**/
      function saveProjectFn(){

         // console.log('saveProjectFn')
          /*
          *@描述：pageLengthObj
          *@作用：获取用户在当前编辑状态下的实际页面个数
          **/          
          var pageLengthObj = projectFn.getPageLength();
          var projectid     = $("#pagesList").data("projectid");

          /*
          *@描述：将当前页面个数与存储个数比较，判断页面个数是否有变
          **/
          projectFn.loadEditPage(projectid).then(function(data) {
  
            //如果实际pageLengthObj 与 从projectFn.loadEditPage 获取的页面长度不等
            //返回实际pageLengthObj,如果相等，返回任意一个

            // console.log('actual page length：'+pageLengthObj.length)
            // console.log('page length from db:'+data.pageLength.length)
            //pageLengthObj.length !== data.pageLength.length?pageLengthObj:
              var newLengthObj = []
              // for(var i in pageLengthObj){
              //   console.log(i+":"+pageLengthObj[i])
              // }
           // console.log(pageLengthObj.length+"pageLength is null"+"///"+data.pageLength.length)
           // console.log( pageLengthObj == null +"pageLength is null"+"///"+data.pageLength.length)
            if(pageLengthObj.length == null || pageLengthObj.length == 0){
              newLengthObj = data.pageLength;
              console.log('pageLengthObj111111:'+pageLengthObj);
            }else{
              newLengthObj = pageLengthObj;
              console.log('pageLengthObj1222211:'+pageLengthObj);
            }

            // for(var i in newLengthObj){
            //   console.log(i+":"+newLengthObj[i])
            // }
            
            //console.log(newLengthObj.length+" newLengthObj.length")
         
            //console.log('newLengthObj:'+newLengthObj.length)
           var leftCode = [];
                   $(".box .page .swiper-slide").each(function(n){
                        leftCode.push($(".box .page .swiper-slide").eq(n).prop("outerHTML"));  
                    });

           var editCode = $("#pagesList").html()
                    .replace(/ui-selected/, '')
                    //.replace(/<div class="ui-resizable-handle(.)*?div>/g, '')
                    .replace(/isEdit/,'')
                    .replace(/<div class="ui-resizable-handle(.)*?div>/g, '')
                    .replace(/display: flex;/g, "display: none;")
                    //.replace('defaultPage','defaultPage isEdit')
                    //.replace('direction: ltr; display: none;','direction: ltr;display: block;')

           var previewCode = $("#pagesList").html()
                        .replace(/display/g, " ")
                          .replace(/isEdit/g, " ")
                          .replace(/icon-undo/g, " ")
                          .replace(/ui-selectable/g,'')
                          .replace(/ui-draggable/g,'')
                          .replace(/ui-selectee/g,'')
                          .replace(/ui-selected/g,'')
                          .replace(/right_/g,'')
                          .replace(/display: flex;/g,' ')
                          .replace(/onclick="imageActive(this)"/g,'')
                          .replace(/contenteditable="true"/g,' ')
                          .replace(/onclick="textActive(this)"/g,'')
                          .replace(/textElementActive/g,' ')
                          .replace(/imageElementAcitve/g,'')
                          .replace(/class="[^\"]*(animated)[^\"]*(textElement)[^\"]*"/g,'class=" ani textElement"')
                          .replace(/class="[^\"]*(animated)[^\"]*(imageElement)[^\"]*"/g,'class=" ani imageElement"')
                          // .replace(/style="[^\"]*(animation-name|animation-duration|animation-delay)+:[^\:]*;[^\"]*"/g,' ')
                          .replace(/<div class="ui-resizable-handle(.)*?div>/g, '')
                          .replace(/ui-resizable/g,'');
             //console.log('@eidtToolDirective.js ready save')

            projectFn.saveProject(newLengthObj, projectid, leftCode, editCode, previewCode)
              .then(function(data) {
                 // console.log('@eidtToolDirective.js save project completed')
                  if (data.status) {
                    setTimeout(function(){$("#popupContainer").removeClass('filter');},250)
                    $("#addBox").show();
                    setTimeout(function() {
                      $("#addBox").fadeTo(3000).hide();
                    }, 1000);
                  } else {
                    view(data.msg);
                  }
              }, function() {

                  $scope.error = "用户名或密码错误"
              });

          })

      }


/**
* @name  addProjecFn
* @description 
*
* 用于用户创建新项目
*/
      function addProjectFn($mdDialog, $document) {
      $("#popupContainer").addClass('filter');
        $mdDialog.show({
          controller: function($scope, projectFn) {
            $scope.loadingSave =false;
            $scope.isSaved = true;
            
            $scope.closeSavePage = function() {
              $mdDialog.hide();
              $('.reveal-modal').hide();
              $('.reveal-modal-bg').hide();
              setTimeout(function(){$("#popupContainer").removeClass('filter');},250)
            }
            $scope.savePageContent = function() {
              $scope.loadingSave = true;
              $scope.isSaved = false;
              $('#dialog_0 .btn-primary').attr('disabled','disabled')
              $('#dialog_1 .btn-primary').attr('disabled','disabled')
              $('#dialog_2 .btn-primary').attr('disabled','disabled')
              var pageLengthObj  = []
              var projectName    = $("#projectName").val();
              var projectInfo    = $('#projectInfo').val();     
              var userName       = loginFn.islogged().email;
              

              //console.log('projectFn.getPageLength():'+projectFn.getPageLength())
              //判断页面长度，如果只有一个页面，需要初始化存储页面长度对象
              if(!projectFn.getPageLength()){

              //如果projeFn.getPageLength没有数据，从第一个缩略图里获取hash
                var defaultThumb = $('*[data-activeid]').data('activeid');
                   pageLengthObj = [{'type': '1','thumbId':defaultThumb}];
                   console.log('pageLengthObj111:'+pageLengthObj);
              }else{

                   pageLengthObj = projectFn.getPageLength();
                   console.log('pageLengthObj222:'+pageLengthObj);
              }
              
               // console.log('only one page'+pageLengthObj)
               // console.log('only one page length'+pageLengthObj.length)
              // console.log('@addProject:current page length is:'+pageLengthObj.length);

              var previewCode = $("#pagesList").html()
                    .replace(/isEdit/g, " ")
                    .replace(/display/g, " ")
                    .replace(/icon-undo/g, " ")
                    .replace(/ui-selectable/g,'')
                    .replace(/ui-draggable/g,'')
                    .replace(/ui-selectee/g,'')
                    .replace(/ui-selected/g,'')
                    .replace(/right_/g,'')
                    .replace(/onclick="imageActive(this)"/g,' ')
                    .replace(/onclick="textActive(this)"/g,' ' )  
                    .replace(/textElementActive/g,' ')
                    .replace(/imageElementAcitve/g,'')
                    .replace(/display: flex;/g,' ')
                    .replace(/contenteditable="true"/g,' ')
                    .replace(/class="[^\"]*(animated)[^\"]*(textElement)[^\"]*"/g,'class=" ani textElement"')
                    .replace(/class="[^\"]*(animated)[^\"]*(imageElement)[^\"]*"/g,'class=" ani imageElement"')
                   // .replace(/style="[^\"]*(animation-name|animation-duration|animation-delay)+:[^\:]*;[^\"]*"/g,'')
                    .replace(/<div class="ui-resizable-handle(.)*?div>/g, '')
                    .replace(/ui-resizable/g,'');

               var editCode = $("#pagesList").html()
                    .replace(/ui-selected/, '')
                   // .replace(/<div class="ui-resizable-handle(.)*?div>/g, '')
                    .replace(/isEdit/,'')
                    .replace(/<div class="ui-resizable-handle(.)*?div>/g, '')
                    .replace(/display: flex;/g, "display: none;")
                   // .replace('defaultPage','defaultPage isEdit')
                   // .replace('direction: ltr; display: none;','direction: ltr;display: block;');

              var leftCode = [];
                   $(".box .page .swiper-slide").each(function(n){
                        leftCode.push($(".box .page .swiper-slide").eq(n).prop("outerHTML"));
                    });
              $('.currentprojectname').text(projectName);
              projectFn.addProject(projectName,previewCode,editCode,leftCode,projectInfo,userName,pageLengthObj)
                .then(function(data) {
                   // console.log(data.status+":data.status")
                    if (data.status) {
                      $("#pagesList").attr('data-projectid', data.project.id);
                        $scope.loadingSave = false;
                        $mdDialog.hide();
                        setTimeout(function(){$("#popupContainer").removeClass('filter');},250)
                        $("#addBox").show();
                        setTimeout(function() {
                          $("#addBox").fadeTo(3000).hide();
                        }, 1000);

                    } else {
                      // console.log('@editToolDirective.js  Fn: add project :'+data.name)
                    }
              }, function() {
              
              });
            }

          },
          templateUrl: './template/page.save.tmpl.html',
          parent: $('#main'),
          hideDelay: false
        });
      }




    }
  };
});
