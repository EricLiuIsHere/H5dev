'use strict'
/*
*@ projectService.js 负责提供对项目操作的所有数据接口
-----------------------------------------------------------------------------------------------
*@ projectService.js 提供了与后台交互的数据接口，以及记录当前页面个数动态变化。
-----------------------------------------------------------------------------------------------
*@ 加载图片                  ：var imageActionService = {loadImage:function(){.....}}
*@ 描述                      ：当用户点击新建图片按钮，会从后台db读取当前用户下的所有图片

*@ 添加图片                  ：var imageActionService = {addImage:function(){.....}}
*@ 描述                      ：

*@ 删除图片                  ：var imageActionService = {removeImage:function(){.....}}
*@ 描述                      ：
**/



var project = angular.module('projectService',[]);

project.factory('projectFn',function($http,$q,$timeout,$compile,SERVER_URL,loginFn,pageSettingService){

	  var productUrl                   = SERVER_URL.liveUrl;
	  var copyProject                  = 'copyProject';
	  var editProject                  = 'findProjectById';
    var saveProject                  = 'saveProject';
	  var pageLeftNavObj               = [];
    var findMyProject                = 'findProjectByUser';
    var deletedProject               = 'delProject';
    var projectIdInDashboardService  = [];



    var myProjectAction = {

        saveProjectId:function(projectId){
            projectIdInDashboardService.length = 0;
            projectIdInDashboardService.push(projectId);
        },  
        savePageLength:function(num){
           /*
           *@ 描    述：添加新页面同时调用savePageLength，更新页面存储长度
           *@ 调用位置：homeController.js
           **/
           pageLeftNavObj.length = 0;

            for(var i in num){
                pageLeftNavObj.push({'type':num[i].type,'thumbId':num[i].thumbId});
            }

        },
        saveProject:function(pageLength,projectId,leftCode,editCode,previewCode,projectName){
        	  var userName = loginFn.islogged().email;
           // console.log(userName+':save project')
            var deffered = $q.defer();

            var pageSettingContent   = pageSettingService.getPageSetting();
            console.log(pageSettingService);
            var pageSettingDirection = pageSettingService.direction || 'vertical';

            // console.log('pageSettingContent:'+pageSettingContent)
            // console.log('pageSettingDirection:'+pageSettingDirection)

            // console.log('xxxxxxxxxxxx');
            // console.log(leftCode);
            // console.log('xxxxxxxxxxxx');
            
            $http.post(productUrl+saveProject,{
                'pageLength':pageLength,
                'userName':userName,
                'projectId':projectId,
                'projectName':projectName,
                'pages':{'editCode':editCode,'previewCode':previewCode,'leftCode':leftCode,'pageSetting':{"content":pageSettingContent,"direction":pageSettingDirection}}
            }).success(function(data){
              console.log('page lenthdthe:::'+data.pageLength)
                deffered.resolve(data);
            }).error(function(data){
                deffered.reject(data);
            });
            return deffered.promise;
        },
        addProject:function(projectName,previewCode,editCode,leftCode,projectInfo,userName,pageLengthObj){

          //生成hash
            function makeid(){
                  var text = "";
                  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                  for( var i=0; i < 10; i++ )
                      text += possible.charAt(Math.floor(Math.random() * possible.length));
                  return text;
            } 


           var pageLeftNavObj=[];
           var defaultThumb = makeid();
           var previewCode  = previewCode    || '<div class="swiper-slide isEdit" data-type="page" id="right_1" style="height:100%;"> </div>';
           var editCode     = editCode       || '<i class="icon-move bgAcitve" style="position: absolute;left: 100%;top: 0px;background-color: #eee;width: 20px;height: 20px;padding: 2px;opacity:0;" ng-click="setBackground()"></i><div class="swiper-slide isEdit" data-pageid="'+defaultThumb+'" data-type="page" id="right_1" style="height:100%;direction: ltr;"> </div>';
           var deffered     = $q.defer();
           var userName     = loginFn.islogged().email;



           var pageSettingContent   = pageSettingService.getPageSetting();
           var pageSettingDirection = pageSettingService.direction || 'vertical';

           // console.log('@projectService.js add project Fn  pageLength:'+pageLengthObj)
           // console.log('@projectService.js add project Fn  previewCode:'+previewCode)
           // console.log('@projectService.js add project Fn  userName:'+userName)
           // console.log('@projectService.js add project Fn  projectInfo:'+projectInfo)
           //从dashboard中添加项目需要生成默认thumb id

          // console.log("@projectService.js 从我的项目 添加项目"+pageLengthObj)
           if(!pageLengthObj || pageLengthObj ==  undefined ){
             // console.log("#### add project from dashboard")
              pageLeftNavObj.length =0;
              pageLeftNavObj.push({'type': '1','thumbId':defaultThumb});
             // console.log(pageLeftNavObj.length)
           }else if(pageLengthObj.length == 0){
            //如果当前的page长度为0，进行数组初始化
           // console.log(pageLengthObj.length+":pageLength is 0")
             pageLeftNavObj.push({'type': '1','thumbId':$('.box').data('activeid')})

           //  console.log(pageLeftNavObj.length+":pageLength is 1")
           }else if(pageLengthObj){

            //描    述：重新处理pageLengthObj结构,默认数据结构在mongodb中报错
            //默认结构：pageLengthObj =  $scope.feedback.leftpages

               for(var i in pageLengthObj){
                   pageLeftNavObj.push({'type':pageLengthObj[i].type,'thumbId':pageLengthObj[i].thumbId});
                }


           }

           //console.log('@projectService.js pageLeftNavObj is:'+pageLeftNavObj.length)

           $http.post(productUrl+saveProject,{
                'projectName': projectName,
                'projectInfo': projectInfo,
                'pageLength' : pageLeftNavObj,
                'projectId'  : '',
                'userName'   : userName,
                'pages'      : {'editCode':editCode,'previewCode':previewCode,'leftCode':leftCode,'pageSetting':{"content":pageSettingContent,"direction":pageSettingDirection}}
            }).success(function(data ){
                console.log('duplicated='+data.pageLength);
                if(data.status==0){
                  $('.form-group').eq(0).append('<div class="duplicatedpn" style="color: rgb(244, 67, 54);font-size: 10px;margin-top: 10px;">项目名重复，请重新输入项目名称</div>');
                }
                else{
                  $('.duplicatedpn').remove();
                  deffered.resolve(data);
                }
            }).error(function(data){
                deffered.reject(data)
            });
            return deffered.promise;
        },
        getProjectId:function(){
            return projectIdInDashboardService[0];
        },
        getPageLength:function(){

            return pageLeftNavObj;
        },
    	getProjectList:function(userName){
            var deffered = $q.defer();
            // console.log('@projectService dec:userName is:'+userName);
            // console.log('@projectService dec:url is:'+productUrl+findMyProject);
    		$http({method:"GET",url:productUrl+findMyProject,params:{userName:userName}}).success(function(data){
    			deffered.resolve(data);
    		}).error(function(data){
                deffered.reject(data)
            });
    		return deffered.promise;
    	},
        removeProjectId:function(){
            projectIdInDashboardService.length = 0;
        },
    	deletedProject:function(projectId){
            var deffered = $q.defer();
    		$http({method:"POST",url:productUrl+deletedProject,params:{pid:projectId}}).success(function(data){
                deffered.resolve(data);
    		});
    		return deffered.promise;
    	},
        loadEditPage:function(id,$scope){
            var deffered = $q.defer();
            //projectFn.getPageLength().length = 0;
            $http({method:"GET",url:productUrl+editProject,params:{pid:id}}).success(function(data){
              
               for(var i in data.pageLength){
                console.log("loadEditPage::"+data.pageLength[i].thumbId)
              }
               // $('#sliderDirection').attr('data-direction',data.pages.pageSetting.direction);
               //  pageSettingService.setPageSetting(data.pages.pageSetting.direction);
                // for(var i in data){
                //   console.log(i+":"+data[i])
                // }
                deffered.resolve(data);
                console.log('checko1');
            }).error(function(data){
                deffered.reject(data);
            });
            return deffered.promise;

        },
    	copyProject:function(projectName,projectId){
           // console.log('@projectService.js DEC: projectName:'+projectName+"projectId:"+projectId)
            var deffered = $q.defer()
    	    $http({method:"POST",url:productUrl+copyProject,params:{'pid':projectId,'projectname':projectName}}).success(function(data){
                // for(var i in data){
                //     console.log(i+":"+data[i])
                //     for(var j  in data[i]){
                //         console.log(j+":"+data[j])
                //     }
                // }
                console.log('copyProject:function went through!!!!');
                if(data.status==0){
                  $('.form-group').eq(0).append('<div class="duplicatedpn" style="color: rgb(244, 67, 54);font-size: 10px;margin-top: 10px;">项目名重复，请重新输入项目名称</div>');
                }
                else{
                  $('.duplicatedpn').remove();
                  deffered.resolve(data);
                }
    		}).error(function(data){
                deffered.reject(data);
            });
    		return deffered.promise;
    	}
    };
    return myProjectAction;
});