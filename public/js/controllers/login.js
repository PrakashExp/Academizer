const app = angular.module('smcNodeApp', []);
app.controller("loginCtrl",function($scope, $http){
    
    console.log("Login page is loading. . . ");

    $("#loginContainer").height($(window).height());
    $("#preloader").fadeOut(1200);
    $("#loginBlock").slideDown(1000);
    $scope.loginCheck = function(user,pass){
    	var data = {
    		username : user.$viewValue,
    		password : pass.$viewValue
    	}
    	console.log(data);
    	$http.post("/loginRequest", data).then(function(response){
    		window.location = response.data.url;
    	},function(response){
    		M.toast({ html : response.data.message });
    	});
    }

});