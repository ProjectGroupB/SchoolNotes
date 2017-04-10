(function () {
  'use strict';
  // word search variables
  // Games controller
  angular
      .module('games')
      .controller('GamesController', GamesController)
      .directive('fileModel', fileModel);

  fileModel.$inject = ['$parse'];

  function fileModel($parse){
      return{
          restrict:'A',
          link: function(scope, element, attrs) {
              var parsedFile = $parse(attrs.fileModel);
              var parsedFileSetter = parsedFile.assign;

              element.bind('change', function() {
                  scope.$apply(function () {
                      parsedFileSetter(scope, element[0].files[0]);
                  });
              });
          }
      };
  }

  GamesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'gameResolve', '$timeout', '$http'];

  function GamesController ($scope, $state, $window, Authentication, game, $timeout, $http) {
    // var vm = this;
    // vm.authentication = Authentication;
    // vm.game = game;
    // vm.error = null;
    // vm.form = {};
    // vm.remove = remove;
    // vm.save = save;

    $scope.authentication = Authentication;
    $scope.game = game;
    $scope.error = null;
    $scope.form = {};
    $scope.remove = remove;
    $scope.save = save;

    var upload = function(file){
        var fd = new FormData();
        fd.append('myfile', file.upload);
        return $http.post('api/games/', fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        });
    };


    $scope.file = {};

    $scope.uploadSubmit = function () {
        $scope.uploading = true;
        upload($scope.file).then(function (data) {
            if(data.data.success) {
                $scope.uploading = false;
                $scope.alert = 'alert alert-success';
                $scope.message = data.data.message;
                $scope.file = {};
            } else {
                $scope.uploading = false;
                $scope.alert = 'alert alert-danger';
                $scope.message = data.data.message;
                $scope.file = {};
            }
        });
    };

    $scope.photoChanged = function (files) {
        if (files.length > 0 && files[0].name.match(/\.(png|jpg|jpeg|pdf)$/)) {
            $scope.uploading = true;
            var file = files[0];
            var fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = function (e) {
                $timeout(function () {
                    $scope.thumbnail = {};
                    $scope.thumbnail = e.target.result;
                    var day = new Date();
                    var d = day.getDay();
                    var h = day.getHours();
                    $scope.game.thumbnail = 'modules/games/client/img/' + d + '_' + h + '_' + files[0].name;
                    $scope.uploading = false;
                    $scope.message = false;
                });
            };
        } else {
            $scope.thumbnail = {};
            $scope.message = false;
        }
    };

      // Remove existing game
      function remove() {
          if ($window.confirm('Are you sure you want to delete?')) {
              $scope.game.$remove($state.go('games.list'));
          }
      }

      // Save game
      function save(isValid) {
          if (!isValid) {
              $scope.$broadcast('show-errors-check-validity', '$scope.form.gameForm');
              return false;
          }

          // TODO: move create/update logic to service
          if ($scope.game._id) {
              $scope.game.$update(successCallback, errorCallback);
          } else {
              $scope.game.$save(successCallback, errorCallback);
          }

          function successCallback(res) {
              $state.go('games.view', {
                  gameId: res._id
              });
          }

          function errorCallback(res) {
              $scope.error = res.data.message;
          }
      }

      /*
          vm.scrambleNames = [{
            name: 'word1' },{
            name: 'word2' },{
            name: 'word3' },{
            name: 'word4' },{
            name: 'word5' },{
            name: 'word6' },{
            name: 'word7' },{
            name: 'word8' },{
            name: 'word9' },{
            name: 'word10' },{
            name: 'word11' },{
            name: 'word12' },{
            name: 'word13' },{
            name: 'word14' },{
            name: 'word15' },{
            name: 'word16' },{
            name: 'word17' },{
            name: 'word18' },{
            name: 'word19' },{
            name: 'word20' },{
          }];

          $scope.scrambleModel = {};

          $scope.scrambleIDs = [{
            name: 'vm.game.word1' },{
            name: 'vm.game.word2' },{
            name: 'vm.game.word3' },{
            name: 'vm.game.word4' },{
            name: 'vm.game.word5' },{
            name: 'vm.game.word6' },{
            name: 'vm.game.word7' },{
            name: 'vm.game.word8' },{
            name: 'vm.game.word9' },{
            name: 'vm.game.word10' },{
            name: 'vm.game.word11' },{
            name: 'vm.game.word12' },{
            name: 'vm.game.word13' },{
            name: 'vm.game.word14' },{
            name: 'vm.game.word15' },{
            name: 'vm.game.word16' },{
            name: 'vm.game.word17' },{
            name: 'vm.game.word18' },{
            name: 'vm.game.word19' },{
            name: 'vm.game.word20'
          }];

          console.log(vm.game.type);
          console.log(vm.game.hasletter1);
          */
    // if (vm.game.type === undefined){
    //   vm.game.hasletters = false;
    // } else {
    //   // TODO based on vm.game.type set the game type dropdown
    // }
    //
    //
    // //$scope.gameTypes = ['wordsearch', 'wordscramble', 'maze'];
    // // TODO auto-set the gameTypes on load
    //
    // // Remove existing Game
    // function remove() {
    //   if ($window.confirm('Are you sure you want to delete?')) {
    //     vm.game.$remove($state.go('games.list'));
    //   }
    // }
    //
    // // Save Game
    // function save(isValid) {
    //   if (!isValid) {
    //     $scope.$broadcast('show-errors-check-validity', 'vm.form.gameForm');
    //     return false;
    //   }
    //
    //   // TODO: move create/update logic to service
    //   if (vm.game._id) {
    //     vm.game.$update(successCallback, errorCallback);
    //   } else {
    //     vm.game.$save(successCallback, errorCallback);
    //   }
    //
    //   function successCallback(res) {
    //     $state.go('games.view', {
    //       gameId: res._id
    //     });
    //   }
    //
    //   function errorCallback(res) {
    //     vm.error = res.data.message;
    //   }
    // }
    //
    // $scope.dropDownChange = function(event){
    //
    // };
    //
    // $scope.getNumber = function(num) {
    //   return new Array(num);
    // };
  }
  //console.log("loading");
}());
