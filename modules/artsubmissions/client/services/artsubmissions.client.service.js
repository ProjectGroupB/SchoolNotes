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


// .service('uploadFile', function($http){
//   this.upload = function(file){
//     var fd = new FormData();
//     fd.append('myfile', file.upload);
//     return $http.post('/upload', fd, {
//       transformRequest: angular.identity,
//       header: { 'Content-Type': undefined }
//     });
//   };
// });
