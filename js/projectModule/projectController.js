"use strict";

/*
*@ projectController.js 负责监听用户在dashboard里对项目的操作，根据操作从projectService.js里调用数据接口
-----------------------------------------------------------------------------------------------
*@ projectController.js 主要负责 在dashboard页面内对项目的 添加，删除，复制，预览操作
*@ note :
*  $scope是视图和controller/directive之间的桥梁
*  controller是视图和service的粘合剂
-----------------------------------------------------------------------------------------------
*@ 用户登录             ：$scope.savePage        = function(){....}
*@ 用户退出             : $scope.loginOut()      = function(){....}
*@ 创建项目             ：$scope.createProject() = function(){....}
*@ 复制项目             : $scope.copyProject     = function(){....}
*@ 删除项目             : $scope.deletePage      = function(){....}
*@ 预览项目             : $scope.previewPage     = function(){....} 
*@ 二维码下载           ：$scope.downLoadQrCode  = function(){....}
*@ 返回到编辑页面       ：$scope.editPage        = function(){....}
*/
var projectController = angular.module('projectController', ['ngMaterial', 
  'AuthService', 
  'projectService', 
  'eidtToolDirective']);

projectController.controller('projectController', function(
  $scope,            //angularjs 内部服务
  $state,            //angularjs 内部服务
  $rootScope,        //angularjs 内部服务
  $document,         //angularjs 内部服务
  $mdDialog,         //提供对话框的模块                    @angular-material.js
  $mdToast,          //提供文本/图片编辑面板               @angular-material.js
  getMyProjectsList, //通过resolve 获取项目列表，将返回对象注入到projectControll中，通过$scope 将项目所有项目渲染到当前页面
  projectFn,         //提供了所有关于项目操作的restful接口 @projectService.js        
  loginFn,           //提供了关于用户登录状态的操作        @loginService.js
  AuthService,        //提供用户当前登录状态                @AuthService.js
  pageSettingService
) {
  
  $rootScope.isAuthorized = loginFn.islogged().status;

  var _scope = $scope;

  $scope.loginOut = function(){
      $("#popupContainer").addClass('filter');
      loginFn.logout();
      $rootScope.isAuthorized = loginFn.islogged().status;

      //项目管理页面退出后，返回到主页
      $state.go('homePage');
      setTimeout(function(){$("#popupContainer").removeClass('filter');},250)
     
  }
  $scope.createProject = function(ev, id) {
    pageSettingService.setPageSetting('vertical');
    $(".dashboardContainer").addClass('filter');
    $mdDialog.show({
      controller: function($scope, $compile, projectFn) {
        $scope.loadingSave =false;
        $scope.isDisabled = false;
        $scope.createProjectInProgress = function() {
          //初始化 getPageLength 防止存储到当前项目
          projectFn.getPageLength().length = 0;
          
        $scope.loadingSave = true;
        //$scope.isDisabled = true;
        $('#saveProjectOverLay .btn-primary').attr("disabled","disabled")
        $scope.projectInfo = {
          "id": "",
          "projectname": "",
          "cover": "",
          "qrcode": ""
        }
        var userName = loginFn.islogged().email;
          projectFn.addProject($scope.projectName).then(function(data){
            if(data.status){
              $scope.projectInfo.id          = data.project.id;
              $scope.projectInfo.url         = data.project.url;
              $scope.projectInfo.cover       = data.project.cover;
              $scope.projectInfo.qrcode      = data.project.qrcode;
              $scope.projectInfo.projectname = data.project.projectname;
         
            $compile($('<div class="col-sm-6 col-md-4 col-lg-3 modmore" id="' + $scope.projectInfo.id + '"><div class="thumbnail"  style="height: 334px;padding:0px;" ><div class="projectInfo-projectName" style="position:absolute;width:100%;opacity:1;""><img  style="width:100%;height:auto;"  src="' + $scope.projectInfo.cover + '"><div style="width:100%; position:absolute;bottom:0px;text-align:center;height:40px; background:#fff;padding:10px 0px 10px 0px;"><p>' + $scope.projectInfo.projectname + '</p></div></div><div class="dask" style="position:absolute;width:100%;opacity:0;"><p class="showMoreIconsTop"><span ng-click="deletePage($event,' + "'" + $scope.projectInfo.id + "'" +",'" + $scope.projectInfo.projectname + "'" + ')" class="label label-default"><i class="icon-eye-open icon-1" style="margin-right: 5px;"></i>删除</span><span style="margin-left:5px;" ng-click="copyProject($event,' + "'" + $scope.projectInfo.id + "'," + "'" + $scope.projectInfo.projectname + "'" + ')"  class="label label-default"><i class="icon-edit" style="margin-right: 5px;"></i>复制</span></p><img src="' + $scope.projectInfo.qrcode + '" style="width:100%;"><p class="projectInfoDownloadQRCode">下载二维码</p><p class="showMoreIconsBottom"><span ng-click="previewPage($event,' + "'" + $scope.projectInfo.url + "'," + "'" + $scope.projectInfo.qrcode + "'" + ')"  class="label label-default"><i class="icon-eye-open icon-1" style="margin-right: 5px;"></i>预览</span><span style="margin-left:5px;" ng-click="editPage($event,' + "'" + $scope.projectInfo.id + "'" + ",'" + $scope.projectInfo.projectname + "'" +')" class="label label-default"><i class="icon-edit" style="margin-right: 5px;"></i>编辑</span></p></div></div></div>').prependTo($('.modlist')))(_scope);
             //$compile($('<div class="col-sm-6 col-md-4 col-lg-3 modmore" id="' + $scope.projectInfo.id + '"><div class="thumbnail"  style="height: 334px; padding:0;" ><div class="projectInfo-projectName" style="position:absolute;width:100%;opacity:1;"><img  style="width:100%;height:auto;"  src="' + $scope.projectInfo.cover + '"><div style="width:100%;position:absolute;bottom:0px;text-align:center;height:40px;background:#fff;padding:10px 0px 10px 0px;">' + $scope.projectInfo.projectname + '</p></div></div><div class="dask" style="position:absolute;width:100%;opacity:0;"><p class="showMoreIcons"><span ng-click="deletePage($event,' + "'" + $scope.projectInfo.id + "'" + ')" class="projectInfoShowMoreIcons-remove" style="width:0px;opacity:0;"></span><span ng-click="copyProject($event,' + "'" + $scope.projectInfo.id + "'," + "'" + $scope.projectInfo.projectname + "'" + ')" class="projectInfoShowMoreIcons-copy" style="width:0px;opacity:0;"></span><span href="javascript:;" class="projectInfoShowMoreIcons"></span></p><img src="' + $scope.projectInfo.qrcode + '" style="width:100%;"><p class="projectInfoDownloadQRCode">下载二维码</p><p class="showMoreIconsBottom"><a ng-click="previewPage($event,' + "'" + $scope.projectInfo.url + "'," + "'" + $scope.projectInfo.qrcode + "'" + ')" class="projectInfoShowMoreIcons-preview"></a><a ng-click="editPage($event,' + "'" + $scope.projectInfo.id + "'" + ')" class="projectInfoShowMoreIcons-edit"></a></p></div></div></div></div></div>').prependTo($('.modlist')))(_scope);
              

              $scope.loadingSave = false;
              $scope.isDisabled = true;
              $mdDialog.hide();

              setTimeout(function(){ $(".dashboardContainer").removeClass('filter');},250)
       
              $("#addBox").show();
              setTimeout(function() {
                $("#addBox").fadeTo(3000).hide();
              }, 1000);
              
              $('.modlist').css('display', 'block')
            }
            
          });

        }

        $scope.close = function() {
          $mdDialog.hide();
          setTimeout(function(){ $(".dashboardContainer").removeClass('filter');},250)
        }

      },
      templateUrl: './template/page.copyProject.tmpl.html',
      parent: $("#main"),
      hideDelay: false
    });
  
  }

  $scope.projectList = getMyProjectsList;

  $scope.showBack = function(target) {
    $(target).find('.dask').stop().delay(50).animate({
      opacity: 1
    }, 200);
    $('#container').css('filter', 'blur(5px)');
  };
  $scope.downLoadQrCode = function(qrUrl) {
    window.open('http://9.115.24.168:3000/downloadQRCode?url=' + qrUrl, 'target');
  }

    $scope.editPage = function(ev,id,projectname){
      //$('.swiper-slide').remove();
      $state.go('homePage');
      console.log('editpage::'+id);
      projectFn.saveProjectId(id);
      //reload leftNav 
      setTimeout(function(){
          $('.box').eq(0).click();
        },350)
    }
  // $scope.previewPage = function(ev, url, qrcode, code) {
  //   $('.modlist').css('display', 'none')
  //   $mdToast.show({
  //     controller: function($scope) {
  //       $scope.previewUrl = url;
  //       $scope.qrcode = qrcode;
  //       $scope.close = function() {
  //         $('.dashBoardPreview').css('display', 'none');
  //         $('.modlist').css('display', 'block')

  //       }
  //     },
  //     template: '<div class="dashBoardPreview"  tabindex="-1" ><div class="modal-dialog"style="width:85%;z-index: 999;margin-top:90px;"><div class="modal-content" style="border-radius: 0px;"><div class="modal-body"><a  style="cursor: pointer; font-size: 17px;text-align: right;font-weight: bold;text-decoration: none;vertical-align: top;position: absolute;right: 18px;top: 9px;" ng-click="close()">&times;</a><div style="width:370px;height:480px;display:inline-block"><iframe src="' + url + '" style="width:370px;height:568px;" scrolling="no"></iframe></div><div style=" text-align:center;display: inline-block;vertical-align: top;width: 500px;margin-left: 40px;"><img src="' + qrcode + '" style="width:300px;height:300px;margin-top:30px;" /><div class="input-group"><span class="input-group-addon" style="border-radius: 0px;">链接</span><input readonly style="border-radius: 0px;" type="text" class="form-control" value="' + url + '"></div></div></div></div></div></div>',
  //     parent: $document[0].querySelector('#dashboardContent'),
  //     hideDelay: false
  //   });

  // }


 $scope.previewPage = function(ev, url, qrcode, code) {
 

        $(".dashboardContainer").addClass('filter');
       $mdDialog.show({
          controller: function($scope, $compile, $sce) {
            $scope.page = {
              "url":url,
              "qrcode":qrcode
            }
            $(document).on('click','.closeOverLay',function(){
               $mdDialog.hide();
             setTimeout(function(){ $(".dashboardContainer").removeClass('filter');},150)
           })
 

     $compile($("#previewContent").attr('ng-bind-html', 'page.preivewCode'))($scope)
          },  
       template: '<script>$(function () {$("#copy_btnid").zclip({path:"./swf/ZeroClipboard.swf", copy: function () { return $("#copy_value").val(); } });});</script><md-dialog aria-label="Mango (Fruit)" class="dashBoardPreview"  tabindex="-1" id="previewPageInEditStatus"  style="position:fixed;width: 100%;position: fixed;z-index: 10110;height: 100%; background: rgba(0,0,0,0.8); top:0; left: 0;max-width: 100%;max-height: 100%;">  <a class="closeOverLay" ng-click="close()"></a><md-dialog-content style="width:100%;height:100%;z-index: 999;position: absolute;top:45%;bottom: 0;left: 0;right: 0;margin:auto; text-align: center;" ><div style="width:320px;height:480px;display:inline-block"><iframe src="' + url + '" style="width:320px;height:480px; border: 0;" scrolling="no"></iframe></div><div style=" text-align:center;display: inline-block;vertical-align: top;width: 500px;margin-left: 40px;">  <img src="' + qrcode + '" style="width:200px;height:200px;margin-top:30px;" /><div class="input-group" style="margin-top:30px;"><input type="text" id ="copy_value" class="form-control " readonly value="' + url + '"><span class="input-group-btn"><button id="copy_btnid" class="btn btn-default copy_btn" type="button">复 制</button> </span></div></div></md-dialog-content></md-dialog>',
        //template: '<md-dialog aria-label="Mango (Fruit)" class="dashBoardPreview"  tabindex="-1" id="previewPageInEditStatus"  style="position:fixed;width: 100%;position: fixed;z-index: 10110;height: 100%; background: rgba(0,0,0,0.8); top:0; left: 0;max-width: 100%;max-height: 100%;">  <a class="closeOverLay" ng-click="close()"></a><md-dialog-content style="width:100%;height:100%;z-index: 999;position: absolute;top:45%;bottom: 0;left: 0;right: 0;margin:auto; text-align: center;" ><div style="width:320px;height:480px;display:inline-block"><iframe src="' + url + '" style="width:320px;height:480px; border: 0;" scrolling="no"></iframe></div><div style=" text-align:center;display: inline-block;vertical-align: top;width: 500px;margin-left: 40px;">  <img src="' + qrcode + '" style="width:200px;height:200px;margin-top:30px;" /><div class="input-group" style="margin-top: 30px;"><input readonly id ="copy_value" style="border-radius: 0px;" type="text" class="form-control" value="' + url + '"><input class="copy_btn" type="button" value="复 制"/></div></div></md-dialog-content></md-dialog><script type="text/javascript">var clip = new ZeroClipboard($(".copy_btn"), {moviePath: "js/lib/zeroclipboard/ZeroClipboard.swf"});clip.on( "mousedown", function(client) {clip.setText($("#copy_value").val());});clip.on( "complete", function(client, args) {alert("代码已经复制到您的剪贴板,使用ctrl+v粘贴或者右键粘贴。");});</script>',
        parent:  $("#main"),   
          hideDelay: false
            // position: $scope.getToastPosition()
        });
      }


  $scope.deletePage = function(ev, projectId,projectName) {

     $(".dashboardContainer").addClass('filter');
      $mdDialog.show({
      controller: function($scope, $compile, projectFn) {
        $scope.projectName = projectName;
        $scope.deleteInProgress = function() {
          $('#delProjectOverLay').css('display', 'none');

          projectFn.deletedProject(projectId).then(function(data){
            // console.log(projectId+"projectIdprojectIdprojectIdprojectId")
            $('#' + projectId).remove();
             
             $mdDialog.hide();
             setTimeout(function(){ $(".dashboardContainer").removeClass('filter');},150)
             $("#removeBox").show();
              setTimeout(function() {
                $("#removeBox").fadeTo(3000).hide();
              }, 1000);

          },function(){}); 
        }

        $scope.close = function() {
          $mdDialog.hide();
          setTimeout(function(){ $(".dashboardContainer").removeClass('filter');},150)
        }

      },
      templateUrl: './template/page.dialog.tmpl.html',
      parent: $("#main"),
      hideDelay: false
    });
  

     
  }


  $scope.copyProject = function(ev, projectId, projectName) {
     $(".dashboardContainer").addClass('filter');
    var _scope = $scope;
    $mdDialog.show({
      controller: function($scope, $compile, projectFn) {
        var pId = projectId;
        $scope.projectName = projectName;
        $scope.copyProjectInProgress = function() {

          $scope.projectInfo = {
            "id": "",
            "projectname": "",
            "cover": "",
            "qrcode": ""
          }

          projectFn.copyProject($scope.projectName, pId).then(function(data){
            // for(var i in data){
            //   console.log(i+":"+data[i])
            // }
            if(data.status){
              $scope.projectInfo.id          = data.project.id;
              $scope.projectInfo.url         = data.project.url;
              $scope.projectInfo.cover       = data.project.cover;
              $scope.projectInfo.qrcode      = data.project.qrcode;
              $scope.projectInfo.projectname = data.project.projectname;
         
            
              $compile($('<div class="col-sm-6 col-md-4 col-lg-3 modmore" id="' + $scope.projectInfo.id + '"><div class="thumbnail"  style="height: 334px;padding:0px;" ><div class="projectInfo-projectName" style="position:absolute;width:100%;opacity:1;""><img  style="width:100%;height:auto;"  src="' + $scope.projectInfo.cover + '"><div style="width:100%; position:absolute;bottom:0px;text-align:center;height:40px; background:#fff;padding:10px 0px 10px 0px;"><p>' + $scope.projectInfo.projectname + '</p></div></div><div class="dask" style="position:absolute;width:100%;opacity:0;"><p class="showMoreIconsTop"><span ng-click="deletePage($event,' + "'" + $scope.projectInfo.id + "'" + ",'" + $scope.projectInfo.projectname + "'" +')" class="label label-default"><i class="icon-eye-open icon-1" style="margin-right: 5px;"></i>删除</span><span style="margin-left:5px;" ng-click="copyProject($event,' + "'" + $scope.projectInfo.id + "'," + "'" + $scope.projectInfo.projectname + "'" + ')"  class="label label-default"><i class="icon-edit" style="margin-right: 5px;"></i>复制</span></p><img src="' + $scope.projectInfo.qrcode + '" style="width:100%;"><p class="projectInfoDownloadQRCode">下载二维码</p><p class="showMoreIconsBottom"><span ng-click="previewPage($event,' + "'" + $scope.projectInfo.url + "'," + "'" + $scope.projectInfo.qrcode + "'" + ')"  class="label label-default"><i class="icon-eye-open icon-1" style="margin-right: 5px;"></i>预览</span><span style="margin-left:5px;" ng-click="editPage($event,' + "'" + $scope.projectInfo.id + "'" + ",'" + $scope.projectInfo.projectname + "'" +')" class="label label-default"><i class="icon-edit" style="margin-right: 5px;"></i>编辑</span></p></div></div></div>').prependTo($('.modlist')))(_scope);
              $mdDialog.hide();
              setTimeout(function(){ $(".dashboardContainer").removeClass('filter');},250)
       
              $("#addBox").show();
              setTimeout(function() {
                $("#addBox").fadeTo(3000).hide();
              }, 1000);
              
              $('.modlist').css('display', 'block')
            }
            
          });

        }

        $scope.close = function() {
          $mdDialog.hide();
          setTimeout(function(){ $(".dashboardContainer").removeClass('filter');},250)
        }

      },
      templateUrl: './template/page.copyProject.tmpl.html',
      parent: $('#main'),
      hideDelay: false
        // position: $scope.getToastPosition()
    });



  }

})
