'use strict';
/*
var   ngTouch = require('angular-touch'),
      carousel = require('angular-carousel');
*/
angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus',
  function ($scope, $state, Authentication, Menus) {
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

    document.getElementById("email").onclick = function gethrefemail()
    {
      document.getElementById("email").href = "mailto:?Subject=School Notes Magazine&amp;Body=I%20saw%20this%20and%20thought%20of%20you!%20 " + window.location.href;
    }

    document.getElementById("google").onclick = function gethrefgoogle()
    {
      document.getElementById("google").href = "https://plus.google.com/share?url="+window.location.href;
    }

    document.getElementById("facebook").onclick = function gethreffacebook()
    {
      document.getElementById("facebook").href = "http://www.facebook.com/sharer.php?u="+window.location.href;
    }

    document.getElementById("twitter").onclick = function gethreftwitter()
    {
      document.getElementById("twitter").href = "https://twitter.com/share?url="+window.location.href+"&amp;text=School%20Notes%20Magazine&amp;hashtags=schoolnotesmagazine";
    }

    document.getElementById("linkedin").onclick = function gethreflinkedin()
    {
      document.getElementById("linkedin").href = "http://www.linkedin.com/shareArticle?mini=true&amp;url="+window.location.href;
    }


    // TODO This is likely where I need to pull from tha art submissions thumbnail links and populate the carosel

  }

]);
