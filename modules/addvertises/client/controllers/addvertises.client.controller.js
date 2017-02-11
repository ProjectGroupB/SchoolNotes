(function () {
  'use strict';

  // Addvertises controller
  angular
    .module('addvertises')
    .controller('AddvertisesController', AddvertisesController);

  AddvertisesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'addvertiseResolve'];

  function AddvertisesController ($scope, $state, $window, Authentication, addvertise) {
    var vm = this;

    vm.authentication = Authentication;
    vm.addvertise = addvertise;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Addvertise
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.addvertise.$remove($state.go('addvertises.list'));
      }
    }

    // Save Addvertise
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.addvertiseForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.addvertise._id) {
        vm.addvertise.$update(successCallback, errorCallback);
      } else {
        vm.addvertise.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('addvertises.view', {
          addvertiseId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
