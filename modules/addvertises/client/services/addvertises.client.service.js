// Addvertises service used to communicate Addvertises REST endpoints
(function () {
  'use strict';

  angular
    .module('addvertises')
    .factory('AddvertisesService', AddvertisesService);

  AddvertisesService.$inject = ['$resource'];

  function AddvertisesService($resource) {
    return $resource('api/addvertises/:addvertiseId', {
      addvertiseId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
