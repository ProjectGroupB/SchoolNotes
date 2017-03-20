(function () {
  'use strict';
  // word search variables
  // Games controller
  angular
      .module('games')
      .controller('GamesController', GamesController);

  GamesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'gameResolve'];

  function GamesController ($scope, $state, $window, Authentication, game) {
    var vm = this;
    vm.authentication = Authentication;
    vm.game = game;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
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
    if (vm.game.type === undefined){
      vm.game.hasletters = false;
    } else {
      // TODO based on vm.game.type set the game type dropdown
    }


    //$scope.gameTypes = ['wordsearch', 'wordscramble', 'maze'];
    // TODO auto-set the gameTypes on load

    // Remove existing Game
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.game.$remove($state.go('games.list'));
      }
    }

    // Save Game
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.gameForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.game._id) {
        vm.game.$update(successCallback, errorCallback);
      } else {
        vm.game.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('games.view', {
          gameId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    $scope.dropDownChange = function(event){

    };

    $scope.getNumber = function(num) {
      return new Array(num);
    };
  }
  //console.log("loading");
}());
