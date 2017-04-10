(function () {
  'use strict';

  angular
    .module('sponsors')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('sponsors', {
        abstract: true,
        url: '/sponsors',
        template: '<ui-view/>'
      })
      .state('sponsors.list', {
        url: '',
        templateUrl: 'modules/sponsors/client/views/list-sponsors.client.view.html',
        controller: 'SponsorsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Sponsors List'
        }
      })
      .state('sponsors.create', {
        url: '/create',
        templateUrl: 'modules/sponsors/client/views/form-sponsor.client.view.html',
        controller: 'SponsorsController',
        directive: 'fileModel',
        // controllerAs: 'vm',
        resolve: {
          sponsorResolve: newSponsor
        },
        data: {
          roles: ['user','admin'],
          pageTitle: 'Sponsors Create'
        }
      })
      .state('sponsors.edit', {
        url: '/:sponsorId/edit',
        templateUrl: 'modules/sponsors/client/views/form-sponsor.client.view.html',
        controller: 'SponsorsController',
        controllerAs: 'vm',
        resolve: {
          sponsorResolve: getSponsor
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Edit Sponsor {{ sponsorResolve.name }}'
        }
      })
      .state('sponsors.view', {
        url: '/:sponsorId',
        templateUrl: 'modules/sponsors/client/views/view-sponsor.client.view.html',
        controller: 'SponsorsController',
        controllerAs: 'vm',
        resolve: {
          sponsorResolve: getSponsor
        },
        data: {
          pageTitle: 'Sponsor {{ sponsorResolve.name }}'
        }
      });
  }

  getSponsor.$inject = ['$stateParams', 'SponsorsService'];

  function getSponsor($stateParams, SponsorsService) {
    return SponsorsService.get({
      sponsorId: $stateParams.sponsorId
    }).$promise;
  }

  newSponsor.$inject = ['SponsorsService'];

  function newSponsor(SponsorsService) {
    return new SponsorsService();
  }
}());
