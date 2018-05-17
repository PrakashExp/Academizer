const app = angular.module('smcNodeApp', ['angularMoment','angularUtils.directives.dirPagination']);
app.controller("departmentsCtrl",function($scope,$http){
    
    $(document).ready(function(){
        $('.slider').slider({
            indicators : false
        });
        $('.modal').modal({
            opacity : 0.9
        });
        $('.collapsible').collapsible();
        $('.scrollspy').scrollSpy();
        $('.dropdown-trigger').dropdown({
            hover : true,
            constrainWidth : false
        });
        $('.tooltipped').tooltip();
        $("#preloaderScreen").fadeOut("slow");
        $("#facultyHolder").hide();
        $("#newsHolder").hide();
        $("#galleryHolder").hide();
        $("#basicHolder").hide();
    });

    var navelem = document.querySelector('.sidenav');
    var navBar = new M.Sidenav(navelem, {
        edge : "left",
        draggable : true
    });

    console.log("Departments Linked");
    function fetchBasicDetails(name){
        var data = {
    		deptName : name
    	};
        $("#basicHolder").fadeIn("slow");
    	$http.post("/fetchSelectedDept",data).then(function(response){
    		$scope.deptDetails = response.data.data;
    	},function(response){
    		$scope.deptDetails = [];
    	});
    }

    function fetchFacultyDetails(name){
    	var data = {
    		deptName : name
    	};
        $("#facultyHolder").fadeIn("slow");
    	$http.post("/getFacultyInfo", data).then(function(response){
    		$scope.facultyList = response.data.content;
            $(".facultyScroll").show();
    	},function(response){
    		$scope.facultyList = [];
            $(".facultyScroll").hide();
    	});
    }

    function fetchNewsDetails(name){
    	var data = {
            dept : name
        };
        $("#newsHolder").fadeIn("slow");
        $http.post("/getNews", data).then(function(response){
            $scope.newsList = response.data.data;
            $(".newsScroll").show();
        },function(response){
            $scope.newsList = [];
            $(".newsScroll").hide();
        });
    }

    function fetchAlbumDetails(name){
    	var data = {
            dept : name
        };
        $("#galleryHolder").fadeIn("slow");
        $http.post("/getGallery", data).then(function(response){
            $scope.galleryList = response.data.data;
            console.log(response);
            $("#preloaderScreen").fadeOut("slow");
            $(".galleryScroll").show();
        },function(response){
            $scope.galleryList = [];
            $(".galleryScroll").hide();
            $("#preloaderScreen").fadeOut("slow");
        });
    }

    $scope.fetchDeptDetails = function(name){
        $("#preloaderScreen").fadeIn();
        $("#infoDetails").hide("slow");
        $("#rightInfo").fadeOut("slow");
        $("#scrollspyRef").fadeIn("slow");
         navBar.close();
    	fetchBasicDetails(name);
    	fetchFacultyDetails(name);
    	fetchNewsDetails(name);
    	fetchAlbumDetails(name);
    }

    function fetchIndex(){
    	$http.post("/fetchDepartments").then(function(response){
    		$scope.deptIndex = response.data.data;
    	},function(response){
            
    	});
    }
    fetchIndex();

    var presentGalleryIndex;

    $scope.showImage = function(name){
        presentGallery = name.photos;
        $scope.galleryphoto = name.photos;
        $scope.largephoto = name.photos[0];
        $("#photoGalleryPlugin").fadeIn("slow");
    }

    $scope.largeImageShow = function(photo){
        $scope.largephoto = photo;
        console.log(photo);
    }

    $scope.hideImage = function(){
        $("#photoGalleryPlugin").fadeOut("slow");   
    }

    $scope.slidesLoaded = function(){
        $('.slider').slider({
            height : 300,
            interval : 4000000
        });
    }

    $scope.facultyModal = function(faculty){
        //console.log(faculty);
        $scope.modalFacultyImage = faculty.image;
        $scope.modalFacultyName = faculty.name;
        $scope.modalFacultyDescription = faculty.description;
        $scope.modalFacultydoj = faculty.doj;
        $scope.modalFacultyqual = faculty.qualification;
        $scope.modalFacultydesig = faculty.designation;
        if(faculty.achievement == null || faculty.achievement == undefined){
            $("#noAchShow").show();
            $("#achievementPanel").hide();
            $scope.achievementList = [];
            $scope.modalAchievement = "Achievements";
            $scope.modalAchDescription = "No Achievements are being Updated for now!";
        }
        else{
            $("#noAchShow").hide();
            $("#achievementPanel").show();
            $scope.achievementList = faculty.achievement;
            $scope.modalAchievement = faculty.achievement[0].achCat;
            $scope.modalAchDescription = faculty.achievement[0].achDesc;
        }
        $(".basicFacultyDetails").show();
        $("#achievementPanel").hide();
    }

    $scope.displayAchievement = function(){
        $(".basicFacultyDetails").hide();
        $("#achievementPanel").fadeIn("slow");  
    }

    $scope.hideAchievement = function(){
        $("#achievementPanel").hide();  
        $(".basicFacultyDetails").fadeIn("slow");
    }

    $scope.displayAch = function(ach){
        $scope.modalAchievement = ach.achCat;
        $scope.modalAchDescription = ach.achDesc;
    }

    $scope.carouselFunction = function(){
        $('.carousel.carousel-slider').carousel({
            fullWidth: true,
            indicators: true
        });
        $('.carousel').carousel();
    }

    $scope.scrollspyFunc = function(){
        $('.scrollspy').scrollSpy();
    }

    $scope.displayNews = function(news){
        $scope.modalNewsTitle = news.title;
        $scope.modalNewsDescription = news.description;
        $scope.newsPhotos = news.photos;
        if(news.photos.length <= 0)
            $("#noPicAcknowledgement").show();
        else
            $("#noPicAcknowledgement").hide();
        console.log(news);
    }    

    $scope.showNewsImage = function(){
        $("#newsdescription").hide();
        $("#newsimages").fadeIn("slow");
    }

    $scope.hideNewsImages = function(){
        $("#newsimages").hide();
        $("#newsdescription").fadeIn("slow");
    }
});

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