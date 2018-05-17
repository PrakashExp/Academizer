const app = angular.module('smcNodeApp', ['angularMoment','angularUtils.directives.dirPagination']);
app.controller("alumniCtrl",function($scope,$http){
    console.log("Alumni is Linked");
    var elem = document.querySelector('.sidenav');
    var instance = new M.Sidenav(elem, {
        edge : "left",
        draggable : true
    });
    $('.tooltipped').tooltip();
    $scope.alumniRegister = function(name,address,course,year,occupation,email){
    	var data = {
    		name : name.$viewValue,
	    	address : address.$viewValue,
            year : year.$viewValue,
            course : course.$viewValue,
	    	occupation : occupation.$viewValue,
	    	email : email.$viewValue
    	}
        console.log(data);
    	$http.post("/registerAlumni",data).then(function(response){
    		M.toast({ html : response.data.message });
    	},function(response){
    		M.toast({ html : response.data.message });
    	});
    }

    function getAlumniNotifications(){
        $http.get("/getAlumniNotifications").then(function(response){
            $scope.alumniNotification = response.data.records;
            console.log(response.data.records);
            $("#noNotificationShow").hide("slow");
            $("#preloaderScreen").fadeOut();
            if(response.data.records.length <= 5 ){
                $("#alumniNoteIndicators").hide();
                console.log("Less");
            }
            else{
                $("#alumniNoteIndicators").show();
                console.log("Show");
            }
        },function(response){
            $scope.alumniNotification = [];
            $("#noNotificationShow").show("slow");
            $("#preloaderScreen").fadeOut();
        });
    }

    $scope.shownewsImages = function(data){
        $scope.newsImages = data.photos;
    }

    function getAlumniNews(){
        $http.get("/getAlumniNews").then(function(response){
            console.log(response);
            $scope.alumniNewsArray = response.data.records;
            $("#noNewsShow").hide("slow");
            console.log(response.data.records.length);
            if(response.data.records.length <= 5 ){
                $("#alumniNewsIndicators").hide();
            }
            else{
                $("#alumniNewsIndicators").show();
            }
            $("#preloaderScreen").fadeOut("slow");
        },function(response){
            $scope.alumniNewsArray = [];
            $("#noNewsShow").show("slow")
            $("#preloaderScreen").fadeOut("slow");
        });
    }

    $scope.filterNotification = function(number, order){
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

    getAlumniNews();
    getAlumniNotifications();

    $(document).ready(function(){
    	$('.modal').modal();
        $('ul.tabs').tabs({
            duration : 500
        });
        $('.collapsible').collapsible();
        $('.tooltipped').tooltip();
    })

});