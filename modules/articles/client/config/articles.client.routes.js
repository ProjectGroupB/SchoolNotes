'use strict';

// Setting up route
angular.module('articles').config(['$stateProvider',
  function ($stateProvider) {
    // Articles state routing
    $stateProvider
      .state('articles', {
        abstract: true,
        url: '/articles',
        template: '<ui-view/>'
      })
      .state('articles.list', {
        url: '',
        templateUrl: 'modules/articles/client/views/list-articles.client.view.html'
      })
      // added to allow review of a asubmitted article
      .state('articles.reviewList', {
        url: '/reviewList',
        templateUrl: 'modules/articles/client/views/reviewList-article.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('articles.create', {
        url: '/create',
        templateUrl: 'modules/articles/client/views/create-article.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('articles.view', {
        url: '/:articleId',
        templateUrl: 'modules/articles/client/views/view-article.client.view.html'
      })

      // added to allow review of a asubmitted article
      .state('articles.review', {
        url: '/:articleId/review',
        templateUrl: 'modules/articles/client/views/review-article.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })

      .state('articles.edit', {
        url: '/:articleId/edit',
        templateUrl: 'modules/articles/client/views/edit-article.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
