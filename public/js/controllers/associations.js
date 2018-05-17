const app = angular.module('smcNodeApp', ['angularMoment','angularUtils.directives.dirPagination']);
app.controller("associationsCtrl",function($scope,$http){
    console.log("Associations Linked");
    var elem = document.querySelector('.sidenav');
    var instance = new M.Sidenav(elem, {
        edge : "left",
        draggable : true
    });
    $('.tooltipped').tooltip();
    function fetchIndex(){
    	$http.get("/getAssocList").then(function(response){
    		$scope.assocIndex = response.data.data;
    	},function(response){
    		console.log(response);
    	});
    }

    function getBasic(name){
    	var data = {
    		databaseName : name
    	}
    	$http.post("/getBasic", data).then(function(response){
    		$scope.basicDetails = response.data.data;
    	},function(response){
    		console.log(response);
            $(".baseScroll").hide();
    	});
    }

    function getMembers(name){
    	console.log(name);
    	var data = {
    		dbname : name
    	}
    	$http.post("/getPeople", data).then(function(response){
    		$scope.membersList = response.data.content;
    	},function(response){
    		console.log(response);
            $(".facultyScroll").hide();
    	});
    }

    function getNews(name){
    	console.log(name);
    	var data = {
    		dbname : name
    	}
    	$http.post("/getAssocNews", data).then(function(response){
    		$scope.newsList = response.data.data;
            $("#preloaderScreen").fadeOut("slow");
            $(".newsScroll").show();
    	},function(response){
    		console.log(response);
            $("#preloaderScreen").fadeOut("slow");
            $(".newsScroll").hide();
    	});
    }

    $scope.getAssocDetails = function(name){
    	$("#preloaderScreen").fadeIn("fast");
        $("#firstScreen").hide("slow");
        $("#mainPage").fadeIn();
        getBasic(name);
    	getMembers(name);
    	getNews(name);
        instance.close();
    }

    fetchIndex();

    $scope.showFullNews = function(data){
        $scope.ModalNews = [data];
        console.log($scope.ModalNews);
    }

    $scope.showImg = function(){
        $("#main").hide();
        $("#pics").fadeIn("slow");
    }

    $scope.closeImg = function(){
        $("#main").fadeIn("slow");
        $("#pics").hide();
    }

    $(document).ready(function(){
		$('.slider').slider({
			indicators : false
		});
		$('.sidenav').sidenav();
		$('.modal').modal({
	        opacity : 0.9
	    });
	    $('.collapsible').collapsible();
	    $('.scrollspy').scrollSpy();
	    $('.dropdown-trigger').dropdown({
            hover : true
        });
        $("#mainPage").hide();
        $("#preloaderScreen").fadeOut("slow");
	});

	$scope.scrollfnc = function(){
		$('.scrollspy').scrollSpy();
	}

	$(window).scroll(function(){
	    var currentScroll = $(window).scrollTop();
	    var scrollspyTop = $("#scrollspyRef").offset().top;
	    if (currentScroll >= scrollspyTop) {           
	        $('#scrollspyContent').css({     
	            position: 'fixed',
	            top: '0',
	        });
	    } else {                            
	        $('#scrollspyContent').css({               
	            position: 'relative',
	            top : ""
	        });
	    }
	});
});