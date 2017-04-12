(function () {
  'use strict';

  // Artsubmissions controller
  angular
    .module('artsubmissions')
    .controller('ArtsubmissionsController', ArtsubmissionsController)
    .directive('fileModel', fileModel);

  fileModel.$inject = ['$parse'];

  function fileModel($parse){
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
  }

  ArtsubmissionsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'artsubmissionResolve', '$timeout', '$http']; //'FileUploader', '$timeout'

  function ArtsubmissionsController($scope, $state, $window, Authentication, artsubmission, $timeout, $http) { //FileUploader,
    // var vm = this;

    console.log('Authentication        --      ' + Authentication);
    $scope.authentication = Authentication;
    $scope.artsubmission = artsubmission;
    $scope.error = null;
    $scope.form = {};
    $scope.remove = remove;
    $scope.save = save;

    var upload = function(file){
      var fd = new FormData();
      fd.append('myfile', file.upload);
      return $http.post('api/artsubmissions/', fd, {
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
    $scope.uploadSubmit2 = function () {
        $scope.uploading = true;
        upload($scope.file).then(function (data) {
            if(data.data.success) {
                $scope.uploading = false;
                $scope.alert = 'alert alert-success';
                $scope.message2 = data.data.message;
                $scope.file = {};
            } else {
                $scope.uploading = false;
                $scope.alert = 'alert alert-danger';
                $scope.message2 = data.data.message;
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
            // console.log('e  -- ' + e.target.result.data.toString());
            $scope.thumbnail = e.target.result;
            var day = new Date();
            var d = day.getDay();
            var h = day.getHours();
            console.log('files[0].size   ' +files[0].size);
              console.log('files[0].encoding   ' +files[0].encoding);

              $scope.artsubmission.thumbnail = 'modules/artsubmissions/client/img/' + d + '_' + h +  '_' + files[0].name;
              var sizeFile = files[0].size;

            $scope.uploading = false;
            $scope.message = false;
          });
        };
      } else {
        $scope.thumbnail = {};
        $scope.message = false;
      }
    };

      $scope.picChanged = function (files) {
          if (files.length > 0 && files[0].name.match(/\.(png|jpg|jpeg|pdf)$/)) {
              $scope.uploading = true;
              var file = files[0];
              var fileReader = new FileReader();
              fileReader.readAsDataURL(file);
              fileReader.onload = function (e) {
                  $timeout(function () {
                      $scope.submitterPic = {};
                      // console.log('e  -- ' + e.target.result.data.toString());
                      $scope.submitterPic = e.target.result;
                      var day = new Date();
                      var d = day.getDay();
                      var h = day.getHours();
                      console.log('files[0].size   ' +files[0].size);
                      console.log('files[0].encoding   ' +files[0].encoding);

                          $scope.artsubmission.submitterPic = 'modules/artsubmissions/client/img/' + d + '_' + h + '_' + files[0].name;

                      $scope.uploading = false;
                      $scope.message2 = false;
                  });
              };
          } else {
              $scope.submitterPic = {};
              $scope.message2 = false;
          }
      };

    // Remove existing Artsubmission
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        $scope.artsubmission.$remove($state.go('artsubmissions.list'));
      }
    }

    // Save Artsubmission
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', '$scope.form.artsubmissionForm');
        return false;
      }

      // TODO: move create/update logic to service
      if ($scope.artsubmission._id) {
        $scope.artsubmission.$update(successCallback, errorCallback);
      } else {
        $scope.artsubmission.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('artsubmissions.view', {
          artsubmissionId: res._id
        });
      }

      function errorCallback(res) {
        $scope.error = res.data.message;
      }
    }
  }
}());
