'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', '$timeout', '$window', 'Authentication', 'Menus',
  function ($scope, $state, $timeout, $window, Authentication, Menus) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;
    $scope.user = Authentication.user;
    $scope.guestZip = '';
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

    //for zip code pop-up
    $scope.modal = document.getElementById('zipModal');

    var signin = document.getElementById('signin');
    var signup = document.getElementById('signup');


    if($scope.user){
      $scope.modal.style.display = 'none';
    }

    $scope.checkZip = function() {
      console.log('in checkZip()');
      if($scope.user.zipcode) {
        console.log('zip code is present');
        $scope.modal.style.display = 'none';
        // console.log(modal.style.display.value);
      }
    };

    // When the user clicks on <span> (x), close the modal
    document.getElementsByClassName('close')[0].onclick = function() {
      $scope.modal.style.display = 'none';
    };

    signin.onclick = function() {
      $scope.modal.style.display = 'none';
    };
    signup.onclick = function() {
      $scope.modal.style.display = 'none';
    };
    document.getElementById('zip-btn').onclick = function() {
      $scope.guestZip = document.getElementById('zipcode').value;
      $scope.modal.style.display = 'none';
    };



    document.getElementById('email').onclick = function gethrefemail()
    {
      document.getElementById('email').href = 'mailto:?Subject=School Notes Magazine&amp;Body=I%20saw%20this%20and%20thought%20of%20you!%20 ' + window.location.href;
    };

    document.getElementById('google').onclick = function gethrefgoogle()
    {
      document.getElementById('google').href = 'https://plus.google.com/share?url='+window.location.href;
    };

    document.getElementById('facebook').onclick = function gethreffacebook()
    {
      document.getElementById('facebook').href = 'http://www.facebook.com/sharer.php?u='+window.location.href;
    };

    document.getElementById('twitter').onclick = function gethreftwitter()
    {
      document.getElementById('twitter').href = 'https://twitter.com/share?url='+window.location.href+'&amp;text=School%20Notes%20Magazine&amp;hashtags=schoolnotesmagazine';
    };

    document.getElementById('linkedin').onclick = function gethreflinkedin()
    {
      document.getElementById('linkedin').href = 'http://www.linkedin.com/shareArticle?mini=true&amp;url='+window.location.href;
    };

    function getJSON(url) {
      var list;
      var xmlHttp;
      var notherlist;
      list = '';
      xmlHttp = new XMLHttpRequest(); // this is a depreciated method, but I can't figure out how to use jquery and it works, so..

      if(xmlHttp !== null || xmlHttp !== undefined)
      {
        xmlHttp.open('GET', url, false);
        xmlHttp.send(null);
        list = xmlHttp.responseText;
      }
      return list;
    }

    $scope.completeSlides = JSON.parse(getJSON('/artworklist'));
    var browserWidth = document.body.clientWidth;
    var numArtWorks = Math.floor(browserWidth / 200); // assuming images take about 200px of space, this is how we find the number we can display.

    $scope.slides = [];

    // TODO here is where we would take the zipcode from the client and compare against the zipcode from the artworks to display only artworks in that area
    if ($scope.completeSlides.length > numArtWorks) {
      $scope.slides = new Array(numArtWorks);

      var visited = [];
      for (var i = 0; i < numArtWorks; i++){
        // randomize
        $scope.slides[i] = $scope.completeSlides[getRandomInt($scope.completeSlides.length)];
      }
    } else {
      $scope.slides = $scope.completeSlides;
    }

    // get a random number within the range, but also check visited numbers so I don't repeat anything
    function getRandomInt(max){
      var rando = Math.floor(Math.random() * max);
      for (var i = 0; i < visited.length; i++){
        if (rando === visited[i]){
          return getRandomInt(max);
        }
      }
      var tempVisits = new Array(visited.length + 1);
      for (var j = 0; j < visited.length; j++){
        tempVisits[j] = visited[j];
      }
      tempVisits[tempVisits.length - 1] = rando;
      visited = tempVisits;
      return rando;
    }


  }
]);
