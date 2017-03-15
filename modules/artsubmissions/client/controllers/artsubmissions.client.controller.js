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

    $scope.authentication = Authentication;
    $scope.artsubmission = artsubmission;
    $scope.error = null;
    $scope.form = {};
    $scope.remove = remove;
    $scope.save = save;
////////////////////////////////////////////

    // $scope.thumbnail = $scope.artsubmission.thumbnail;

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

    $scope.photoChanged = function (files) {
      if (files.length > 0 && files[0].name.match(/\.(png|jpg|jpeg)$/)) {
        $scope.uploading = true;
        var file = files[0];
        var fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = function (e) {
          $timeout(function () {
            $scope.thumbnail = {};
            $scope.thumbnail = e.target.result;
            $scope.uploading = false;
            $scope.message = false;
          });
        };
      } else {
        $scope.thumbnail = {};
        $scope.message = false;
      }
    };







/////////////////////////////////////////// I was trying to use format like in "change user picture" module
    // vm.artImageURL = vm.artsubmission.artImageURL;
    //
    // // Create file uploader instance
    // vm.uploader = new FileUploader({
    //   url: 'api/artsubmissions/',
    //   alias: 'newImage'
    // });
    //
    // // Set file uploader image filter
    // vm.uploader.filters.push({
    //   name: 'imageFilter',
    //   fn: function (item, options) {
    //     var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
    //     return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
    //   }
    // });
    //
    // // Called after the user selected a new picture file
    // vm.uploader.onAfterAddingFile = function (fileItem) {
    //   if ($window.FileReader) {
    //     var fileReader = new FileReader();
    //     fileReader.readAsDataURL(fileItem._file);
    //
    //     fileReader.onload = function (fileReaderEvent) {
    //       $timeout(function () {
    //         vm.artImageURL = fileReaderEvent.target.result;
    //       }, 0);
    //     };
    //   }
    // };
    //
    // // Called after the user has successfully uploaded a new picture
    // vm.uploader.onSuccessItem = function (fileItem, response, status, headers) {
    //   // Show success message
    //   vm.success = true;
    //
    //   // Populate user object
    //   // vm.user = Authentication.user = response;
    //   vm.authentication = Authentication = response;
    //   // Clear upload buttons
    //   vm.cancelUpload();
    // };
    //
    // // Called after the user has failed to uploaded a new picture
    // vm.uploader.onErrorItem = function (fileItem, response, status, headers) {
    //   // Clear upload buttons
    //   vm.cancelUpload();
    //
    //   // Show error message
    //   vm.error = response.message;
    // };
    //
    // // Change user profile picture
    // vm.uploadProfilePicture = function () {
    //   // Clear messages
    //   vm.success = vm.error = null;
    //
    //   // Start upload
    //   vm.uploader.uploadAll();
    // };
    //
    // // Cancel the upload process
    // vm.cancelUpload = function () {
    //   vm.uploader.clearQueue();
    //   vm.artImageURL = vm.artsubmission.artImageURL;
    // };

///////////////////////////////////////////////////////////////

    // Remove existing Artsubmission
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        $scope.artsubmission.$remove($state.go('artsubmissions.list'));
      }
    }

    // Save Artsubmission
    function save(isValid) {
      console.log('in save(isvalid) ' + isValid);
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', '$scope.form.artsubmissionForm');
        return false;
      }
///////////////////////////////////////

      // var upload = function(file){
      //   var fd = new FormData();
      //   fd.append('myfile', file.upload);
      //   return $http.post('api/artsubmissions/', fd, {
      //     transformRequest: angular.identity,
      //     headers: { 'Content-Type': undefined }
      //   });
      // };
      //
      //
      // $scope.file = {};
      //
      // $scope.uploadSubmit = function () {
      //   $scope.uploading = true;
      //
      //   upload($scope.file).then(function (data) {
      //     if(data.data.success) {
      //       $scope.uploading = false;
      //       $scope.alert = 'alert alert-success';
      //       $scope.message = data.data.message;
      //       $scope.file = {};
      //     } else {
      //       $scope.uploading = false;
      //       $scope.alert = 'alert alert-danger';
      //       $scope.message = data.data.message;
      //       $scope.file = {};
      //     }
      //   });
      // };
      //
      // $scope.photoChanged = function (files) {
      //   if (files.length > 0 && files[0].name.match(/\.(png|jpg|jpeg)$/)) {
      //     $scope.uploading = true;
      //     var file = files[0];
      //     var fileReader = new FileReader();
      //     fileReader.readAsDataURL(file);
      //     fileReader.onload = function (e) {
      //       $timeout(function () {
      //         $scope.thumbnail = {};
      //         $scope.thumbnail = e.target.result;
      //         $scope.uploading = false;
      //         $scope.message = false;
      //       });
      //     };
      //   } else {
      //     $scope.thumbnail = {};
      //     $scope.message = false;
      //   }
      // };

//////////////////////////////////////////





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
