(function () {
  'use strict';

  // Contactus controller
  angular
    .module('contactus')
    .controller('ContactusController', ContactusController);

  ContactusController.$inject = ['$scope', '$state', '$window', 'Authentication', 'contactuResolve'];

  function ContactusController ($scope, $state, $window, Authentication, contactu) {
    var vm = this;

    vm.authentication = Authentication;
    vm.contactu = contactu;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Contactu
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.contactu.$remove($state.go('contactus.list'));
      }
    }

    // Save Contactu
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.contactuForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.contactu._id) {
        vm.contactu.$update(successCallback, errorCallback);
      } else {
        vm.contactu.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('contactus.view', {
          contactuId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
