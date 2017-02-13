(function () {
  'use strict';

  // Sponsors controller
  angular
    .module('sponsors')
    .controller('SponsorsController', SponsorsController);

  SponsorsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'sponsorResolve'];

  function SponsorsController ($scope, $state, $window, Authentication, sponsor) {
    var vm = this;

    vm.authentication = Authentication;
    vm.sponsor = sponsor;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Sponsor
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.sponsor.$remove($state.go('sponsors.list'));
      }
    }

    // Save Sponsor
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.sponsorForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.sponsor._id) {
        vm.sponsor.$update(successCallback, errorCallback);
      } else {
        vm.sponsor.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('sponsors.view', {
          sponsorId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
