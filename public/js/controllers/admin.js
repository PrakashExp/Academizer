const app = angular.module('smcNodeApp', ['ngFileUpload','angularMoment','angularUtils.directives.dirPagination']);
$('.tooltipped').tooltip();
app.controller("adminCtrl", function($scope,$http){
    
    console.log("Admin . . ");
    
    var elem = document.querySelector('.sidenav');
    var instance = new M.Sidenav(elem, {
        edge : "left",
        draggable : true
    });

    var currentTime = new Date();
    var year = currentTime.getFullYear()
    $scope.alumniYear = year;

    //Navigation Links
    $scope.redirectTo = function(name){
        console.log(name);
        window.location = "/admin/"+name;
        instance.close();
        $("#preloaderScreen").fadeIn(500);
    }

    $scope.logoutAdmin = function(){
        $http.post("/logoutRequest").then(function(response){
            window.location = response.data.url;
        },function(response){
            M.toast({ html : response.data.message });
        });
    }

    $scope.checkPresentPass = function(pass){
        var data = {
            pass : pass.$viewValue
        }
        $http.post("/checkPresentPass", data).then(function(response){
            $("#enterPresentUserBox").hide("slow");
            $("#enterNewUserBox").show("slow");
        },function(response){
            M.toast({ html : response.data.message });
        });
    }

    $scope.changePresentPass = function(user, pass1, pass2){
        if(pass1.$viewValue != pass2.$viewValue){
            M.toast({ html : "Passwords do not Match!" });
            return;
        }
        var data = {
            user : user.$viewValue,
            pass : pass1.$viewValue
        };
        $http.post("/changePresentPass", data).then(function(response){
            M.toast({ html : response.data.message });
        },function(response){
            M.toast({ html : response.data.message });
        });
    }

    $scope.getAlumniIDDetails = function(id){
        var data = {
            id : id.$viewValue
        }
        $http.post("/getAlumniIDDetails", data).then(function(response){
            $('#alumniIDDetailModal').modal('open');
            M.toast({ html : "Alumni Details Fetched !" });
            $scope.alumniIDBind = response.data.records;
        },function(response){
            M.toast({ html : "There is No Alumni Registered with this Unique ID" })
        });
    }

    $scope.printDiv = function(){
        var divElements = document.getElementById("alumniIDDetailModal").innerHTML;
        var oldPage = document.body.innerHTML;
        document.body.innerHTML = 
          "<html><head><title></title></head><body>" + 
          divElements + "</body>";
        window.print();
        document.body.innerHTML = oldPage;
        location.reload();
    }

    function getroha(){
        $http.get("/getROHA").then(function(response){
            $scope.rohaclist = response.data.records;
        },function(response){
            $scope.rohaclist = [];
        });
    }

    function getrohs(){
        $http.get("/getROHS").then(function(response){
            $scope.rohsplist = response.data.records;
        },function(response){
            $scope.rohsplist = [];
        });
    }

    function getEssentialDetails(){
        $http.post("/fetchDepartments").then(function(response){
            console.log(response.data.data.length);
            $scope.departmentCount = response.data.data.length;
        },function(response){
            console.log(response);
        });
        $http.get("/getAlumniList").then(function(response){
            console.log(response.data.records.length);
            console.log(response);
            $scope.alumniCount = response.data.records.length;
        },function(response){
            console.log(response);
            scope.alumniCount = 0;
        });
        $http.get("/getAssocList").then(function(response){
            console.log(response.data.data.length);
            $scope.associationCount = response.data.data.length;
            $("#preloaderScreen").fadeOut("slow");
        },function(response){
            console.log(response);
            $scope.associationCount = 0;
            $("#preloaderScreen").fadeOut("slow");
        });
        getroha();
        getrohs();
    }

    $scope.submitROHA = function(name, event, year, level){
        var data = {
            name : name.$viewValue,
            event : event.$viewValue,
            year : year.$viewValue,
            level : level.$viewValue
        }
        $http.post("/addROHA", data).then(function(response){
            getroha();
        },function(response){
            getroha();
            M.toast({ html : "There was an error!" });
        });
    }

    $scope.submitROHS = function(name, event, year, level){
        var data = {
            name : name.$viewValue,
            event : event.$viewValue,
            year : year.$viewValue,
            level : level.$viewValue
        }
        console.log("ROHS", data);
        $http.post("/addROHS", data).then(function(response){
            getrohs();
            M.toast({ html : response.data.message })
        },function(response){
            getrohs();
            M.toast({ html : "There was an error!" });
        });
    }

    $scope.bindRohaDetails = function(roh){
        console.log(roh);
        $scope.editRohaID = roh._id;
        $scope.editROHName = roh.name;
        $scope.editROHEvent = roh.event;
        $scope.editROHLevel = roh.level;
        $scope.editROHYear = roh.year;
    }

    $scope.bindRohsDetails = function(roh){
        console.log(roh);
        $scope.editRohsID = roh._id;
        $scope.editROHSName = roh.name;
        $scope.editROHSEvent = roh.event;
        $scope.editROHSLevel = roh.level;
        $scope.editROHSYear = roh.year;
    }

    $scope.editROHA = function(id,name,event,year,level){
        var data = {
            id : id.$viewValue,
            name : name.$viewValue,
            event : event.$viewValue,
            year : year.$viewValue,
            level : level.$viewValue
        }
        $http.post("/editROHA", data).then(function(response){
            $(".modal").modal("close");
            console.log(response);
            M.toast({ html : response.data.message });
            getroha();
        },function(response){
            console.log(response);
            M.toast({ html : "There was an error !" });
            getroha();
        });
    }

    $scope.editROHS = function(id,name,event,year,level){
        var data = {
            id : id.$viewValue,
            name : name.$viewValue,
            event : event.$viewValue,
            year : year.$viewValue,
            level : level.$viewValue
        }
        $http.post("/editROHS", data).then(function(response){
            $(".modal").modal("close");
            console.log(response);
            M.toast({ html : response.data.message });
            getrohs();
        },function(response){
            console.log(response);
            M.toast({ html : "There was an error !" });
            getrohs();
        });
    }

    $scope.deleteRohs = function(id){
        var data = {
            id : id.$viewValue
        }
        $http.post("/deleteRohs", data).then(function(response){
            $(".modal").modal("close");
            console.log(response);
            M.toast({ html : response.data.message });
            getrohs();
        },function(response){
            console.log(response);
            M.toast({ html : "There was an error !" });
            getROHS();
        });
    }

    $scope.deleteRoha = function(id){
        var data = {
            id : id.$viewValue
        }
        $http.post("/deleteRoha", data).then(function(response){
            $(".modal").modal("close");
            console.log(response);
            M.toast({ html : response.data.message });
            getroha();
        },function(response){
            console.log(response);
            M.toast({ html : "There was an error !" });
            getroha();
        });
    }

    $('.modal').modal();
    $('.collapsible').collapsible();
    getEssentialDetails();

});

app.controller("adminDeptCtrl",function($scope,$http, Upload){
    console.log("Linked");

    //Scroll Functions
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

        $scope.sliderLoaded = function(){
            $('.slider').slider({
                interval : 1200000
            });
        }

        $scope.facDatepicker = function(){
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1; //January is 0!
            var yyyy = today.getFullYear();
             if(dd<10){
                    dd='0'+dd
                } 
                if(mm<10){
                    mm='0'+mm
                } 

            today = yyyy+'-'+mm+'-'+dd;
            $(".facDatepicker").attr(
                "max",today
            );
        }

    //Pre Functions
        fetchDepartments();

    //Creating a Department
        $scope.createDept = function(name,desc){
            $scope.deptNameValue = "";
            $('#textarea1').val('');
            M.textareaAutoResize($('#textarea1'));
            $("#createDeptLoader").show("slow");
            var data = {
                deptName : name.$viewValue,
                deptDesc : desc.$viewValue,
                nameInDb : name.$viewValue.replace(/\s/g, "")
            }
            $http.post("/createDepartment", data).then(function(response){
                M.toast({ html : response.data.message});
                fetchDepartments();
                $("#createDeptLoader").hide(2000);
            },function(response){
                console.log(response.data.message);
            });
        }

    //Fetching the Department list
        function fetchDepartments(){
            $http.post("/fetchDepartments").then(function(response){
                $("#noDeptShow").hide("slow");
                $scope.deptNames = response.data.data;
                //$scope.showDeptDetails(response.data.data[0].nameInDb);
            },function(response){
                $("#noDeptShow").show("slow");
                $scope.deptNames = [];
            });
        }

    //Fetching the Entire Faculty List
        function fetchFaculty(deptName){
            var data = {
                deptName : deptName
            };
            $http.post("/getFacultyInfo", data).then(function(response){
                $scope.faculties = response.data.content;
                $("#noFacultyShow").hide("slow");
                //$scope.achArray = response.data.content;
            },function(response){
                $("#noFacultyShow").show("slow");
                $scope.faculties = [];
            });
        }

        $scope.sortFaculty = function(number){
            if( number == 1 ){
                console.log("Latest");
                var faculty = $scope.faculties;
                $scope.faculties = faculty.reverse();
            }   
            else if( number == 2 ){
                console.log("Old");
                fetchFaculty($scope.deptNameToBeBound);
            }
            else{
                console.log($scope.faculties);
            }
        }

        function fetchGallery(deptName){
            var data = {
                dept : deptName
            }
            $http.post("/getGallery",data).then(function(response){
                $scope.albums = response.data.data;
                $("#noGalleryShow").hide("slow");
                console.log(response.data);
                $("#preloaderScreen").fadeOut("slow");
            },function(response){
                console.log(response);
                $("#noGalleryShow").show("slow");
                $scope.albums = [];
                $("#preloaderScreen").fadeOut("slow");
            });
        }

    //Fetching The news from Department
        function fetchNews(){
            var deptName = returnSelectedDept();
            var data = {
                dept : deptName
            };
            $http.post("/getNews", data).then(function(response){
                $scope.newsArray = response.data.data;
                console.log(response);
                $("#noNewsShow").hide("slow");
            },function(response){
                $("#noNewsShow").show("slow");
                $scope.newsArray = [];
            });
        }

    //Saving the Department for Sending
        function saveSelectedDept(name){
            $scope.deptNameToBeBound = name;
        }

    //Returning Department for Retrieval
        function returnSelectedDept(){
            return $scope.deptNameToBeBound;
        }

    //Saving other infom=rmation
        $scope.saveOtherInfo = function(name){
            $scope.otherNamesToBeBound = name;
        }

    //Save other information function method
        function saveOtherInfo(name){
            $scope.otherNamesToBeBound = name;
        }

    //Returning other information
        function returnOtherInfo(){
            return $scope.otherNamesToBeBound;
        }

    //Binding Department details
        $scope.editDeptPreFunction = function(dept){
            saveSelectedDept(dept.nameInDb);
            console.log(dept);
            $scope.editDeptName = dept.name;
            $scope.editDeptDesc = dept.description;
            $scope.high1 = dept.highlights[0];
            $scope.high2 = dept.highlights[1];
            $scope.high3 = dept.highlights[2];
            M.updateTextFields();
        }

    //Binding Faculty info
        $scope.bindFacultyInfo = function(data){
            saveOtherInfo(data._id);
            console.log(data);
            $scope.editFacultyName = data.name;
            $scope.editFacultyDesc = data.description;
            $scope.editFacultyQual = data.qualification;
            $scope.editFacultyDesig = data.designation;
            $scope.editFacultyDoj = new Date(data.doj);
        }

    //Showing Department Details which is selected in the left side
        $scope.showDeptDetails = function(deptName){
            var data = {
                deptName : deptName
            }
            saveSelectedDept(deptName);
            fetchFaculty(deptName);
            fetchGallery(deptName);
            fetchNews();
            $http.post("/fetchSelectedDept",data).then(function(response){
                console.log(response.data.data)
                $scope.deptDetails = response.data.data;
                $("#basicHolder").hide();
                $("#facultyHolder").hide();
                $("#newsHolder").hide();
                $("#photoGallery").hide();
                $("#basicHolder").fadeIn("slow");
                $("#facultyHolder").fadeIn("slow");
                $("#newsHolder").fadeIn("slow");
                $("#scrollspyContent").fadeIn("slow");
                $("#photoGallery").fadeIn("slow");
                $("#feature1").hide();
                //$('html, body').animate({scrollTop: 140}, 2000);
            },function(response){
                console.log(response);
            });
        }

    //Delete Selected Department
        $scope.deleteDept = function(){
            var data = {
                deptName : $scope.deptNameToBeBound
            };
            $http.post("/deleteSelectedDept",data).then(function(response){
                console.log(response);
                location.reload();
            },function(response){
                console.log(response);
                fetchDepartments();
            });
        }

        $scope.fac = function(){
            M.updateTextFields();
        }

    //Editing the Selected Department
        $scope.editSelectedDept = function(name, desc, high1, high2, high3){
            if( high1.$viewValue == undefined || high1.$viewValue == null )
                high1.$viewValue = "";
            if( high2.$viewValue == undefined || high2.$viewValue == null )
                high2.$viewValue = "";
            if( high3.$viewValue == undefined || high3.$viewValue == null )
                high3.$viewValue = "";
            var data = {
                deptName : $scope.deptNameToBeBound,
                newDeptDesc : desc.$viewValue,
                high1 : high1.$viewValue,
                high2 : high2.$viewValue,
                high3 : high3.$viewValue
            }
            console.log(name, desc, high1, high2, high3);
            console.log(data);
            $http.post("/editSelectedDept",data).then(function(response){
                $scope.showDeptDetails(returnSelectedDept());
            },function(response){
                M.toast({ html : "There was an errror!!" });
            });                    
        }

    //Adding Faculty
        $scope.addFaculty = function(name, desc, qual, desig, doj){
            var data = {
                name : name.$viewValue,
                desc : desc.$viewValue,
                qual : qual .$viewValue,
                desig : desig.$viewValue,
                doj : doj.$viewValue,
                dept : $scope.deptNameToBeBound
            }
            $("#facultyLoader").show("slow");
            $http.post("/addFaculty",data).then(function(response){
                M.toast({ html : response.data.message, displayLength : 1000});
                fetchFaculty(returnSelectedDept())
                $("#facultyLoader").hide("slow");
            },function(response){
                M.toast({ html : response.data.message, displayLength : 1000});
                $("#facultyLoader").hide("slow");
            });
        }

    //Deleting the Faculty
        $scope.deleteFaculty = function(id){
            var data = {
                id : id,
                dept : returnSelectedDept()
            }
            $http.post("/deleteFaculty", data).then(function(response){
                console.log(response.data);
                fetchFaculty(returnSelectedDept());
                if( response.data.lastRecord )
                    location.reload();
            },function(response){ 
                console.log(response);
            });
        }

    //Editing the Faculty
        $scope.editFacultyInfo = function(name, desc, qual, desig, doj){
            var data = {
                name : name.$viewValue,
                desc : desc.$viewValue,
                qualification : qual.$viewValue,
                designation : desig.$viewValue,
                date : doj.$viewValue,
                id : returnOtherInfo(),
                dept : returnSelectedDept()
            };
            $http.post("/updateFaculty",data).then(function(response){
                M.toast({ html : "Faculty information Successfully Updated", displayLength : 1000  });
                fetchFaculty(returnSelectedDept());
                $(".modal").modal("close");
            },function(response){
                console.log(response);
            });
        }

    //Uploading the Faculty Images
        $scope.upload = function(file,id){
            var data = {
                "myImage" : file, 
                id :  id,
                dept : returnSelectedDept()
            };
            Upload.upload({url : '/uploadFacultyImg', data}).then(function (resp) {
                M.toast({ html : resp.data.message, displayLength : 1000 });
                console.log(resp);
                //location.reload();
                fetchFaculty(returnSelectedDept());
            }, function (resp) {
                M.toast({ html : resp.data.message, displayLength : 1000 });
                console.log(resp);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.myImage.name);
                console.log(evt);
            });
        }

    //Add Faculty Achievement
        $scope.addAch = function(title, desc){
            var descArray = desc.$viewValue;
            var data = {
                title : title.$viewValue,
                desc : descArray,
                id : returnOtherInfo(),
                dept : returnSelectedDept() 
            }
            $http.post("/addAchievement",data).then(function(response){
                fetchFaculty(returnSelectedDept());
            },function(response){
                M.toast("There was an Error");
            });
        }

    //Delete Faculty Achievement
        $scope.deleteAch = function(achTitle, index){
            var data = {
                title : achTitle,
                id : returnOtherInfo(),
                dept : returnSelectedDept()
            }
            $http.post("/deleteAchievement", data).then(function(response){
                fetchFaculty(returnSelectedDept());
            },function(response){
                M.toast({html : "There was an Error"});
            });
        }

    //Binding Achievement to text field
        $scope.bindEditAch = function(title,desc){
            $scope.facAchTitle = title;
            $scope.facAchDesc = desc;
        }

    //Adding News
    $scope.addNews = function(title,desc){
        var data = {
            title : title.$viewValue,
            desc : desc.$viewValue,
            dept : returnSelectedDept()
        };
        $("#newsLoader").show();
        console.log(data);
        $http.post("/addNews",data).then(function(response){
            fetchNews();
            $("#newsLoader").hide("slow");
        },function(response){
            M.toast({ html : "There was an Error" })
            $("#newsLoader").hide("slow");
        });
    }

    //Deleting News
    $scope.deleteNews = function(id){
        var data = {
            id : id,
            dept : returnSelectedDept()
        }
        $http.post("/deleteNews",data).then(function(response){
            console.log(response);
            if( response.data.lastRecord )
                location.reload();
            else
                fetchNews();
        },function(response){
            console.log(response);
            M.toast({ html : "There was an Error!" })
        });
    }

    //Uploading News Photos
    $scope.submit = function() {
        if ($scope.form.newsImg.$valid && $scope.newsImg) {
            $scope.uploadNewsImg($scope.newsImg);
            console.log($scope.newsImg);
            console.log($scope.form.newsImg);
        }
    };
    $scope.uploadNewsImg = function(file,id){
        var data = {
            "myImage" : file, 
            id :  id,
            dept : returnSelectedDept()
        };
        console.log(data);
        Upload.upload({url : '/uploadNewsImg', data}).then(function (resp) {
            M.toast({ html : "Image Successfully Uploaded", displayLength : 800 });
            fetchNews(returnSelectedDept());
        }, function (resp) {
            M.toast({ html : "There was an Error!", displayLength : 1000 });
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.myImage.name);
            console.log(evt);
        });
    }

    //Delete News Images
    $scope.deleteNewsImg = function(name,id){
        var data = {
            id : id,
            dept : returnSelectedDept(),
            name : name
        }
        console.log(data);
        $http.post("/deleteNewsImage", data).then(function(response){
            fetchNews();
        },function(response){
            M.toast({ html : "There was an Error!" })
        });
    }

    $scope.editBindNews = function(name, desc, id){
        $scope.editNewsTitle = name;
        $scope.editNewsDesc = desc;
        saveOtherInfo(id);
    }

    $scope.editDeptNews = function(title, desc){
        var title = title.$viewValue;
        var desc = desc.$viewValue;
        var data = {
            title : title,
            desc : desc,
            id : returnOtherInfo(),
            dept : returnSelectedDept()
        };
        $http.post("/editNews",data).then(function(response){
            fetchNews();
        },function(response){
            M.toast({ html : "There was an Error!" })
        })
    }

    $scope.addAlbum = function(name){  
        var albumName = name.$viewValue;
        var data = {
            name : albumName,
            dept : returnSelectedDept()
        };
        console.log()
        $http.post("/addAlbum",data).then(function(response){
            fetchGallery(returnSelectedDept());
        },function(response){
            console.log(response);
        });
    
    }

    $scope.deleteAlbum = function(id){
        var id = id;
        var data = {
            id : id,
            dept : returnSelectedDept()
        };
        $http.post("/deleteAlbum",data).then(function(response){
            fetchGallery(returnSelectedDept());
            M.toast({html : "Gallery Successfully Deleted", displayLength : 1000});
            if( response.data.lastRecord )
                location.reload();
        },function(response){
            fetchGallery(returnSelectedDept());
            M.toast({html : "There was an Error!", displayLength : 1000});
        });
    }

    $scope.uploadGalleryImg = function(photo, id){
        var data = {
            "myImage" : photo, 
            id :  id,
            dept : returnSelectedDept()
        };
        console.log(data);
        Upload.upload({url : '/uploadGalleryImg', data}).then(function (resp) {
            M.toast({ html : "Image Successfully Uploaded", displayLength : 800 });
            fetchGallery(returnSelectedDept());
        }, function (resp) {
            M.toast({ html : "There was an Error!", displayLength : 1000 });
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.myImage.name);
            console.log(evt);
        });   
    }

    $scope.deleteGalleryImg = function(name, id){
        var data = {
            id : id,
            dept : returnSelectedDept(),
            name : name
        }
        console.log(data);
        $http.post("/deleteGalleryImage", data).then(function(response){
            fetchGallery(returnSelectedDept());
        },function(response){
            M.toast({ html : "There was an Error!" })
        });   
    }

    $(document).ready(function() {

        //Initialization
            $('input#input_text, textarea#textarea1').characterCounter();
            $('.modal').modal();
            $("#facultyHolder").hide();
            $("#basicHolder").hide();
            $("#newsHolder").hide();
            $("#photoGallery").hide();
            $("#scrollspyContent").hide(); 
            $("#facultyLoader").hide();
            $("#newsLoader").hide();
            $("#photoGalleryLoader").hide();
            $('.carousel').carousel();
            $('.dropdown-trigger').dropdown();
            $("#preloaderScreen").fadeOut("slow");

        //Collapsible
            $('.collapsible').collapsible();

        //DatePicker
            $(document).ready(function(){
                $('.datepicker').datepicker();
            });

        //Scrollspy
            $('.scrollspy').scrollSpy({
                activeClass : "active",
                scrollOffset : 400
            });
        
        //Navigation Bar
            var elem = document.querySelector('.sidenav');
            var instance = new M.Sidenav(elem, {
                edge : "left",
                draggable : true
            });
        
        //Navigation Links
            $scope.redirectTo = function(name){
                window.location = "/admin/"+name;
                instance.close();
                $("#preloaderScreen").fadeIn(500);
            }
    });
});

app.controller("adminAlumniCtrl", function($scope,$http,Upload){
    //Navigation Bar
    var elem = document.querySelector('.sidenav');
    var instance = new M.Sidenav(elem, {
        edge : "left",
        draggable : true
    });

    //Navigation Links
    $scope.redirectTo = function(name){
        window.location = "/admin/"+name;
        instance.close();
        $("#preloaderScreen").fadeIn(500);
    }

    $scope.datePick = function(){
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
         if(dd<10){
                dd='0'+dd
            } 
            if(mm<10){
                mm='0'+mm
            } 
        today = yyyy+'-'+mm+'-'+dd;
        $(".noteDateId").attr(
            "min",today
        );
        $(".newsDateId").attr(
            "max",today
        );
    }

    function getAlumniRequests(){
        $http.get("/getAlumniRequest").then(function(response){
            $scope.requestList = response.data.data;
            $("#noReqShow").hide();
        },function(response){
            $("#noReqShow").show("slow");
            $scope.requestList = [];
        });
    }

    function getAlumniList(){
        $http.get("/getAlumniList").then(function(response){
            $scope.alumniList = response.data.records;
            console.log(response.data);
            $("#noAlumniShow").hide();
        },function(response){
            $scope.alumniList = [];
            $("#noAlumniShow").show("slow");
        });
    }

    function getAlumniNotifications(){
        $http.get("/getAlumniNotifications").then(function(response){
            $scope.alumniNotification = response.data.records.reverse();
            $("#noNotificationShow").hide("slow");
        },function(response){
            $scope.alumniNotification = [];
            $("#noNotificationShow").show("slow");
        });
    }

    function getAlumniNews(){
        $http.get("/getAlumniNews").then(function(response){
            $scope.alumniNewsArray = response.data.records.reverse();
            $("#noNewsShow").hide("slow")
            $("#preloaderScreen").fadeOut("slow");
        },function(response){
            $scope.alumniNewsArray = [];
            $("#noNewsShow").show("slow")
            $("#preloaderScreen").fadeOut("slow");
        });
    }

    $scope.respondRequest = function(id,response){
        var data = {
            id : id,
            response : response
        };
        $http.post("/respondAlumniRequest", data).then(function(response){
            M.toast({ html : response.data.message });
            getAlumniRequests();
            getAlumniList();
            $(".modal").modal("close");
        },function(response){
            M.toast({ html : response.data.message });
            getAlumniRequests();
            getAlumniList();
            $(".modal").modal("close");
        });
    }

    $scope.bindNewsImages = function(data){
        console.log(data);
        $scope.newsImgId = data._id;
        $scope.newsImages = data.photos
    }

    $scope.uploadAlumniNewsImg = function(file){
        var data = {
            "myImage" : file, 
            id :  $scope.newsImgId
        };
        console.log(data);
        Upload.upload({url : '/uploadAlumniNewsImg', data}).then(function (resp) {
            M.toast({ html : resp.data.message, displayLength : 1000 });
            console.log(resp);
            getAlumniNews();
            $(".modal").modal("close");
        }, function (resp) {
            M.toast({ html : resp.data.message, displayLength : 1000 });
            getAlumniNews();
            $(".modal").modal("close");
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.myImage.name);
        });
    }

    $scope.deleteAlumniNewsImage = function(name){
        var data = {
            title : name,
            id :  $scope.newsImgId
        };
        $http.post("/deleteAlumniNewsImage", data).then(function(response){
            getAlumniNews();
            $(".modal").modal("close");
            M.toast({ html : response.data.message, displayLength : 1000 });
        },function(response){
            getAlumniNews();
            $(".modal").modal("close");
            M.toast({ html : response.data.message, displayLength : 1000 });
        })
    }

    $scope.displayAboutAlumni = function(data){
        console.log(data);
        $scope.selectedAlumni = [data];
        $scope.editName = data.name;
        $scope.editAddress = data.address;
        $scope.editOccupation = data.occupation;
        $scope.editDesignation = data.designation;
        $scope.edyear = data.batchOfYear;
        $scope.edcourse = data.course;
    }

    $scope.bindData = function(data){
        $scope.alumniArray = [data];
    }

    $scope.openDeleteAck = function(content){
        $("#mainBlock").hide("slow");
        $("#deleteAcknowledgement").show("slow");
    }

    $scope.closeDelAck = function(){
        $("#mainBlock").show("slow");
        $("#deleteAcknowledgement").hide("slow");
    }

    $scope.deleteAlumni = function(){
        var data = {
            id : $scope.selectedAlumni[0]._id
        };
        $http.post("/deleteSelectedAlumni", data).then(function(response){
            console.log(response);
            getAlumniRequests();
            getAlumniList();
            $(".modal").modal("close");
        },function(response){
            console.log(response);
            getAlumniRequests();
            getAlumniList();
            $(".modal").modal("close");
        });
    }

    $scope.openEditPanel = function(){
        $("#mainBlock").hide("slow");
        $("#editPanel").show("slow");
    }

    $scope.closeEditPanel = function(){
        $("#mainBlock").show("slow");
        $("#editPanel").hide("slow");
    }

    $scope.editSelectedAlumni = function(name,address,occupation,designation,batch,year){
        var name = name.$viewValue;
        var address = address.$viewValue;
        var occupation = occupation.$viewValue;
        var designation = designation.$viewValue;
        if(document.getElementById("patreon").checked)
            var type = "Patreon";
        else
            var type = "Life Member";
        var data = {
            id : $scope.selectedAlumni[0]._id,
            name : name,
            address : address,
            occupation : occupation,
            designation : designation,
            typeOfAlumni : type,
            batchOfYear : year.$viewValue,
            course : batch.$viewValue
        }
        console.log(data);
        $http.post("/editSelectedAlumni",data).then(function(response){
            getAlumniRequests();
            getAlumniList();
            M.toast({
                html : response.data.message
            });
            $(".modal").modal("close");
        },function(response){
            getAlumniRequests();
            getAlumniList();
            M.toast({
                html : response.data.message
            });
            $(".modal").modal("close");
        });
    }

    $scope.upload = function(file,id){
        var data = {
            "myImage" : file, 
            id :  id
        };
        Upload.upload({url : '/uploadAlumniImg', data}).then(function (resp) {
            M.toast({ html : resp.data.message, displayLength : 1000 });
            console.log(resp);
            getAlumniRequests();
            getAlumniList();
            location.reload();
        }, function (resp) {
            M.toast({ html : resp.data.message, displayLength : 1000 });
            getAlumniRequests();
            getAlumniList();
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.myImage.name);
        });
    }

    $scope.addAlumniNotification = function(notification,date){
        var data = {
            note : notification.$viewValue,
            date : date.$viewValue
        }
        $http.post("/addAlumniNotification", data).then(function(response){
            getAlumniNotifications();
            $scope.notification = "";
            $scope.noteDate = "";
        },function(response){
            M.toast({ html : "There was an Error!" });
        });
    }

    $scope.deleteAlumniNotification = function(id){
        var data = {
            id : id._id
        };
        $http.post("/deleteAlumniNotification", data).then(function(response){
            getAlumniNotifications();
        },function(response){
            M.toast({ html : "There was an Error!" });
        });
    }

    $scope.bindToEdit = function(data){
        $scope.id = data._id;
        $scope.editNotif = data.notification;
        $scope.noteEditDate = new Date(data.date);
    }
    
    $scope.editAlumniNotification = function(id, note, date){
        var data = {
            id : id.$viewValue,
            note : note.$viewValue,
            date : date.$viewValue
        }
        console.log(data);
        $http.post("/editAlumniNotification", data).then(function(response){
            getAlumniNotifications();
            $(".modal").modal('close');
        },function(response){
            M.toast({ html : "There was an Error!" });
            $(".modal").modal('close');
        });
    }

    $scope.addAlumniNews = function(title, desc, date){
        var data = {
            title : title.$viewValue,
            desc : desc.$viewValue,
            date : date.$viewValue
        }
        console.log(data);
        $http.post("/addAlumniNews", data).then(function(response){
            getAlumniNews();
            $scope.alumniNewsTitle = "";
            $scope.alumniNewsDesc = "";
            $scope.newsDate = "";
        },function(response){
            M.toast({ html : "There was an error!" });
        });
    }

    $scope.deleteAlumniNews = function(id){
        var data = {
            id : id
        }
        $http.post("/deleteAlumniNews", data).then(function(response){
            getAlumniNews();
        },function(response){
            M.toast({ html : "There was an error!" });
        });
    }

    $scope.bindToEditNews = function(data){
        console.log(data);
        $scope.newsid = data._id;
        $scope.editNewsTitleF = data.title;
        $scope.editNewsDescF = data.description;
        $scope.noteEditDate = new Date(data.date);
    }

    $scope.editAlumniNews = function(id, title, desc, date){
        if(id.$viewValue == null){
            M.toast({ html : "Id is not defined" });
            console.log(id);
            return;
        }
        var data = {
            id  : id.$viewValue,
            title : title.$viewValue,
            desc : desc.$viewValue,
            date : date.$viewValue
        }
        console.log(data);
        $http.post("/editAlumniNews", data).then(function(response){
            getAlumniNews();
            $(".modal").modal('close');
        },function(response){
            M.toast({ html : "There was an error!" });
            $(".modal").modal('close');
        });
    }

    $scope.alumniRegister = function(name,add,occ,email,course,year){
        var data = {
            name : name.$viewValue,
            add : add.$viewValue,
            occ : occ.$viewValue,
            email : email.$viewValue,
            year : year.$viewValue,
            course : course.$viewValue
        }
        console.log(data);
        $http.post("/addAlumni", data).then(function(response){
            getAlumniList();
            $scope.name = "";
            $scope.address = "";
            $scope.occupation = "";
            $scope.email = "";
            M.toast({ html : "Alumni Successfully Added!" });
        },function(response){
            getAlumniList();
            M.toast({ html : response.data.message });
        });
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

    getAlumniRequests();
    getAlumniList();
    getAlumniNotifications();
    getAlumniNews();

    $(document).ready(function(){
        $(".modal").modal();
        $('ul.tabs').tabs();
        $('.tooltipped').tooltip();
        $('.collapsible').collapsible();
    })
});

app.controller("adminNewsCtrl", function($scope,$http,Upload){
    console.log("Opening News Panel . . .");
    //Navigation Bar
    var elem = document.querySelector('.sidenav');
    var instance = new M.Sidenav(elem, {
        edge : "left",
        draggable : true
    });

    //Navigation Links
    $scope.redirectTo = function(name){
        window.location = "/admin/"+name;
        instance.close();
        $("#preloaderScreen").fadeIn(500);
    }

    function getGenNotifications(){
        $http.get("/getGenNotifications").then(function(response){
            $scope.alumniNotification = response.data.records.reverse();
            $("#noNotificationShow").hide("slow");
        },function(response){
            $scope.alumniNotification = [];
            $("#noNotificationShow").show("slow");
        });
    }

    function getGenNews(){
        $http.get("/getGenNews").then(function(response){
            $scope.alumniNewsArray = response.data.records.reverse();
            $("#noNewsShow").hide("slow")
            $("#preloaderScreen").fadeOut("slow");
        },function(response){
            $scope.alumniNewsArray = [];
            $("#noNewsShow").show("slow")
            $("#preloaderScreen").fadeOut("slow");
        });
    }

    $scope.addGenNotification = function(notification,date){
        var data = {
            note : notification.$viewValue,
            date : date.$viewValue
        }
        $http.post("/addGenNotification", data).then(function(response){
            getGenNotifications();
            $scope.notification = "";
            $scope.noteDate = "";
            M.toast({ html : response.data.message });
        },function(response){
            M.toast({ html : response.data.message });
        });
    }

    $scope.deleteAlumniNotification = function(id){
        var data = {
            id : id._id
        };
        $http.post("/deleteGenNotification", data).then(function(response){
            getGenNotifications();
            M.toast({ html : response.data.message });
        },function(response){
            M.toast({ html : "There was an Error!" });
        });
    }

    $scope.bindToEdit = function(data){
        $scope.id = data._id;
        $scope.editNotif = data.notification;
        $scope.noteEditDate = new Date(data.date);
    }
    
    $scope.editGenNotification = function(id, note, date){
        var data = {
            id : id.$viewValue,
            note : note.$viewValue,
            date : date.$viewValue
        }
        console.log(data);
        $http.post("/editGenNotification", data).then(function(response){
            getGenNotifications();
            $(".modal").modal('close');
        },function(response){
            M.toast({ html : "There was an Error!" });
            $(".modal").modal('close');
        });
    }

    $scope.addGenNews = function(title, desc, date){
        var data = {
            title : title.$viewValue,
            desc : desc.$viewValue,
            date : date.$viewValue
        }
        console.log(data);
        $http.post("/addGenNews", data).then(function(response){
            getGenNews();
            $scope.alumniNewsTitle = "";
            $scope.alumniNewsDesc = "";
            $scope.newsDate = "";
            M.toast({ html : response.data.message });
        },function(response){
            M.toast({ html : "There was an error!" });
        });
    }

    $scope.deleteGenNews = function(id){
        var data = {
            id : id
        }
        $http.post("/deleteGenNews", data).then(function(response){
            getGenNews();
        },function(response){
            M.toast({ html : "There was an error!" });
        });
    }

    $scope.bindToEditNews = function(data){
        console.log(data);
        $scope.newsid = data._id;
        $scope.editNewsTitleF = data.title;
        $scope.editNewsDescF = data.description;
        $scope.noteEditDate = new Date(data.date);
    }

    $scope.editGenNews = function(id, title, desc, date){
        if(id.$viewValue == null){
            M.toast({ html : "Id is not defined" });
            console.log(id);
            return;
        }
        var data = {
            id  : id.$viewValue,
            title : title.$viewValue,
            desc : desc.$viewValue,
            date : date.$viewValue
        }
        console.log(data);
        $http.post("/editGenNews", data).then(function(response){
            getGenNews();
            $(".modal").modal('close');
        },function(response){
            M.toast({ html : "There was an error!" });
            $(".modal").modal('close');
        });
    }

    $scope.upload = function(file){
        var data = {
            "myImage" : file, 
            id :  $scope.newsImgId
        };
        console.log(data);
        Upload.upload({url : '/uploadGenNewsImg', data}).then(function (resp) {
            M.toast({ html : resp.data.message, displayLength : 1000 });
            console.log(resp);
            //location.reload();
            getGenNews();
            $(".modal").modal("close");
        }, function (resp) {
            M.toast({ html : resp.data.message, displayLength : 1000 });
            console.log(resp);
            getGenNews();
            $(".modal").modal("close");
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.myImage.name);
            console.log(evt);
        });
    }

    $scope.showImg = function(data){
        $scope.newsImgId = data._id;
        $scope.newsImages = data.photos;
    }

    $scope.deleteImage = function(image){
        var data = {
            title : image,
            id :  $scope.newsImgId
        }
        console.log(data);
        $http.post("/deleteGenNewsImg", data).then(function(response){
            console.log(response);
            getGenNews();
            $(".modal").modal("close");
            M.toast({ html : response.data.message, displayLength : 1000 });
        },function(response){
            console.log(response);
            getGenNews();
            $(".modal").modal("close");
            M.toast({ html : response.data.message, displayLength : 1000 });
        })
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

    $(document).ready(function(){
        $(".modal").modal();
        $('ul.tabs').tabs();
        $('.tooltipped').tooltip();
        $('.collapsible').collapsible();
    })

    $scope.facDatepicker = function(){
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
         if(dd<10){
                dd='0'+dd
            } 
            if(mm<10){
                mm='0'+mm
            } 

        today = yyyy+'-'+mm+'-'+dd;
        $(".facDatepicker").attr(
            "max",today
        );
    }

});

app.controller("adminFacilityCtrl", function($scope,$http,Upload){
    console.log("Opening Facility Panel . . . ");
    //Navigation Bar
    var elem = document.querySelector('.sidenav');
    var instance = new M.Sidenav(elem, {
        edge : "left",
        draggable : true
    });

    //Navigation Links
    $scope.redirectTo = function(name){
        console.log(name);
        window.location = "/admin/"+name;
        instance.close();
        $("#preloaderScreen").fadeIn(500);
    }

    function getGenFacility(){
        $http.get("/getGenFacility").then(function(response){
            $scope.facilityDetail = response.data.records;
            $("#preloaderScreen").fadeOut("slow");
        },function(response){
            $scope.facilityDetail = [];
            $("#preloaderScreen").fadeOut("slow");
        })
    }

    $scope.addGenFacility = function(title, description){
        var data = {
            title : title.$viewValue,
            desc : description.$viewValue
        }
        console.log(data);
        $http.post("/addGenFacility", data).then(function(response){
            console.log(response);
            getGenFacility();
        },function(response){
            M.toast({ html : "There was an Error adding !" });
            getGenFacility();
            console.log(response);
        });
    }

    $scope.deleteGenFacility = function(id){
        var data = {
            id : id
        };
        console.log(id);
        $http.post("/deleteGenFacility", data).then(function(response){
            getGenFacility();
        },function(response){
            M.toast({ html : "There was an Error Deleting !" });
            getGenFacility();
        });
    }

    $scope.bindEditFacility = function(data){
        $scope.editid = data._id;
        $scope.edittitle = data.title;
        $scope.editdescription = data.description;
    }

    $scope.editGenFacility = function(title, description, id){
        if(title.$viewValue == null || description.$viewValue == null || id.$viewValue == null ){
            M.toast({ html : "Null Values arent allowed" });
            return;
        }
        var data = {
            id : id.$viewValue,
            title : title.$viewValue,
            desc : description.$viewValue
        }
        console.log(data);
        $http.post("/editGenfacility", data).then(function(response){
            getGenFacility();
            $('.modal').modal('close');
        },function(response){
            M.toast({ html : "There was an Error Editing !" });
            $('.modal').modal('close');
            getGenFacility();
        });
    }

    $scope.upload = function(file,id){
        var data = {
            "myImage" : file, 
            id :  $scope.valuetoBind
        };
        Upload.upload({url : '/uploadGenfacilityImg', data}).then(function (resp) {
            M.toast({ html : resp.data.message, displayLength : 1000 });
            getGenFacility();
            $('.modal').modal('close');
        }, function (resp) {
            M.toast({ html : resp.data.message, displayLength : 1000 });
            console.log(resp);
            getGenFacility();
            $('.modal').modal('close');
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.myImage.name);
            console.log(evt);
        });
    }

    $scope.showPics = function(pics, id){
        $scope.facilityModalPhotos = pics;
        $scope.valuetoBind = id;
        console.log(pics,id);
        if(pics.length < 0){
            $("#noPicAcknowledgement").show("slow");
        }
    }

    $scope.closeModal = function(){
        $("#facilityDescriptions").show("slow");
        $("#facilityPhotoDiv").hide("slow");
    }

    $scope.deletefacilityImage = function(img){
        var data = {
            photo : img,
            id : $scope.valuetoBind
        }
        console.log(data);
        $http.post("/deleteGenfacilityImage", data).then(function(response){
            getGenFacility();
            $('.modal').modal('close');
            M.toast({ html : "Successfully Deleted !" });
        },function(response){
            M.toast({ html : "There was an Error Deleting !" });
            getGenFacility();
            $('.modal').modal('close');
            M.toast({ html : "Successfully Deleted !" });
        });
    }

    getGenFacility();
    
    $(document).ready(function(){
        $('.modal').modal();
    })
    

});

app.controller("adminAssociationCtrl", function($scope, $http, Upload){
    console.log("Opening Association Panel. . . ");
    //Navigation Bar
    var elem = document.querySelector('.sidenav');
    var instance = new M.Sidenav(elem, {
        edge : "left",
        draggable : true
    });

    $(document).ready(function(){
        $("#preloaderScreen").fadeOut("slow");
        $(".modal").modal();
        $('.collapsible').collapsible();
    })
    
    //Navigation Links
    $scope.redirectTo = function(name){
        window.location = "/admin/"+name;
        instance.close();
        $("#preloaderScreen").fadeIn(500);
    }

    function getAssocList(){
        $http.get("/getAssocList").then(function(response){
            $scope.assoclist = response.data.data;
            //$scope.showSelectedAssoc(response.data.data[0]);
        },function(response){
            $scope.assoclist = [];
            $(".noAssocAdded").show("slow");
        });
    }

    function getBasic(name){
        var data = {
            databaseName : name
        }
        console.log(name);
        $http.post("/getBasic",data).then(function(response){
            console.log(response);
            $scope.basicAssoc = response.data.data;
            $(".basicHide").fadeIn("slow");
            $(".facultyHide").fadeIn("slow");
            $(".newsHide").fadeIn("slow");
        },function(response){
            $scope.basicAssoc = [];
            $(".basicHide").fadeOut("slow");
            $(".facultyHide").fadeOut("slow");
            $(".newsHide").fadeOut("slow");
        });
    }

    function getPeople(name){
        var data = {
            dbname : name
        }
        $http.post("/getPeople",data).then(function(response){
            $scope.assocMembers = response.data.content;
            
        },function(response){
            $scope.assocMembers = [];
        });
    }

    function getNews(name){
        var data = {
            dbname : name
        }
        $http.post("/getAssocNews",data).then(function(response){
            $scope.newsList = response.data.data;
            $("#preloaderScreen").fadeOut("slow");
        },function(response){
            $scope.newsList = [];
            $("#preloaderScreen").fadeOut("slow");
        });
    }

    $scope.createAssociation = function(name,desc){
        var data = {
            name : name.$viewValue,
            desc : desc.$viewValue,
            nameInDb : name.$viewValue.replace(/\s/g, "")
        }
        console.log(data);
        $http.post("/createAssoc", data).then(function(response){
            getAssocList();
            M.toast({ html : response.data.message });
        },function(response){
            getAssocList();
            M.toast({ html : "There was an Error!" });
        });
    }

    $scope.showSelectedAssoc = function(data){
        $("#preloaderScreen").fadeIn("fast");
        $(".noAssocAdded").hide("slow");
        getBasic(data.nameInDb);
        getPeople(data.nameInDb);
        getNews(data.nameInDb);
        $scope.bindData(data.nameInDb);
    }

    $scope.editAssocBind = function(data){
        console.log(data);
        $scope.modalBind = data.nameInDb;
        $scope.editAssocName = data.name;
        $scope.editAssocDesc = data.description;
    }

    $scope.editAssociation = function(name,desc){
        var data = {
            desc : desc.$viewValue,
            nameInDb : $scope.modalBind
        }
        console.log(data);
        $http.post("/editAssoc", data).then(function(response){
            $(".modal").modal("close");
            M.toast({ html : response.data.message });
            getBasic(response.data.dbname);
        },function(response){
            $(".modal").modal("close");
            M.toast({ html : response.data.message });
            getBasic(response.data.dbname);
        });
    }

    $scope.bindData = function(data){
        $scope.modalBind = data;
        console.log(data, "is bound")
    }

    $scope.deleteAssoc = function(){
        var data = {
            dbname : $scope.modalBind
        }
        $http.post("/deleteAssoc", data).then(function(response){
            getAssocList();
            $scope.showSelectedAssoc($scope.modalBind);
        },function(response){
            getAssocList();
            $scope.showSelectedAssoc($scope.modalBind);
        })
    }

    $scope.addAssocMember = function(name, designation){
        var data = {
            name : name.$viewValue,
            desig : designation.$viewValue,
            dbname : $scope.modalBind
        }
        console.log(data);
        $http.post("/addAssocMember", data).then(function(response){
            console.log(response);
            getPeople($scope.modalBind);
            M.toast({ html : response.data.message });
        },function(response){
            console.log(response);
            getPeople($scope.modalBind);
            M.toast({ html : response.data.message });
        });
    }

    $scope.bindMember = function(data){
        console.log(data);
        $scope.boundData = [data];
        $scope.boundid = data._id;
        $scope.editMemberName = data.name;
        $scope.editMemberDesig = data.designation;
    }

    $scope.editMember = function(id,name, designation){
        var data = {
            id : id,
            name : name.$viewValue,
            desig : designation.$viewValue,
            dbname : $scope.modalBind
        }
        console.log(data);
        $http.post("/editAssocMember", data).then(function(response){
            getPeople($scope.modalBind);
            $(".modal").modal("close");
            M.toast({ html : response.data.message });
        },function(response){
            getPeople($scope.modalBind);
            $(".modal").modal("close");
            M.toast({ html : "There was an error !" });
        });
    }

    $scope.deleteMember = function(id){
        var data = {
            id : id,
            dbname : $scope.modalBind
        }
        $http.post("/deleteMember", data).then(function(response){
            console.log(response);
            getPeople($scope.modalBind);
            $(".modal").modal("close");
            M.toast({ html : response.data.message });
        },function(response){
            console.log(response);
            getPeople($scope.modalBind);
            $(".modal").modal("close");
            M.toast({ html : response.data.message });
        });
    }

    $scope.uploadMember = function(file,id){
        var data = {
            "myImage" : file, 
            id : id,
            dbname : $scope.modalBind
        };
        console.log(data);
        Upload.upload({url : '/uploadMemberImg', data}).then(function (resp) {
            console.log(resp);
            getPeople($scope.modalBind);
            $(".modal").modal("close");
            M.toast({ html : resp.data.message });
        }, function (resp) {
            console.log(resp);
            getPeople($scope.modalBind);
            $(".modal").modal("close");
            M.toast({ html : resp.data.message });
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.myImage.name);
            console.log(evt);
        });
    }

    $scope.addAssocNews = function(title, desc){
        var data = {
            title : title.$viewValue,
            desc : desc.$viewValue,
            dbname : $scope.modalBind
        }
        console.log(data);
        $http.post("/addAssocNews", data).then(function(response){
            getNews($scope.modalBind);
            M.toast({ html : response.data.message });
        },function(response){
            getNews($scope.modalBind);
            M.toast({ html : response.data.message });
        });
    }

    $scope.deleteAssocNews = function(id){
        var data = {
            id : id,
            dbname : $scope.modalBind
        };
        $http.post("/deleteAssocNews",data).then(function(response){
            getNews($scope.modalBind);
            M.toast({ html : response.data.message });
        },function(response){
            M.toast({ html : response.data.message });
            getNews($scope.modalBind);
        });
    }

    $scope.bindEditNews = function(data){
        console.log(data);
        $scope.editid = data._id;
        $scope.edittitle = data.title;
        $scope.editdescription = data.description;
    }

    $scope.editGenNews = function(title,description,id){
        var data = {
            title : title.$viewValue,
            desc : description.$viewValue,
            id : id.$viewValue,
            dbname : $scope.modalBind
        }
        $http.post("/editAssocNews", data).then(function(response){
            getNews($scope.modalBind);
            M.toast({ html : response.data.message });
            $(".modal").modal("close");
        },function(response){
            getNews($scope.modalBind);
            M.toast({ html : response.data.message });
            $(".modal").modal("close");
        });
    }

    $scope.upload = function(file,id){
        var data = {
            "myImage" : file, 
            id :  $scope.valuetoBind,
            dbname : $scope.modalBind
        };
        console.log(data);
        Upload.upload({url : '/uploadAssocNewsImg', data}).then(function (resp) {
            M.toast({ html : resp.data.message, displayLength : 1000 });
            getNews($scope.modalBind);
            $('.modal').modal('close');
        }, function (resp) {
            M.toast({ html : resp.data.message, displayLength : 1000 });
            console.log(resp);
            getNews($scope.modalBind);
            $('.modal').modal('close');
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.myImage.name);
            console.log(evt);
        });
    }

    $scope.showPics = function(pics,id){
        $scope.newsModalPhotos = pics;
        $scope.valuetoBind = id;
        console.log(pics,id);
        // $("#newsDescriptions").hide("slow");
        // $("#newsPhotoDiv").show("slow");
        if(pics.length == 0){
            console.log("No images");
            $("#noPicAcknowledgement").show();
        }
        else{
            $("#noPicAcknowledgement").hide();
        }   
    }

    $scope.deleteNewsImage = function(img){
        var data = {
            photo : img,
            id : $scope.valuetoBind,
            dbname : $scope.modalBind
        }
        console.log(data);
        $http.post("/deleteAssocNewsImage", data).then(function(response){
            M.toast({ html : "Successfully deleted" });
            getNews($scope.modalBind);
            $(".modal").modal('close');
        },function(response){
            M.toast({ html : "There was an Error Deleting !" });
            getNews($scope.modalBind);
        });
    }

    getAssocList();

});

app.controller("errorPageCtrl", function(){
    $("#errorContainer").height($(window).height());
})

app.controller("maintenancePageCtrl", function(){
    $("#errorContainer").height($(window).height());
})
