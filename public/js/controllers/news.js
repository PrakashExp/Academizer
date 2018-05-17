const app = angular.module('smcNodeApp', ['angularMoment','angularUtils.directives.dirPagination']);
app.controller("newsCtrl",function($scope, $http){
    
    console.log("News are Linked");
    var elem = document.querySelector('.sidenav');
    var instance = new M.Sidenav(elem, {
        edge : "left",
        draggable : true
    });
    
    $(document).ready(function(){
        $('.dropdown-trigger').dropdown();
        $('.slider').slider({
            indicators : false
        });
        $('.modal').modal();
        $('.tooltipped').tooltip();
        $('.tabs').tabs();
        $("#preloaderScreen").fadeOut();
        $('.collapsible').collapsible();
    });

    function getGenNotifications(){
        $http.get("/getGenNotifications").then(function(response){
            $scope.genNotification = response.data.records.reverse();
            console.log(response.data.records);
            $("#noNotificationShow").hide("slow");
        },function(response){
            $scope.alumniNotification = [];
            $("#noNotificationShow").show("slow");
        });
    }

    function getGenNews(){
        $http.get("/getGenNews").then(function(response){
            $scope.genNews = response.data.records.reverse();
            $("#noNewsShow").hide("slow")
            $("#preloaderScreen").fadeOut("slow");
        },function(response){
            $scope.alumniNewsArray = [];
            $("#noNewsShow").show("slow")
            $("#preloaderScreen").fadeOut("slow");
        });
    }

    $scope.showNews = function(data){
        $scope.newsInfo = [data];
        $scope.newsPhoto = data.photos;
        $("#mainInfo").fadeIn();
        $("#imgInfo").hide();
    }

    $scope.showImgModal = function(){
        $("#mainInfo").hide();
        $("#imgInfo").fadeIn();
    }

    $scope.closeImgModal = function(){
        $("#mainInfo").fadeIn();
        $("#imgInfo").hide();
    }

    $scope.filterNotification = function(number, order){
        console.log(number,order);
        if(number == 1){
            if(order == "a")
                $scope.noteOrder = 'notification';
            else
                $scope.noteOrder = '-notification';
        }
        else if( number == 2 ){
            if(order == "a")
                $scope.noteOrder = 'date';
            else
                $scope.noteOrder = '-date';
        }
        else{
            if(order == "a")
                $scope.noteOrder = 'createdAt';
            else
                $scope.noteOrder = '-createdAt';
        }
    }

    $scope.filterNews = function(number, order){
        console.log(number,order);
        if(number == 1){
            if(order == "a")
                $scope.newsOrder = 'title';
            else
                $scope.newsOrder = '-title';
        }
        else if( number == 2 ){
            if(order == "a")
                $scope.newsOrder = 'date';
            else
                $scope.newsOrder = '-date';
        }
        else{
            if(order == "a")
                $scope.newsOrder = 'createdAt';
            else
                $scope.newsOrder = '-createdAt';
        }
    }

    getGenNotifications();
    getGenNews();

});