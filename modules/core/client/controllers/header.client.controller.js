'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus',
  function ($scope, $state, Authentication, Menus) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;
    $scope.user = Authentication.user;
    $scope.guestZip = '';
    //console.log($state.testData);
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


    //$scope.getArtworkList();
    //$scope.artworkList = Authentication.query();
    //console.log($scope.artworklist);
    //console.log(module.exports.getArtworkList());
    //building a temp array to get the slideshow working
    $scope.slide1 = {
      id: '58cd710a4613b078365c9802',
      image: 'modules/artsubmissions/client/img/6_13_1.png'
    };
    $scope.slide2 = {
      id: '58cd730d7ca3839b36efb515',
      image: 'modules/artsubmissions/client/img/6_13_4.png'
    };
    $scope.slide3 = {
      id: '58cdb7a3435faa44378a0c2e',
      image: 'modules/artsubmissions/client/img/6_18_Screen Shot 2017-02-20 at 5.28.17 PM.png'
    };
    $scope.slide4 = {
      id: '58cdbb3a435faa44378a0c2f',
      image: 'modules/artsubmissions/client/img/6_18_1.png'
    };

    $scope.slides = new Array(4);
    $scope.slides[0] = $scope.slide1;
    $scope.slides[1] = $scope.slide2;
    $scope.slides[3] = $scope.slide3;
    $scope.slides[4] = $scope.slide4;
  }
]);
