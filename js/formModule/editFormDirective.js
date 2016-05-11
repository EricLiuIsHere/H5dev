function showFormEditPanel($mdToast,$document){
	$mdToast.show({
		controller: function($scope){

	  		$scope.$watch("setFormBackgroundColor",function(newValue,oldColor){$('#myForm').css('backgroundColor',newValue);});

			//set form Radius 
			$scope.setFormRadiusSize   = function(){
				$("#myForm").css("borderRadius",$scope.formRadius.size+"px");
			}

			//set form border
			$scope.setFormBorderWidthSize = function(){
				$('#myForm').css('borderWidth',$scope.formBorderWidth.size+"px");
			}


			//set form border style
			$scope.formBorderStyle = [{"formBorderStyle":"none"},{"formBorderStyle":"solid"},{"formBorderStyle":"dotted"},{"formBorderStyle":"double"},{"formBorderStyle":"dashed"}];
			//set FontFamily
			$scope.setFormBorderStyle = function(newStyle){
				$('#myForm').css('border','1px #eeeeee '+newStyle);
				$('#formBorderStyle').html(newStyle);
			}


			//set form border color
			$scope.$watch("setFormBorderColor",function(newColor,oldColor){
				$('#myForm').css('borderColor',newColor);
			});

						
			//set form animate
			$scope.formAnimate = function(){
				//console.log('form works');
				function testAnimation(x){
				    $('#myForm').removeClass().addClass(x + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){ });
				}
				$('#js--formAnimations').change(function(){ var anim = $(this).val()testAnimation(anim); }); 
			}
		},
      	templateUrl: './template/formPropertyPanel.html',
      	parent : $document[0].querySelector('#editModulePosition'),
       	hideDelay: false
	});
}







function createNewForm($mdToast,$document){
	//text link
	var formDiv = $('<form class="form-horizontal ui-selected mForm" id="formContent" style="font-size:10px;"><div class="form-group formElement"><label for="inputEmail3" class="col-sm-2 control-label">Name</label><div class="col-sm-10"><input type="text" class="form-control" id="m1111" placeholder="" name="name"></div></div><div class="form-group formElement"><label for="inputEmail3" class="col-sm-2 control-label">Email</label><div class="col-sm-10"><input type="email" class="form-control" id="m2222" placeholder="" name="email"></div></div><div class="form-group formElement"><label for="inputEmail3" class="col-sm-2 control-label">Address</label><div class="col-sm-10"> <input type="text" class="form-control" id="m3333" placeholder=""></div></div><div class="form-group formElement"><label for="inputEmail3" class="col-sm-2 control-label">Other</label><div class="col-sm-10"><textarea class="form-control formElement" id="m444" name="comments" rows="3"></textarea></div></div><div class="form-group formElement"><div class="col-sm-offset-2 col-sm-10"><div class="checkbox formElement"><label><input type="checkbox" id="m555" name="call me"> Remember me</label></div></div></div><div class="form-group formElement"><div class="col-sm-offset-2 col-sm-10"><button  id="formSubmit" class="btn btn-default">Submit</button></div></div></form>');
	var oDiv = $("<div id='myForm' style='width:90%;'></div>");
	formDiv.appendTo(oDiv);
	oDiv.appendTo($('.isEdit'));
	// initFormDraggable($mdToast,$document);
}


function createInput($mdToast,$document){
	var formInput=$('<div class="form-group ui-state-default" data-type="input"><input type="text"  name="text1" class="form-control"  placeholder="textPlaceholder"></div>');
	formInput.appendTo($('#formContent'));
	initFormDraggable($mdToast,$document);
}

function createTextarea(){
	var formTextarea=$('<div class="form-group ui-state-default" data-type="textarea" ><textarea class="form-control" rows="3"></textarea></div>');
	formTextarea.appendTo($('#formContent'));
}

function createCheckBox(){
	var formCheckbox=$(' <div class="checkbox ui-state-default"  data-type="checkbox"><label><input type="checkbox"> Remember me</label></div>');
	formCheckbox.appendTo($('#formContent'));
}

function createRadioBox(){
	var formRadioBox = $('<div class="radio ui-state-default" data-type="radio" ><label><input type="radio"  checked><span>text placeholder</span></label></div>');
	formRadioBox.appendTo($('#formContent'));
}

function createButton($rootScope){
	var projectIdForMyForm = $('#pagesList').attr('class') == ''? 'projectIdIsActive' : $('#pagesList').attr('class');
	var formButton = $('<div class="form-group ui-state-default" data-type="input"><input id="projectId" type="hidden"  name="projectId" value="'+projectIdForMyForm+'" class="form-control"  placeholder="textPlaceholder"></div>'+'<div class="form-group ui-state-default"  data-type="button"><button type="button" class="btn btn-info" id="formSubmit"><span>text placeholder</span></button></div>');
	formButton.appendTo($('#formContent'));
}





function initFormDraggable($mdToast,$document){
	
	$('#formContent div').on('click',function(event){
         event.stopPropagation();  
        $(".isEdit").css("border","");
        $("#imageSelected").css("border","");
        $("#textSelected").css("border","");              
        $('#selectedFormItem').attr('id','');
        $(this).attr('id','selectedFormItem');
        $(this).css({'border':'#dedede 2px dashed','overflow':'hidden'});

       var theTypeOfSelectedItem = $(this).data('type');
       console.log(theTypeOfSelectedItem+"///"+$(this).attr('type'));
       switch(theTypeOfSelectedItem){
            case "input" :  showInputEditPanel($mdToast,$document);
            break;
            case "textarea": showTextareaEditPanel($mdToast,$document);
            break;
            case "radio":    showRadioEditPanel($mdToast,$document);
            break;
            case "checkbox": showCheckboxEditPanel($mdToast,$document);
            break;
            case "button":   showButtonEditPanel($mdToast,$document);
            break;
       }

	});




	$("#myForm").css({'resize':'both','overflow':'hidden','width':'80%','min-height':'350px','padding':'2%'});
    $('#myForm').on("mouseover",function(){
    	$(this).css('opacity','0.5');
    })
    $('#myForm').on("mouseout",function(){
    	$(this).css('opacity','1');
    })

}




// show button edit panel if button active
function showButtonEditPanel($mdToast,$document){
		$mdToast.show({
	      controller:function(){
	      	//createInput();
	      	if($('#selectedFormItem').length >0){
			$('#selectedFormItem').removeAttr('style');
			$('#selectedFormItem').removeAttr('id');
		}
		$(this).parent().attr('id','selectedFormItem');
		$(this).parent().css({'border':'#dedede 3px dashed','overflow':'hidden'});

 
	    $(function() {
		    $( "#formContent" ).sortable({
		      revert: true
		    });
		});

	      },
	      templateUrl: './template/form.button.tmpl.html',
	      parent : $document[0].querySelector('#editModulePosition'),
	       hideDelay: false
	      // position: $scope.getToastPosition()
		});	
}

// show checkbox edit panel if checkbox active
function showCheckboxEditPanel($mdToast,$document){
		$mdToast.show({
	      controller:function(){
	      	//createInput();
	      	if($('#selectedFormItem').length >0){
			$('#selectedFormItem').removeAttr('style');
			$('#selectedFormItem').removeAttr('id');
		}
		$(this).parent().attr('id','selectedFormItem');
		$(this).parent().css({'border':'#dedede 3px dashed','overflow':'hidden'});

 
	    $(function() {
		    $( "#formContent" ).sortable({
		      revert: true
		    });
		});

	      },
	      templateUrl: './template/form.checkbox.tmpl.html',
	      parent : $document[0].querySelector('#editModulePosition'),
	       hideDelay: false
	      // position: $scope.getToastPosition()
		});	
}






// show radiobox edit panel if radiobox active
function showRadioEditPanel($mdToast,$document){
		$mdToast.show({
	      controller:function(){
	      	//createInput();
	      	if($('#selectedFormItem').length >0){
			$('#selectedFormItem').removeAttr('style');
			$('#selectedFormItem').removeAttr('id');
		}
		$(this).parent().attr('id','selectedFormItem');
		$(this).parent().css({'border':'#dedede 3px dashed','overflow':'hidden'});

 
	    $(function() {
		    $( "#formContent" ).sortable({
		      revert: true
		    });
		});

	      },
	      templateUrl: './template/form.radiobox.tmpl.html',
	      parent : $document[0].querySelector('#editModulePosition'),
	       hideDelay: false
	      // position: $scope.getToastPosition()
		});	
}




// show input edit panel if input active
function showInputEditPanel($mdToast,$document){
	$mdToast.show({
      controller:function($scope,$mdToast,$document){
      	// createInput($mdToast,$document);
      	$scope.$watch('inputLable',function(newValue,oldValue){
      		//$scope.inputLable = newValue;
      		console.log(newValue+"$scope.inputLable");
      	});

      	$scope.$watch('requiredStatus',function(newValue,oldValue){
      		//$scope.requiredStatus = newValue;
      		console.log(newValue+'$scope.requiredStatus')
      	});

      	$scope.$watch('inputType',function(newValue,oldValue){
      		//$scope.inputType = newValue;
      		console.log(newValue+"////")
      	});

      	$scope.createInputFn = function(){
      		var initInput = $('<div class="form-group formElement"><label for="inputEmail3" class="col-sm-2 control-label">'+$scope.inputLable+'</label><div class="col-sm-10"><input readonly type="'+$scope.inputType+'" class="form-control" name="'+$scope.inputLable+'" placeholder=""></div></div>');
      		initInput.appendTo($('#formContent'));
      	} 
      },
      templateUrl: './template/form.input.tmpl.html',
      parent : $document[0].querySelector('#editModulePosition'),
      hideDelay: false
	});	
}

// show textarea edit panel if textarea active
function showTextareaEditPanel($mdToast,$document){
		$mdToast.show({
	      controller:function(){
	      	//createInput();
	      	if($('#selectedFormItem').length >0){
			$('#selectedFormItem').removeAttr('style');
			$('#selectedFormItem').removeAttr('id');
		}
		$(this).parent().parent().attr('id','selectedFormItem');
		$(this).parent().parent().css({'border':'#dedede 3px dashed','overflow':'hidden'});

 
	    $(function() {
		    $( "#formContent" ).sortable({
		      revert: true
		    });
		});

	      },
	      templateUrl: './template/form.textarea.tmpl.html',
	      parent : $document[0].querySelector('#editModulePosition'),
	       hideDelay: false
	      // position: $scope.getToastPosition()
		});	
}

		


			$scope.newGraph = function(){
				$mdToast.show({
			      // controller: 'ToastCtrl',
			      templateUrl: './template/graphPropertyPanel.html',
			      parent : $document[0].querySelector('#editModulePosition'),
			      hideDelay: false
			      // position: $scope.getToastPosition()
			    });
			};



			$scope.newInput = function(){
                showInputEditPanel($mdToast,$document);
				initElement('.formElement','input',$mdToast,$document);
				
			}



			$scope.newTextarea = function(){
				$mdToast.show({
			      controller:function($mdToast,$document){
			      	// createTextarea($mdToast,$document);
			      },
			      templateUrl: './template/form.textarea.tmpl.html',
			      parent : $document[0].querySelector('#editModulePosition'),
			       hideDelay: false
			      // position: $scope.getToastPosition()
			    });	
				
			}



			$scope.newCheckbox = function(){
				$mdToast.show({
			      controller:function($mdToast,$document){
			      	// createCheckBox($mdToast,$document);
			      },
			      templateUrl: './template/form.checkbox.tmpl.html',
			      parent : $document[0].querySelector('#editModulePosition'),
			       hideDelay: false
			      // position: $scope.getToastPosition()
			    });	
			}



			$scope.newRadiobox = function(){
				$mdToast.show({
			      controller:function($mdToast,$document){
			      	// createRadioBox($mdToast,$document);
			      },
			      templateUrl: './template/form.radiobox.tmpl.html',
			      parent : $document[0].querySelector('#editModulePosition'),
			       hideDelay: false
			      // position: $scope.getToastPosition()
			    });					
			}



			$scope.newButton = function(){

				$mdToast.show({
			      controller:function($mdToast,$document,$rootScope){
			      	// createButton($mdToast,$document,$rootScope);
			      },
			      templateUrl: './template/form.button.tmpl.html',
			      parent : $document[0].querySelector('#editModulePosition'),
			       hideDelay: false
			      // position: $scope.getToastPosition()
			    });		
			}




			$scope.newForm = function(){
				if($('#formContent').length == 0){
					createNewForm($mdToast,$document);
					initElement('.mForm','form',$mdToast,$document);
			    
				}else{
					initElement('.mForm','form',$mdToast,$document);
			   }
			};
