var homeController = angular.module('homeController', ['ngMaterial','ngMessages']);
homeController.controller('homeController', function(
  $scope, 
  $rootScope, $mdSidenav, 
  editPage, $mdToast, $compile, 
  $sce, $state,$mdDialog, $document, SERVER_URL,loginFn) {

//用户退出
  $scope.loginOut = function(){
    $("#popupContainer").addClass('filter');
    loginFn.logout();
    $rootScope.isAuthorized = loginFn.islogged().status;
    //$state.go('homePage');

    window.location.reload();
    setTimeout(function(){$("#popupContainer").removeClass('filter');},250)
  }

//用户登录
  $scope.userLogin = function(){
    $("#popupContainer").addClass('filter');
        $mdDialog.show({
        controller: function($q,$scope,$rootScope,loginFn){
            $scope.loadingLogin = false;
            $scope.user = {
              'firstName' : '',
              'passWord'  : ''
            }
            $scope.loginClose = function(){
                  $mdDialog.hide();
                  setTimeout(function(){$("#popupContainer").removeClass('filter');},250)
            }

            $scope.loginBtn = function(){
                 $scope.loadingLogin = true;
                 $scope.credentials = { "username":$scope.user.firstName,"password":$scope.user.passWord};
                 loginFn.login($scope.credentials).then(function(data){

                  //$scope 作用于 user.login.tmpl.html
                  //$rootScope 作用于全局
                   if(data.status){
                        $scope.loadingLogin = false;
                        $rootScope.currentUser  = $rootScope.getCurrentUser();
                        $rootScope.isAuthorized = loginFn.islogged().status;
                        $mdDialog.hide();
                        setTimeout(function(){$("#popupContainer").removeClass('filter');},250)

                    }else{
                      $scope.loadingLogin = false;
                      $scope.userError = true;
                    }
                  
                   
                 });
            }

        },
        templateUrl:'./template/user.login.tmpl.html',
        parent : $("#main"),
        hideDelay: false
    });
  }

//用户未登录状态点击我的项目
  $scope.myProject = function(){
        if(loginFn.islogged().status){
          $state.go('dashboard');
        }else{
              $("#popupContainer").addClass('filter');
              $mdDialog.show({
                 controller: function($scope,$rootScope){
                    $scope.loginClose = function(){
                        $mdDialog.hide();
                        setTimeout(function(){
                            $("#popupContainer").removeClass('filter');
                        },250)
                    }
                
                    $scope.loginBtn = function(){
                         $scope.loadingLogin = true;
                         $scope.error = '';
                         $scope.credentials = { "username":$scope.user.firstName,"password":$scope.user.passWord};
                         loginFn.login($scope.credentials).then(function(data){

                          //$scope 作用于 user.login.tmpl.html
                          //$rootScope 作用于全局
                          // console.log(data.status+">>>>data.status")
                           if(data.status){
                                $rootScope.currentUser  = $rootScope.getCurrentUser();
                                $rootScope.isAuthorized = loginFn.islogged().status;
                                $("#popupContainer").removeClass('filter');
                              //  $mdDialog.hide();
                         
                                if(!$("#pagesList").data("projectid")){

                                  $mdDialog.show({
                                        controller: function($scope, projectFn) {
                                          $scope.loadingSave = false;
                                          $scope.closeSavePage = function() {
                                            console.log('close work');
                                            $mdDialog.hide();
                                            $("#popupContainer").removeClass('filter');
                                          }
                                          $scope.savePageContent = function() {
                                             $scope.loadingSave = true;
                                            var projectName = $("#projectName").val();           
                                            var previewCode = $("#pagesList").html()
                                                  .replace(/display/g, "!")
                                                  .replace(/isEdit/g, "!")
                                                  .replace(/icon-undo/g, "!")
                                                  .replace(/<div class="ui-resizable-handle(.)*?div>/g, '');

                                            var editCode    = $("#pagesList").html()
                                                  .replace(/ui-selected/, '')
                                                  .replace(/<div class="ui-resizable-handle(.)*?div>/g, '');

                                            projectFn.addProject(projectName,previewCode,editCode)
                                              .then(function(data) {
                                   
                                                  if (data.status) {
                                                    $("#pagesList").attr('data-projectid', data.project.id);
                                                    $scope.loadingLogin = false;
                                                      $mdDialog.hide();
                                                    $("#popupContainer").removeClass('filter');


                                                    $("#addBox").show();
                                                    setTimeout(function() {
                                                      $("#addBox").fadeTo(3000).hide();
                                                    }, 1000);

                                                     $state.go('dashboard');
                                                  } else {
                                                    view(data.msg);
                                                  }
                                            }, function() {
                                            
                                            });
                                          }

                                        },
                                        templateUrl: './template/page.save.tmpl.html',
                                        parent: $("#main"),
                                        hideDelay: false
                                      });
 
                                }

                            }else{
                                $scope.loadingLogin = false;
                                $scope.userError = true;
                            }
                          
                           
                         });
                      }
                },
                templateUrl:'./template/user.login.tmpl.html',
                parent : $("#main"),
                hideDelay: false
              });

        }
  }
      

//删除选中元素
  $scope.remove = function() {
    $(".ui-selected").remove();
  }

//'设置背景
  $scope.setBackground = function() {

    var color = $("#hsv-picker-bg").val();

    $(".isEdit").css('backgroundColor',color)
  }


$scope.$watch('setFontBackgroundColor',function(newValue,oldValue){
      console.log(newValue)
    })

  function saveProjectFn(){
    var pageLength = [];
    pageLength.length = 0;

    //初始化页面个数
    var projectid = $("#pagesList").data("projectid");
    var pageLengthNotSave = projectFn.getPageLength();
    projectFn.loadEditPage(projectid).then(function(data) {
      var newLength = 0;
      if (typeof(data.pageLength) == 'undefined') {
        newLength = 1;
      } else if (pageLengthNotSave > data.pageLength) {
        newLength = pageLengthNotSave;
      } else if (pageLengthNotSave < data.pageLength) {
        newLength = data.pageLength;
      } else if (pageLengthNotSave = data.pageLength) {
        newLength = data.pageLength;
      }
   
   
      var editCode = $("#pagesList").html()
              .replace(/ui-selected/, '')
              .replace(/isEdit/g, " ")
              .replace(/<div class="ui-resizable-handle(.)*?div>/g, '');

      var previewCode = $("#pagesList").html()
              .replace(/display/g, " ")
              .replace(/isEdit/g, " ")
              .replace(/icon-undo/g, " ")
              .replace(/<div class="ui-resizable-handle(.)*?div>/g, '');

      projectFn.saveProject(newLength, projectid, editCode, previewCode)
        .then(function(data) {

            if (data.status) {
              $('.md-dialog-container').css('display', 'none');
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


//判断是否为chrome浏览器
  var isChrome = window.navigator.userAgent.indexOf("Chrome") !== -1;
  if (!isChrome) {
    $mdDialog.show({
      controller: function() {
        $scope.closeToast = function() {
          $mdToast.hide();
        };
      },
      templateUrl: './template/page.isNotChrome.tmpl.html',
      parent: $document[0].querySelector('#main')
        // hideDelay: 6000
        // position: $scope.getToastPosition()
    });
  }

  $(document).on('click', function() {
    $('rotate-rightTop').css('display', 'none')
  })


// show radiobox edit panel if radiobox active
  function showBackgroundEditPanel($mdToast, $document) {
    $mdToast.show({
      controller: function($scope) {
        //set FontColor
        $scope.$watch("setPageBackgroundColor", function(newColor, oldColor) {
          $('.isEdit').css('backgroundColor', newColor);
        });

        $(this).parent().attr('id', 'selectedFormItem');
        $(this).parent().css({
          'border': '#dedede 3px dashed',
          'overflow': 'hidden'
        });


      },
      templateUrl: './template/page.background.tmpl.html',
      parent: $document[0].querySelector('#editModulePosition'),
      hideDelay: false
    });
  }


}).controller('LeftCtrl', function($scope, $timeout, $mdSidenav, 
  $log, $rootScope, $mdToast,
   $document, projectFn) { // 左侧导航栏位 start --
  
  $scope.feedback = {
    title: '',
    leftpages: [{
      'type': '1'
    }]
  };
  var projectIdInLeftNav = projectFn.getProjectId();
  projectFn.loadEditPage(projectIdInLeftNav).then(function(data) {
    var k = 0;
    k = data.pageLength;
    var colLeftHeight = 140 * k;
    if (k > 1) {
      for (var i = 0; i < k - 1; i++) {
        $scope.feedback.leftpages.push({
          type: '2'
        })
      };
    }

  })


  $scope.addEmptyTemplate = function(index) {
    var n = 0
    $scope.feedback.leftpages.push({
        type: '1',
        page: ''
      }),
    $rootScope.feedback = $scope.feedback;
    var n = $scope.feedback.leftpages.length
    $('#pagesList ').append('<div id=right_' + (n) + ' class="swiper-slide isEdit" stlye="display: flex"></div>');
    $(".swiper-slide").each(function(index, element) {
      $("#right_" + index).hide();
      $("#right_" + index).removeClass('isEdit');
      $("#ques_" + index).removeClass('col-leftclick');
      
    });


//$(".box>.page").hasClass('col-leftclick') ? $(".box>.page").removeClass('col-leftclick') : '';



    /**
    * @name savePageLength()
    * @path project/projectService.js
    * @description
    * 
    * 用户每增加一页，需要将当前总页数存储，在用户保存时，将当前页数传至后端
    *
    **/
    projectFn.savePageLength(n);
    //console.log('当前页数:'+n);
    $rootScope.pageLength = n;
    // $("#right_"+n).show()
    showBackgroundEditPanel($mdToast, $document)
  }

  $scope.choosePage = function(i) {
    $("#right_" + (i + 1)).fadeIn(300);
    //console.log('@homeController.js DEC choosePage i is :'+i);
    $(".swiper-slide").hide();
    $(".swiper-slide").removeClass("isEdit");
    $(".swiper-slide").removeClass('swiper-slide-next');
    $(".swiper-slide").removeClass('swiper-slide-active');
    //console.log('@homeController.js DEC choosePage current i'+(i + 1))
    $("#right_" + (i + 1)).show();
    $("#right_" + (i + 1)).addClass("isEdit");

    $(".page.col-leftclick.ng-scope").removeClass('col-leftclick')
    $("#ques_" + (i + 1)).addClass("col-leftclick"); 

    //rmeove others div when current is active
  





//    setTimeout(function(){
//      $("#hsv-picker-bg").val($('.isEdit').css("backgroundColor"))
//    },100)


// var sHexColor = sRgb.colorHex();//转换为十六进制方法<code></code>  
// var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;  
// /*RGB颜色转换为16进制*/  
// String.prototype.colorHex = function(){  
//     var that = this;  
//     if(/^(rgb|RGB)/.test(that)){  
//         var aColor = that.replace(/(?:||rgb|RGB)*/g,"").split(",");  
//         var strHex = "#";  
//         for(var i=0; i<aColor.length; i++){  
//             var hex = Number(aColor[i]).toString(16);  
//             if(hex === "0"){  
//                 hex += hex;   
//             }  
//             strHex += hex;  
//         }  
//         if(strHex.length !== 7){  
//             strHex = that;    
//         }  
//         return strHex;  
//     }else if(reg.test(that)){  
//         var aNum = that.replace(/#/,"").split("");  
//         if(aNum.length === 6){  
//             return that;      
//         }else if(aNum.length === 3){  
//             var numHex = "#";  
//             for(var i=0; i<aNum.length; i+=1){  
//                 numHex += (aNum[i]+aNum[i]);  
//             }  
//             return numHex;  
//         }  
//     }else{  
//         return that;      
//     }  
// };  



  }
});
