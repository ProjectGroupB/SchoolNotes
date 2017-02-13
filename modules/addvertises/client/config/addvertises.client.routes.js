(function () {
  'use strict';

  angular
    .module('addvertises')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('addvertises', {
        abstract: true,
        url: '/addvertises',
        template: '<ui-view/>'
      })
      .state('addvertises.list', {
        url: '',
        templateUrl: 'modules/addvertises/client/views/list-addvertises.client.view.html',
        controller: 'AddvertisesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Addvertises List'
        }
      })
      .state('addvertises.create', {
        url: '/create',
        templateUrl: 'modules/addvertises/client/views/form-addvertise.client.view.html',
        controller: 'AddvertisesController',
        controllerAs: 'vm',
        resolve: {
          addvertiseResolve: newAddvertise
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Addvertises Create'
        }
      })
      .state('addvertises.edit', {
        url: '/:addvertiseId/edit',
        templateUrl: 'modules/addvertises/client/views/form-addvertise.client.view.html',
        controller: 'AddvertisesController',
        controllerAs: 'vm',
        resolve: {
          addvertiseResolve: getAddvertise
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Addvertise {{ addvertiseResolve.name }}'
        }
      })
      .state('addvertises.view', {
        url: '/:addvertiseId',
        templateUrl: 'modules/addvertises/client/views/view-addvertise.client.view.html',
        controller: 'AddvertisesController',
        controllerAs: 'vm',
        resolve: {
          addvertiseResolve: getAddvertise
        },
        data: {
          pageTitle: 'Addvertise {{ addvertiseResolve.name }}'
        }
      });
  }

  getAddvertise.$inject = ['$stateParams', 'AddvertisesService'];

  function getAddvertise($stateParams, AddvertisesService) {
    return AddvertisesService.get({
      addvertiseId: $stateParams.addvertiseId
    }).$promise;
  }

  newAddvertise.$inject = ['AddvertisesService'];

  function newAddvertise(AddvertisesService) {
    return new AddvertisesService();
  }
}());
