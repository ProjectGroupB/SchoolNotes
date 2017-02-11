(function () {
  'use strict';

  angular
    .module('contactus')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('contactus', {
        abstract: true,
        url: '/contactus',
        template: '<ui-view/>'
      })
      .state('contactus.list', {
        url: '',
        templateUrl: 'modules/contactus/client/views/list-contactus.client.view.html',
        controller: 'ContactusListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Contactus List'
        }
      })
      .state('contactus.create', {
        url: '/create',
        templateUrl: 'modules/contactus/client/views/form-contactu.client.view.html',
        controller: 'ContactusController',
        controllerAs: 'vm',
        resolve: {
          contactuResolve: newContactu
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Contactus Create'
        }
      })
      .state('contactus.edit', {
        url: '/:contactuId/edit',
        templateUrl: 'modules/contactus/client/views/form-contactu.client.view.html',
        controller: 'ContactusController',
        controllerAs: 'vm',
        resolve: {
          contactuResolve: getContactu
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Contactu {{ contactuResolve.name }}'
        }
      })
      .state('contactus.view', {
        url: '/:contactuId',
        templateUrl: 'modules/contactus/client/views/view-contactu.client.view.html',
        controller: 'ContactusController',
        controllerAs: 'vm',
        resolve: {
          contactuResolve: getContactu
        },
        data: {
          pageTitle: 'Contactu {{ contactuResolve.name }}'
        }
      });
  }

  getContactu.$inject = ['$stateParams', 'ContactusService'];

  function getContactu($stateParams, ContactusService) {
    return ContactusService.get({
      contactuId: $stateParams.contactuId
    }).$promise;
  }

  newContactu.$inject = ['ContactusService'];

  function newContactu(ContactusService) {
    return new ContactusService();
  }
}());
