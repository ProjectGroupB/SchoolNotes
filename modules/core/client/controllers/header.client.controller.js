'use strict';
/*
var   ngTouch = require('angular-touch'),
      carousel = require('angular-carousel');
*/

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus', HeaderController]);
//HeaderController.$inject = ['ArtsubmissionsService'];

  function HeaderController($scope, $state, Authentication, Menus) {

    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;

    // Get the topbar menu
    $scope.menu = Menus.getMenu('topbar');

    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });

    document.getElementById("email").onclick = function gethrefemail() {
      document.getElementById("email").href = "mailto:?Subject=School Notes Magazine&amp;Body=I%20saw%20this%20and%20thought%20of%20you!%20 " + window.location.href;
    }

    document.getElementById("google").onclick = function gethrefgoogle() {
      document.getElementById("google").href = "https://plus.google.com/share?url=" + window.location.href;
    }

    document.getElementById("facebook").onclick = function gethreffacebook() {
      document.getElementById("facebook").href = "http://www.facebook.com/sharer.php?u=" + window.location.href;
    }

    document.getElementById("twitter").onclick = function gethreftwitter() {
      document.getElementById("twitter").href = "https://twitter.com/share?url=" + window.location.href + "&amp;text=School%20Notes%20Magazine&amp;hashtags=schoolnotesmagazine";
    }

    document.getElementById("linkedin").onclick = function gethreflinkedin() {
      document.getElementById("linkedin").href = "http://www.linkedin.com/shareArticle?mini=true&amp;url=" + window.location.href;
    }


    var slides = [];//ArtsubmissionsService.query();


    //mongoose.connect(config.db.uri);
    //console.log(slides);
    // TODO read from the artwork database


     // TODO This is likely where I need to pull from tha art submissions thumbnail links and populate the carosel
     $scope.colors = ["#fc0003", "#f70008", "#f2000d", "#ed0012", "#e80017", "#e3001c", "#de0021", "#d90026", "#d4002b", "#cf0030", "#c90036", "#c4003b", "#bf0040", "#ba0045", "#b5004a", "#b0004f", "#ab0054", "#a60059", "#a1005e", "#9c0063", "#960069", "#91006e", "#8c0073", "#870078", "#82007d", "#7d0082", "#780087", "#73008c", "#6e0091", "#690096", "#63009c", "#5e00a1", "#5900a6", "#5400ab", "#4f00b0", "#4a00b5", "#4500ba", "#4000bf", "#3b00c4", "#3600c9", "#3000cf", "#2b00d4", "#2600d9", "#2100de", "#1c00e3", "#1700e8", "#1200ed", "#0d00f2", "#0800f7", "#0300fc"];

     function getSlide(target, style) {
     var i = target.length;
     return {
     id: (i + 1),
     label: 'slide #' + (i + 1),
     img: 'http://lorempixel.com/450/300/' + style + '/' + ((i + 1) % 10) ,
     color: $scope.colors[ (i*10) % $scope.colors.length],
     odd: (i % 2 === 0)
     };
     };

     function addSlide(target, style) {
     target.push(getSlide(target, style));
     };

     $scope.carouselIndex = 5;

     function addSlides(target, style, qty) {
     for (var i=0; i < qty; i++) {
     addSlide(target, style);
     }
     };

     // 3rd ngRepeat demo
     $scope.slides3 = [];
     addSlides($scope.slides3, 'cats', 50);

     //var slideImages = [];


  }
