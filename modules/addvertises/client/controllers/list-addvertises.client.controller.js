(function () {
  'use strict';

  angular
    .module('addvertises')
    .controller('AddvertisesListController', AddvertisesListController);

  AddvertisesListController.$inject = ['AddvertisesService'];

  function AddvertisesListController(AddvertisesService) {
    var vm = this;

    vm.addvertises = AddvertisesService.query();
  }
}());
