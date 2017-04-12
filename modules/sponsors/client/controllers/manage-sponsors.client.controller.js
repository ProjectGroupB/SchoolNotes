(function () {
    'use strict';

    angular.module('sponsors').controller('SponsorsManageController', SponsorsManageController);

    SponsorsManageController.$inject = ['$scope','SponsorsService'];

    function SponsorsManageController($scope, SponsorsService) {
        //var vm = this;

        $scope.sponsors = SponsorsService.query();
    }
}());
