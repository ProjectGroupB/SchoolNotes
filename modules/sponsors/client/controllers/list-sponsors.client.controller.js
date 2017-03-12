(function () {
  'use strict';

  angular.module('sponsors').controller('SponsorsListController', SponsorsListController);

    SponsorsListController.$inject = ['SponsorsService'];

    function SponsorsListController(SponsorsService) {
        var vm = this;

        vm.sponsors = SponsorsService.query();
    }
}());
