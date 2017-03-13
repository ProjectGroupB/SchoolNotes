(function () {
  'use strict';

  angular
    .module('artsubmissions')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('artsubmissions', {
        abstract: true,
        url: '/artsubmissions',
        template: '<ui-view/>'
      })
      .state('artsubmissions.list', {
        url: '',
        templateUrl: 'modules/artsubmissions/client/views/list-artsubmissions.client.view.html',
        controller: 'ArtsubmissionsListController',
        // controllerAs: 'vm',
        data: {
          pageTitle: 'Art submissions List'
        }
      })
      .state('artsubmissions.create', {
        url: '/create',
        templateUrl: 'modules/artsubmissions/client/views/form-artsubmission.client.view.html',
        controller: 'ArtsubmissionsController',
        directive: 'fileModel',
        // controllerAs: 'vm',
        resolve: {
          artsubmissionResolve: newArtsubmission
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Create Art submission'
        }
      })
      .state('artsubmissions.edit', {
        url: '/:artsubmissionId/edit',
        templateUrl: 'modules/artsubmissions/client/views/form-artsubmission.client.view.html',
        controller: 'ArtsubmissionsController',
        // controllerAs: 'vm',
        resolve: {
          artsubmissionResolve: getArtsubmission
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Artsubmission {{ artsubmissionResolve.name }}'
        }
      })
      // .state('artsubmissions.image', {
      //     url: '/image',
      //     templateUrl: 'modules/artsubmissions/client/views/form-artsubmission.client.view.html',
      //     controller: 'ArtsubmissionsController',
      //     controllerAs: 'vm',
      //     resolve: {
      //         artsubmissionResolve: imageArtsubmission
      //     },
      //     data: {
      //         roles: ['user', 'admin'],
      //         pageTitle: 'image Art submission'
      //     }
      // })
      // .state('artsubmissions.image', {
      //   url: '/image',
      //   templateUrl: 'modules/artsubmissions/client/views/form-artsubmission.client.view.html'
      // })
      .state('artsubmissions.view', {
        url: '/:artsubmissionId',
        templateUrl: 'modules/artsubmissions/client/views/view-artsubmission.client.view.html',
        controller: 'ArtsubmissionsController',
        // controllerAs: 'vm',
        resolve: {
          artsubmissionResolve: getArtsubmission
        },
        data: {
          pageTitle: 'Artsubmission {{ artsubmissionResolve.name }}'
        }
      });
  }

  getArtsubmission.$inject = ['$stateParams', 'ArtsubmissionsService'];

  function getArtsubmission($stateParams, ArtsubmissionsService) {
    return ArtsubmissionsService.get({
      artsubmissionId: $stateParams.artsubmissionId
    }).$promise;
  }

  newArtsubmission.$inject = ['ArtsubmissionsService'];

  function newArtsubmission(ArtsubmissionsService) {
    return new ArtsubmissionsService();
  }

  // imageArtsubmission.$inject = ['ArtsubmissionsService'];
  //
  // function imageArtsubmission(ArtsubmissionsService) {
  //     return new ArtsubmissionsService();
  // }
}());
