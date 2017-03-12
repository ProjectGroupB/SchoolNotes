// Sponsors service used to communicate Sponsors REST endpoints
(function () {
  'use strict';

  angular
      .module('sponsors')
      .factory('SponsorsService', SponsorsService);

  SponsorsService.$inject = ['$resource'];

  function SponsorsService($resource) {
    return $resource('api/sponsors/:sponsorId', {
      sponsorId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
