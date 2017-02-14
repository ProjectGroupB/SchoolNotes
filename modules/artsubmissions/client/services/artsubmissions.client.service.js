// Artsubmissions service used to communicate Artsubmissions REST endpoints
(function () {
  'use strict';

  angular
    .module('artsubmissions')
    .factory('ArtsubmissionsService', ArtsubmissionsService);

  ArtsubmissionsService.$inject = ['$resource'];

  function ArtsubmissionsService($resource) {
    return $resource('api/artsubmissions/:artsubmissionId', {
      artsubmissionId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
