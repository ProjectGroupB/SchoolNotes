(function () {
  'use strict';

  // Artsubmissions controller
  angular
    .module('artsubmissions')
    .controller('ArtsubmissionsController', ArtsubmissionsController);

  ArtsubmissionsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'artsubmissionResolve'];

  function ArtsubmissionsController ($scope, $state, $window, Authentication, artsubmission) {
    var vm = this;

    vm.authentication = Authentication;
    vm.artsubmission = artsubmission;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Artsubmission
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.artsubmission.$remove($state.go('artsubmissions.list'));
      }
    }

    // Save Artsubmission
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.artsubmissionForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.artsubmission._id) {
        vm.artsubmission.$update(successCallback, errorCallback);
      } else {
        vm.artsubmission.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('artsubmissions.view', {
          artsubmissionId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
