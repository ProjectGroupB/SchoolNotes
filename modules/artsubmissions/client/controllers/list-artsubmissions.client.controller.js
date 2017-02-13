(function () {
  'use strict';

  angular
    .module('artsubmissions')
    .controller('ArtsubmissionsListController', ArtsubmissionsListController);

  ArtsubmissionsListController.$inject = ['ArtsubmissionsService'];

  function ArtsubmissionsListController(ArtsubmissionsService) {
    var vm = this;

    vm.artsubmissions = ArtsubmissionsService.query();
  }
}());
