(function () {
  'use strict';

  angular
    .module('teachers')
    .controller('TeachersListController', TeachersListController);

  TeachersListController.$inject = ['TeachersService'];

  function TeachersListController(TeachersService) {
    var vm = this;

    vm.teachers = TeachersService.query();
  }
}());
