(function () {
  'use strict';

  angular
    .module('artsubmissions')
    .controller('ArtsubmissionsListController', ArtsubmissionsListController);

  ArtsubmissionsListController.$inject = ['$scope', 'ArtsubmissionsService'];

  function ArtsubmissionsListController($scope, ArtsubmissionsService) {
    // var vm = this;

    $scope.artsubmissions = ArtsubmissionsService.query();
  }
}());
