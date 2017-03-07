'use strict';

// Articles controller
angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles',
  function ($scope, $stateParams, $location, Authentication, Articles) {
    $scope.authentication = Authentication;

    // Create new Article
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'articleForm');

        return false;
      }

      // Create new Article object
      var article = new Articles({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      article.$save(function (response) {
        $location.path('articles/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // add comments
    $scope.comment = function (article) {

      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth()+1; //January is 0!
      var yyyy = today.getFullYear();

      if(dd<10) {
        dd='0'+dd;
      }

      if(mm<10) {
        mm='0'+mm;
      }

      today = mm+'/'+dd+'/'+yyyy;

      var comments = 'no comments';

      if (article) {
        comments = article.comments;
        comments = comments + ' - ' + $scope.authentication.user.displayName + ' - ';
        comments = comments + ' [' + today + '] ' + this.comments  + '\r\n';
        article.$update();
        $scope.comments = '';
      }
      else {
        comments = $scope.article.comments ;
        comments = comments + ' - ' + $scope.authentication.user.displayName + ' - ';
        comments = comments + ' [' + today + '] ' + this.comments  + '\r\n';
        $scope.article.comments = comments;
        $scope.article.$update(function () {
          $location.path('articles/' + $scope.article._id + '/review');
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });
        $scope.comments = '';
      }

    };

    // approve submitted article
    $scope.approve = function (article) {
      console.log('approving article');

      if (article) {
        article.status = 'Approved';
        article.$update();
      }
      else {
        $scope.article.status = 'Approved';
        $scope.article.$update(function () {
          $location.path('articles/' + $scope.article._id);
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      }
    };
    // reject submitted article
    $scope.reject = function (article) {
      console.log('rejecting article');

      if (article) {
        article.status = 'Rejected';
        article.$update();
      }
      else {
        $scope.article.status = 'Rejected';
        $scope.article.$update(function () {
          $location.path('articles/' + $scope.article._id);
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      }
    };
    // send alert that submitted article needs revision
    $scope.alert = function (article) {
      console.log('alerting author article needs revision');

      if (article) {
        article.status = 'Waiting for Revision';
        article.$update();
      }
      else {
        $scope.article.status = 'Waiting for Revision';
        $scope.article.$update(function () {
          $location.path('articles/' + $scope.article._id);
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      }
    };

    // Remove existing Article
    $scope.remove = function (article) {
      if (article) {
        article.$remove();

        for (var i in $scope.articles) {
          if ($scope.articles[i] === article) {
            $scope.articles.splice(i, 1);
          }
        }
      } else {
        $scope.article.$remove(function () {
          $location.path('articles');
        });
      }
    };

    // Update existing Article
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'articleForm');

        return false;
      }

      var article = $scope.article;

      article.$update(function () {
        $location.path('articles/' + article._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Articles
    $scope.find = function () {
      $scope.articles = Articles.query();
    };

    // Find a list of Articles
    $scope.findForReview = function () {
      $scope.articles = Articles.query();
    };

    // Find existing Article
    $scope.findOne = function () {
      $scope.article = Articles.get({
        articleId: $stateParams.articleId
      });
    };
  }
]);
