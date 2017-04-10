'use strict';

// Articles controller
var app = angular.module('articles');

// function nl2br (str, is_xhtml) {
//     var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
//     return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
// }
app.directive('fileModel', ['$parse', function($parse){
    return{
        restrict:'A',
        link: function(scope, element, attrs) {
            var parsedFile = $parse(attrs.fileModel);
            var parsedFileSetter = parsedFile.assign;

            element.bind('change', function() {
                scope.$apply(function () {
                    parsedFileSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);


app.controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles', '$timeout', '$http',
  function ($scope, $stateParams, $location, Authentication, Articles, $timeout, $http) {
    $scope.authentication = Authentication;

  $scope.article = article; // I'm getting a console error here "ReferenceError: article is not defined" when I change above Articles to article, console error unknown.  
  $scope.error = null;
  $scope.form = {};
  $scope.remove = remove;
  $scope.save = save;

    //upload
    var upload = function(file){
        var fd = new FormData();
        fd.append('myfile', file.upload);
        return $http.post('api/articles/', fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        });
    };

    $scope.file = {};

    $scope.uploadSubmit = function () {
        $scope.uploading = true;
        upload($scope.file).then(function (data) {
            if(data.data.success) {
                $scope.uploading = false;
                $scope.alert = 'alert alert-success';
                $scope.message = data.data.message;
                $scope.file = {};
            } else {
                $scope.uploading = false;
                $scope.alert = 'alert alert-danger';
                $scope.message = data.data.message;
                $scope.file = {};
            }
        });
    };

    $scope.photoChanged = function (files) {
        if (files.length > 0 && files[0].name.match(/\.(png|jpg|jpeg|pdf)$/)) {
            $scope.uploading = true;
            var file = files[0];
            var fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = function (e) {
                $timeout(function () {
                    $scope.thumbnail = {};
                    $scope.thumbnail = e.target.result;
                    var day = new Date();
                    var d = day.getDay();
                    var h = day.getHours();
                    $scope.article.thumbnail = 'modules/articles/client/img/' + d + '_' + h + '_' + files[0].name;
                    $scope.uploading = false;
                    $scope.message = false;
                });
            };
        } else {
            $scope.thumbnail = {};
            $scope.message = false;
        }
    };

    // Save articles
    function save(isValid) {
        if (!isValid) {
            $scope.$broadcast('show-errors-check-validity', '$scope.form.articleForm');
            return false;
        }

        // TODO: move create/update logic to service
        if ($scope.article._id) {
            $scope.article.$update(successCallback, errorCallback);
        } else {
            $scope.article.$save(successCallback, errorCallback);
        }

        function successCallback(res) {
            $state.go('article.view', {
                articleId: res._id
            });
        }

        function errorCallback(res) {
            $scope.error = res.data.message;
        }
    }

    // end of upload



    // // Create new Article
    // $scope.create = function (isValid) {
    //   $scope.error = null;
    //
    //   if (!isValid) {
    //     $scope.$broadcast('show-errors-check-validity', 'articleForm');
    //
    //     return false;
    //   }
    //
    //   var formattedContent = this.content;
    //
    //   // Create new Article object
    //   var article = new Articles({
    //     title: this.title,
    //     // content: nl2br(this.content)
    //     content: formattedContent
    //   });
    //
    //   // Redirect after save
    //   article.$save(function (response) {
    //     $location.path('articles/' + response._id);
    //
    //     // Clear form fields
    //     $scope.title = '';
    //     $scope.content = '';
    //   }, function (errorResponse) {
    //     $scope.error = errorResponse.data.message;
    //   });
    // };
    //
    // // add comments
    // $scope.addComment = function () {
    //
    //   // time
    //   var today = new Date();
    //   var dd = today.getDate();
    //   var mm = today.getMonth()+1; //January is 0!
    //   var yyyy = today.getFullYear();
    //   var hr = today.getTime();
    //
    //   if(dd<10) {
    //     dd='0'+dd;
    //   }
    //
    //   if(mm<10) {
    //     mm='0'+mm;
    //   }
    //
    //   today = mm+'/'+dd+'/'+yyyy + ': '+hr;
    //   var d = new Date();
    //
    //   var newComment = {
    //     title : this.commentTitle,
    //     details : this.commentDetails,
    //     author : $scope.authentication.user.displayName,
    //     date : d
    //   };
    //
    //   if ($scope.article.comments) {
    //     $scope.article.comments.push(newComment);
    //     $scope.article.$update();
    //     $scope.commentTitle = '';
    //     $scope.commentDetails = '';
    //   }
    //   else {
    //     $scope.article.comments = [newComment];
    //     $scope.article.$update(function () {
    //       $location.path('articles/' + $scope.article._id + '/review');
    //     }, function (errorResponse) {
    //       $scope.error = errorResponse.data.message;
    //     });
    //     $scope.commentTitle = '';
    //     $scope.commentDetails = '';
    //   }
    // };

    //
    // $scope.comment = function (article) {
    //
    //   var today = new Date();
    //   var dd = today.getDate();
    //   var mm = today.getMonth()+1; //January is 0!
    //   var yyyy = today.getFullYear();
    //
    //   if(dd<10) {
    //     dd='0'+dd;
    //   }
    //
    //   if(mm<10) {
    //     mm='0'+mm;
    //   }
    //
    //   today = mm+'/'+dd+'/'+yyyy;
    //
    //   var comments = 'no comments';
    //
    //   if (article) {
    //     comments = article.comments;
    //     comments = comments + ' - ' + $scope.authentication.user.displayName + ' - ';
    //     comments = comments + ' [' + today + '] ' + this.comments + '\r\n';
    //     article.$update();
    //     $scope.comments = '';
    //   }
    //   else {
    //     comments = $scope.article.comments ;
    //     comments = comments + ' - ' + $scope.authentication.user.displayName + ' - ';
    //     comments = comments + ' [' + today + '] ' + this.comments + '\r\n';
    //     $scope.article.comments = comments;
    //     $scope.article.$update(function () {
    //       $location.path('articles/' + $scope.article._id + '/review');
    //     }, function (errorResponse) {
    //       $scope.error = errorResponse.data.message;
    //     });
    //     $scope.comments = '';
    //   }
    //
    // };

    // approve submitted article
    // $scope.approve = function (article) {
    //   console.log('approving article');
    //
    //   if (article) {
    //     article.status = 'Approved';
    //     article.$update();
    //   }
    //   else {
    //     $scope.article.status = 'Approved';
    //     $scope.article.$update(function () {
    //       $location.path('articles/' + $scope.article._id);
    //     }, function (errorResponse) {
    //       $scope.error = errorResponse.data.message;
    //     });
    //   }
    // };
    // // reject submitted article
    // $scope.reject = function (article) {
    //   console.log('rejecting article');
    //
    //   if (article) {
    //     article.status = 'Rejected';
    //     article.$update();
    //   }
    //   else {
    //     $scope.article.status = 'Rejected';
    //     $scope.article.$update(function () {
    //       $location.path('articles/' + $scope.article._id);
    //     }, function (errorResponse) {
    //       $scope.error = errorResponse.data.message;
    //     });
    //   }
    // };
    // // send alert that submitted article needs revision
    // $scope.alert = function (article) {
    //   console.log('alerting author article needs revision');
    //
    //   if (article.comments) {
    //     article.status = 'Waiting for Revision';
    //     article.$update();
    //   }
    //   else {
    //     $scope.article.status = 'Waiting for Revision';
    //     $scope.article.$update(function () {
    //       $location.path('articles/' + $scope.article._id);
    //     }, function (errorResponse) {
    //       $scope.error = errorResponse.data.message;
    //     });
    //   }
    // };
    //
    // // Remove existing Article
    // $scope.remove = function (article) {
    //   if (article) {
    //     article.$remove();
    //
    //     for (var i in $scope.articles) {
    //       if ($scope.articles[i] === article) {
    //         $scope.articles.splice(i, 1);
    //       }
    //     }
    //   } else {
    //     $scope.article.$remove(function () {
    //       $location.path('articles');
    //     });
    //   }
    // };
    //
    // // Update existing Article
    // $scope.update = function (isValid) {
    //   $scope.error = null;
    //
    //   if (!isValid) {
    //     $scope.$broadcast('show-errors-check-validity', 'articleForm');
    //
    //     return false;
    //   }
    //
    //   var article = $scope.article;
    //
    //   article.$update(function () {
    //     $location.path('articles/' + article._id);
    //   }, function (errorResponse) {
    //     $scope.error = errorResponse.data.message;
    //   });
    // };
    //
    // // Find a list of Articles
    // $scope.find = function () {
    //   $scope.articles = Articles.query();
    // };
    //
    // // Find a list of Articles
    // $scope.findForReview = function () {
    //   $scope.articles = Articles.query();
    // };
    //
    // // Find existing Article
    // $scope.findOne = function () {
    //   $scope.article = Articles.get({
    //     articleId: $stateParams.articleId
    //   });
    // };
  }
]);
