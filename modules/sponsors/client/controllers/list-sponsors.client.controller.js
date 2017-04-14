(function () {
  'use strict';

  angular.module('sponsors').controller('SponsorsListController', SponsorsListController);

  SponsorsListController.$inject = ['$scope','SponsorsService'];

  function SponsorsListController($scope, SponsorsService) {

    $scope.sponsors = SponsorsService.query();
  }
}());
