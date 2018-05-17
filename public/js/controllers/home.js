const app = angular.module('smcNodeApp', []);
app.controller("homeCtrl",function($scope){
    
    console.log("Home is Linked");
    
    $scope.para = function(){
        $('.parallax').parallax();
    }

    $(document).ready(function(){   
        if (document.getElementById('map-canvas')){
            var myLatlng = new google.maps.LatLng(13.2199425, 74.81826780000006);
            var mapOptions = {
                zoom: 17,
                center: myLatlng,
                mapTypeId: google.maps.MapTypeId.HYBRID,
                labels : true
            };
            var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
            var marker = new google.maps.Marker({
                position:new google.maps.LatLng(13.2199425, 74.81826780000006),
                animation: google.maps.Animation.BOUNCE
            });
            marker.setMap(map);
        }

        var elem = document.querySelector('.sidenav');
        var instance = new M.Sidenav(elem, {
            edge : "left",
            draggable : true
        });
        $('.slider').slider({
            indicators : false,
            interval : 15000,
            height : 450
        });

        $('#testimonialSlider').slider({
            indicators : false,
            interval : 6000,
            height : 400
        });

        $('.parallax').parallax();
        
        $("#preloaderScreen").fadeOut("slow");
        
        $('.carousel.carousel-slider').carousel({
            fullWidth: true,
            indicators: true
        });

        $('.counter').each(function() {
            var $this = $(this),
                countTo = $this.attr('data-count');
            $({ countNum: $this.text()}).animate({
                countNum: countTo
            },
            {
                duration: 8000,
                easing:'linear',
                step: function() {
                    $this.text(Math.floor(this.countNum));
                },
                complete: function() {
                    $this.text(this.countNum);
                        //alert('finished');
                }
            });  
        })

        $('.tooltipped').tooltip();

    })

    $scope.HomePageInfo = [
    {
        icon : "local_library",
        title : "Mission",
        description : "St. Mary’s College, Shirva strives to train rural youth to meet global challenges through effective classroom lessons coupled with capability building programmes."
    },
    {
        icon : "remove_red_eye",
        title : "Vision",
        description : "Reaching quality higher education to rural doorsteps has always been out vision and we work hard so that our vision turn to what we have always expected it to be"
    },
    {
        icon : "check_box",
        title : "Objective",
        description : "Student competency improvement, Pursuing inclusive growth paradigm, Value inculcation, Sensitising students  to socio-economic and cultural issues"
    }
    ];

    $scope.testimonials = [
        { 
            name : "Velan Salis",
            description : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque eget facilisis enim. Suspendisse gravida auctor lectus, vel pretium ante semper eget. Nulla pulvinar gravida eros, eu dignissim dui interdum id. Fusce et pulvinar leo. Nulla consequat dapibus tortor. Curabitur imperdiet lobortis massa in tempus. Mauris eu mauris a dolor iaculis pretium at nec tellus. Ut tempor massa est. Aliquam dictum rhoncus sagittis. Etiam malesuada nec dui nec finibus. Maecenas ut porta enim, a fermentum risus. Suspendisse volutpat pretium dapibus.",
            url : "testimonials/test1.jpg",
            designation : "Student"
        },{ 
            name : "Ashwath Prabhu",
            description : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque eget facilisis enim. Suspendisse gravida auctor lectus, vel pretium ante semper eget. Nulla pulvinar gravida eros, eu dignissim dui interdum id. Fusce et pulvinar leo. Nulla consequat dapibus tortor. Curabitur imperdiet lobortis massa in tempus. Mauris eu mauris a dolor iaculis pretium at nec tellus. Ut tempor massa est. Aliquam dictum rhoncus sagittis. Etiam malesuada nec dui nec finibus. Maecenas ut porta enim, a fermentum risus. Suspendisse volutpat pretium dapibus.",
            url : "testimonials/test1.jpg",
            designation : "Student"
        },{ 
            name : "Jeffrey Cardoza",
            description : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque eget facilisis enim. Suspendisse gravida auctor lectus, vel pretium ante semper eget. Nulla pulvinar gravida eros, eu dignissim dui interdum id. Fusce et pulvinar leo. Nulla consequat dapibus tortor. Curabitur imperdiet lobortis massa in tempus. Mauris eu mauris a dolor iaculis pretium at nec tellus. Ut tempor massa est. Aliquam dictum rhoncus sagittis. Etiam malesuada nec dui nec finibus. Maecenas ut porta enim, a fermentum risus. Suspendisse volutpat pretium dapibus.",
            url : "testimonials/test1.jpg",
            designation : "Student"
        },{ 
            name : "Shawn Mathias",
            description : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque eget facilisis enim. Suspendisse gravida auctor lectus, vel pretium ante semper eget. Nulla pulvinar gravida eros, eu dignissim dui interdum id. Fusce et pulvinar leo. Nulla consequat dapibus tortor. Curabitur imperdiet lobortis massa in tempus. Mauris eu mauris a dolor iaculis pretium at nec tellus. Ut tempor massa est. Aliquam dictum rhoncus sagittis. Etiam malesuada nec dui nec finibus. Maecenas ut porta enim, a fermentum risus. Suspendisse volutpat pretium dapibus.",
            url : "testimonials/test1.jpg",
            designation : "Student"
        }
    ]

    $(window).scroll(function(){
        if($(this).scrollTop() > $(document).height() - ( $(window).height() * 2.7 ) ){
            $(".fixed-action-btn").fadeIn("slow");
            console.log("Touched",$(document).height(),$(window).height());
        }
        else{
            $(".fixed-action-btn").fadeOut("slow");
        }
    })

    $scope.scrollUp = function(){
        $('html, body').animate({scrollTop: 0}, 2000);
    }

});