const app = angular.module('smcNodeApp', []);
app.controller("fecilitiesCtrl",function($scope, $http){
    
    console.log("Fecilities are Linked");
    
    var elem = document.querySelector('.sidenav');
    var instance = new M.Sidenav(elem, {
        edge : "left",
        draggable : true
    });
    
    $(document).ready(function(){
        $(".modal").modal();
        $('.tooltipped').tooltip();
        $("#mainInfo").hide();
        $("#imageInfo").hide();
    })
    
    $http.get("/getGenfacility").then(function(response){
    	console.log(response);
    	$scope.facilityList = response.data.records;
        $("#preloaderScreen").fadeOut("slow");
    },function(response){
    	console.log(response);
        $("#preloaderScreen").fadeOut("slow");
    });

    $scope.fullInfo = function(data){
        $scope.facilityData = [data];
        $scope.facilityPhotos = data.photos;
        $("#mainInfo").fadeIn();
        $("#imageInfo").hide();
    }

    $scope.showImages = function(){
        $("#mainInfo").hide();
        $("#imageInfo").fadeIn();
    }

    $scope.closeImg = function(){
        $("#mainInfo").fadeIn();
        $("#imageInfo").hide();
    }

});