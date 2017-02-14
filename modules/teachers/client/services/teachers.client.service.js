// Teachers service used to communicate Teachers REST endpoints
(function () {
  'use strict';

  angular
    .module('teachers')
    .factory('TeachersService', TeachersService);

  TeachersService.$inject = ['$resource'];

  function TeachersService($resource) {
    return $resource('api/teachers/:teacherId', {
      teacherId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
