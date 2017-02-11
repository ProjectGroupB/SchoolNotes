(function () {
  'use strict';

  angular
    .module('teachers')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('teachers', {
        abstract: true,
        url: '/teachers',
        template: '<ui-view/>'
      })
      .state('teachers.list', {
        url: '',
        templateUrl: 'modules/teachers/client/views/list-teachers.client.view.html',
        controller: 'TeachersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Teachers List'
        }
      })
      .state('teachers.create', {
        url: '/create',
        templateUrl: 'modules/teachers/client/views/form-teacher.client.view.html',
        controller: 'TeachersController',
        controllerAs: 'vm',
        resolve: {
          teacherResolve: newTeacher
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Teachers Create'
        }
      })
      .state('teachers.edit', {
        url: '/:teacherId/edit',
        templateUrl: 'modules/teachers/client/views/form-teacher.client.view.html',
        controller: 'TeachersController',
        controllerAs: 'vm',
        resolve: {
          teacherResolve: getTeacher
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Teacher {{ teacherResolve.name }}'
        }
      })
      .state('teachers.view', {
        url: '/:teacherId',
        templateUrl: 'modules/teachers/client/views/view-teacher.client.view.html',
        controller: 'TeachersController',
        controllerAs: 'vm',
        resolve: {
          teacherResolve: getTeacher
        },
        data: {
          pageTitle: 'Teacher {{ teacherResolve.name }}'
        }
      });
  }

  getTeacher.$inject = ['$stateParams', 'TeachersService'];

  function getTeacher($stateParams, TeachersService) {
    return TeachersService.get({
      teacherId: $stateParams.teacherId
    }).$promise;
  }

  newTeacher.$inject = ['TeachersService'];

  function newTeacher(TeachersService) {
    return new TeachersService();
  }
}());
