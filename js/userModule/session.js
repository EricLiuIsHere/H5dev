angular.module('session',[]).service('Session',function(){
	this.create = function(userName,userPhoto){
		this.userName 	= userName;
		this.userPhoto  = userPhoto;
	}
	this.destroy = function(){
		this.userName 	= null;
		this.userPhoto 	= null;
	}
	return this;
});
