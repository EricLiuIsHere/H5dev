
/*
*@ homeController.js 负责监听用户在home.html页面里的操作，根据用户操作请求，调用service方法
-----------------------------------------------------------------------------------------------
*@ homeController 模块实现了用户登录，退出，进入dashboard页面前的一些逻辑判断以及缩略图与对应编
*  辑页面的联动操作
-----------------------------------------------------------------------------------------------
*@ 用户登录                      ：$scope.userLogin            = function(){....}
*@ 用户退出                      : $scope.loginOut()           = function(){....}
*@ 用户进入到dashboard           ：$scope.myProject()          = function(){....} 
*@ 用户添加新页面                : $scope.addEmptyTemplate()   = function(){....}
*@ 用户选择不同页面              : $scope.choosePage           = function(){....}
*/


var homeController = angular.module('homeController', []);
homeController.controller('homeController', function(
  $scope,
  $rootScope,
  editPage, $mdToast, $compile,
  $sce, $state,$mdDialog, $document, SERVER_URL,loginFn,projectFn) {



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
            $scope.button_clicked = false;
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
                 $scope.button_clicked = true;
                 $scope.loadingLogin = true;
                 console.log('$scope.button_clicked:'+$scope.button_clicked);
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

      var textIsNull = $('.textElementActive').length<1;
      var imageIsNull = $('.imageElementAcitve').length<1;


        //1.登陆状态下，编辑已创建过的项目，但没有保存，点击我的项目会将项目保存到db
        //2.登陆状态下，用户编辑结束，已点击保存，无须提示是否保存
        if($("#pagesList").data("projectid")){

            saveProjectFn();

         }else if(textIsNull&& imageIsNull &&!$("#pagesList").data("projectid")){
        //2.登陆状态下，没有编辑行为，直接挑砖道dashboard

          $state.go('dashboard');
         }else{
          //3.登陆状态下创建新项目，没有点击保存，直接点击我的项目
          addProject($mdDialog,$document);
         }


    }else{
      $("#popupContainer").addClass('filter');
      $mdDialog.show({
         controller: function($scope,$rootScope){
           $scope.button_clicked = false;
             $scope.loadingLogin = false;
            $scope.loginClose = function(){
              mdDialogHide($mdDialog)
            }

            $scope.loginBtn = function(){
                 $scope.loadingLogin = true;
                 $scope.button_clicked = true;

                 $scope.credentials = { "username":$scope.user.firstName,"password":$scope.user.passWord};
                 loginFn.login($scope.credentials).then(function(data){

                   if(data.status){
                        $rootScope.currentUser  = $rootScope.getCurrentUser();
                        $rootScope.isAuthorized = loginFn.islogged().status;
                        $("#popupContainer").removeClass('filter');

                        if(!$("#pagesList").data("projectid")){

                            addProject($mdDialog,$document);
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



/*
*@描述：saveProjectFn
*@作用：非新建项目点击保存按钮出发此方法
*@详情：.....
**/
function saveProjectFn(){

    /*
    *@描述：pageLengthObj
    *@作用：获取用户在当前编辑状态下的实际页面个数
    **/
    var pageLengthObj = projectFn.getPageLength();
    var newLengthObj = [];
    var projectid     = $("#pagesList").data("projectid");

    /*
    *@描述：将当前页面个数与存储个数比较，判断页面个数是否有变
    **/
    projectFn.loadEditPage(projectid).then(function(data) {


            //如果实际pageLengthObj 与 从projectFn.loadEditPage 获取的页面长度不等
            //返回实际pageLengthObj,如果相等，返回任意一个

           if(pageLengthObj.length == null || pageLengthObj.length == 0){
              newLengthObj = data.pageLength;
            }else{
              newLengthObj = pageLengthObj;
            }

            var editCode = $("#pagesList").html()
                  .replace(/ui-selected/, '')
                  .replace(/isEdit/,'')
                  .replace(/display: flex;/g, "display: none;")
                  .replace(/<div class="ui-resizable-handle(.)*?div>/g, '')


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
                          .replace(/ui-resizable/g,'')

          projectFn.saveProject(newLengthObj, projectid, editCode, previewCode)
            .then(function(data) {
                
                if (data.status) {
                    $mdDialog.hide();
                    setTimeout(function(){
                      $(".dashboardContainer").removeClass('filter');
                        $state.go('dashboard');
                    },150)
                } else {
                  //console.log('error')
                }
            }, function() {

                $scope.error = "用户名或密码错误"
            });

     })

}


/*
*@描述：关闭overlay
*
***/
function mdDialogHide($mdDialog){
  $mdDialog.hide();
  setTimeout(function(){
      $("#popupContainer").removeClass('filter');
  },250)
}


/*
*@描述：添加新项目
*
****/
function addProject($mdDialog,$document){

$mdDialog.show({
    controller: function($scope, projectFn) {
      $scope.loadingSave = false;
      $scope.button_clicked = false;
      $scope.closeSavePage = function() {
        $mdDialog.hide();
        $("#popupContainer").removeClass('filter');
      }
      $scope.savePageContent = function() {
         $scope.loadingSave = true;
           $scope.button_clicked = true;
         var projectName = $("#projectName").val();
         var projectName = $("#projectName").val();
         var projectInfo = $('#projectInfo').val();
         var pageLength  = projectFn.getPageLength();
         // console.log('only one page'+pageLength.length)
         var userName    = loginFn.islogged().email;
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
                          .replace(/ui-resizable/g,'')

               var editCode = $("#pagesList").html()
                    .replace(/ui-selected/, '')
                    //.replace(/<div class="ui-resizable-handle(.)*?div>/g, '')
                    .replace(/isEdit/,'')
                    .replace(/display: flex;/g, "display: none;")
                    //.replace('defaultPage','defaultPage isEdit')
                    //.replace('direction: ltr; display: none;','direction: ltr;display: block;')

        projectFn.addProject(projectName,previewCode,editCode,projectInfo,userName,pageLength)
                 .then(function(data) {
                // console.log(data.status+":data.status")
                    if (data.status) {
                      $("#pagesList").attr('data-projectid', data.project.id);
                        $scope.loadingSave = true;

                        mdDialogHide($mdDialog);
                        $("#addBox").show();
                        setTimeout(function() {
                          $("#addBox").fadeTo(3000).hide();
                        }, 1000);


                        $state.go('dashboard');

                    } else {
                      // console.log('@editToolDirective.js  Fn: add project :'+data.name)
                    }
              }, function() {
          //....................
        });
      }

    },
    templateUrl: './template/page.save.tmpl.html',
    parent: $("#main"),
    hideDelay: false
  });
}



}).controller('LeftCtrl', function($scope, $timeout, $mdSidenav,
  $log, $rootScope, $mdToast,$compile,$document, $mdDialog,projectFn) { // 左侧导航栏位 start --


$(document).on("mouseenter",".page",function(){
    $(this).find(".pageThumbMask").css('display','block');

});
$(document).on("mouseleave",".page",function(){
       $(this).find(".pageThumbMask").css('display','none');
});


setTimeout(function(){
  $("div.page:eq(0)").addClass('col-leftclick')
},100)

  function makeid(){
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for( var i=0; i < 10; i++ )
          text += possible.charAt(Math.floor(Math.random() * possible.length));
      return text;
  }

//console.log($('.box').data('activeid')+"$('.box').data('activeid')")
  if(!$('.box').data('activeid')){
    var defaultThumb = makeid();
    $scope.feedback = {
      title: '',
      leftpages: [{
        'type': '1',
        'thumbId':defaultThumb
      }]
    };
//console.log($('.box').data('activeid')+"$('.box').data('activeid')")
    $("#pagesList div.swiper-slide:eq(0)").attr('data-pageid',defaultThumb)
  }





/*
*页面加载完毕后，左侧缩略图个数根据右侧页面个数自动生成
*
*
*/


  if(!$('.box').data('activeid')){
    var defaultThumb = makeid();
    $scope.feedback = {
      title: '',
      leftpages: [{
        'type': '1',
        'thumbId':defaultThumb
      }]
    };

    $("#pagesList div.swiper-slide:eq(0)").attr('data-pageid',defaultThumb)
  }



  var projectIdInLeftNav = projectFn.getProjectId();

  projectFn.loadEditPage(projectIdInLeftNav).then(function(data) {

    $scope.feedback.leftpages = data.pageLength;
    var colLeftHeight         = 140 * $scope.feedback.leftpages.length;

    setTimeout(function(){$("div.page:eq(0)").addClass('col-leftclick')},100)
  })




$scope.addEmptyTemplate = function(index) {
//清除背景颜色面板选中
$('.k-selected-color').css('box-shadow','none');
$("#color-chooser-bg-1").data("kendoColorPalette").value('#ffffff'); 


//清除左侧略缩图选中状态
    $('.page').removeClass('col-leftclick');

//判断当前左侧导航是否有略缩图
    var isEmpty = $('.new-button').siblings('.pageThumbItem').length;

//将全部页面删除后，再添加第一页，需要判断当前页面是否唯一
    if(isEmpty<1){

//如果当前页面为第一页，通过 n 设置默认索引
        var n=1;

//生成唯一hash，作为左侧略缩图和对应右侧内容页的同步
        var thumbId = makeid();
        $scope.feedback.leftpages.push({type: '1',page: '',thumbId:thumbId});
        $('#pagesList ').append('<div class="swiper-slide isEdit" data-pageId="'+thumbId+'" ></div>');
    }else{

//生成唯一 hash值,作为略缩图和对应页面的标识符
        var thumbId = makeid();

//通过增加数组长度，记录当前页面个数，同时把生成的hash作为id记录在左侧元素中
        $scope.feedback.leftpages.push({type: '1',page: '',thumbId:thumbId});

//隐藏其他元素
        $(".swiper-slide").hide();
        $(".swiper-slide").removeClass("isEdit");

//相同的hash同时记录在对应的右侧元素，通过hash来保持两个元素之间的同步，并isEdit显示当前新创建元素
        $('#pagesList ').append('<div class="swiper-slide isEdit" data-pageId="'+thumbId+'" style="display: flex;"></div>');

        setTimeout(function(){
           $(".col-left").find("div[data-activeid='"+thumbId+"']").find('div[class="page"]').addClass('col-leftclick');
         },100)

      }
//



    /**
    * @name savePageLength()
    * @path project/projectService.js
    * @description
    *
    * 用户每增加一页或删除一页，更新$scope.feedback.leftpages数组，并保存至projectFn.savePageLength
    * projectFn.savePageLength 方法用于保存页面长度，在用户保存项目时，会从这个方法获取页面的长度
    **/

    projectFn.savePageLength($scope.feedback.leftpages);

  }

  $scope.choosePage = function(i) {


 $(".swiper-slide").hide();
 $(".swiper-slide").removeClass("isEdit");

 //清除左侧略缩图选中状态
 $('.page').removeClass('col-leftclick');

 $("#pagesList").find("div[data-pageid='"+i+"']").fadeIn(300).show().addClass('isEdit').css('display','flex');

 //通过父级元素查找某个元素下的子元素
 $(".col-left").find("div[data-activeid='"+i+"']").find('div[class="page"]').addClass('col-leftclick');
 
 //背景颜色回显（customized）
    var bgcol = ["rgb(255, 255, 255)", "rgb(0, 0, 0)","rgb(116, 97, 83)", "rgb(58, 76, 139)", "rgb(255, 204, 51)", "rgb(251, 69, 95)", "rgb(172, 18, 15)" ];
    var cuscolor = $('.isEdit').css('backgroundColor');


    if(bgcol.indexOf(cuscolor)>-1){
      //initialize
      $('.k-colorpicker').css('overflow','visible');
      $('.k-selected-color').css('box-shadow','none');
      $('.k-state-selected').removeClass('k-state-selected');

      var palette_bg = $("#color-chooser-bg-1").data("kendoColorPalette");
      if(cuscolor=='rgb(255, 255, 255)'){
          palette_bg.value("rgb(255, 255, 255)");
      }
      else{
          palette_bg.value(cuscolor);
      }
    }
    else{
      $('.k-colorpicker').css('overflow','visible');
      $('.k-state-selected').removeClass('k-state-selected');
      $('.k-selected-color').css({
        'height': '15px',
        'box-shadow': '0 1px 3px 1px rgba(0,0,0,0.7),inset 0 0 0 1px rgba(255,255,255,0.45)',
        'z-index' : '100',
        'position': 'relative',
        'background-color': cuscolor,
      })
    } 
    
}

/*
*@删除页面
*@删除页面的同时更新存储页面长度的数组
*
*
****/

$scope.removePage = function(pageId){

      $("#popupContainer").addClass('filter');
      var _scope = $scope;
      var pageId = pageId;

      $mdDialog.show({
      controller: function($scope) {
        $scope.projectName = '';
        $scope.deleteInProgress = function() {
          $('#delProjectOverLay').css('display', 'none');

          //更新存储页面数组
          for(var i in _scope.feedback.leftpages){



            //从数组中匹配当前点击元素ID
            if(_scope.feedback.leftpages[i].thumbId == pageId){

              if(i==0){

               // console.log('works deleted');
                //判断要删除的元素是否是第一个元素,删除第一个元素后，紧邻元素高亮


                //console.log("_scope.feedback.leftpages[1]:"+_scope.feedback.leftpages[1]);


                var showThumbId = _scope.feedback.leftpages[1] == undefined ?' ': _scope.feedback.leftpages[1].thumbId ;

                 //重置样式
                 $(".col-left").removeClass('col-leftclick');
                 $(".swiper-slide").hide();
                 $(".swiper-slide").removeClass("isEdit");

                 //当删除元素后，设置要显示那个元素
                 $("#pagesList").find("div[data-pageid='"+showThumbId+"']").fadeIn(300).show().addClass('isEdit');
                 $(".col-left").find("div[data-activeid='"+showThumbId+"']").find('div[class="page"]').addClass('col-leftclick');
                 //更新存储页面数组
                 _scope.feedback.leftpages.splice(i,1);

                 //删除选中页面
                 $("#pagesList").find("div[data-pageid='"+pageId+"']").fadeOut(300).remove();
                 $(".col-left").find("div[data-activeid='"+pageId+"']").fadeOut(300).remove();


                 //取消 删除确认框
                 $mdDialog.hide();
                 setTimeout(function(){ $("#popupContainer").removeClass('filter');},150)
                 $("#removeBox").show();
                 setTimeout(function() {$("#removeBox").fadeTo(3000).hide();}, 1000);


              }else if(i>0){

                //要删除元素不是第一个元素默认显示相邻元素
                var showThumbId = _scope.feedback.leftpages[i-1].thumbId !== 'undefined'?_scope.feedback.leftpages[i-1].thumbId:_scope.feedback.leftpages[i+1].thumbId;
                $(".swiper-slide").hide();
                $(".swiper-slide").removeClass("isEdit");
                $(".col-left").removeClass('col-leftclick');

                $("#pagesList").find("div[data-pageid='"+showThumbId+"']").fadeIn(300).show().addClass('isEdit');
                $(".col-left").find("div[data-activeid='"+showThumbId+"']").find('div[class="page"]').addClass('col-leftclick');
                _scope.feedback.leftpages.splice(i,1);



                $("#pagesList").find("div[data-pageid='"+pageId+"']").fadeOut(300).remove();
                $(".col-left").find("div[data-activeid='"+pageId+"']").fadeOut(300).remove();


                $mdDialog.hide();
                setTimeout(function(){ $("#popupContainer").removeClass('filter');},150)
                $("#removeBox").show();
                setTimeout(function() {$("#removeBox").fadeTo(3000).hide();}, 1000);
              }

            }


          }// end for loop
          projectFn.savePageLength(_scope.feedback.leftpages);

        } // end $scope.deleteInProgress

        $scope.close = function() {
          $mdDialog.hide();
          setTimeout(function(){ $("#popupContainer").removeClass('filter');},150)
        }

      },
      templateUrl: './template/page.dialog.tmpl.html',
      parent: $("#main"),
      hideDelay: false
    });





}

});
