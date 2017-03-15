'use strict';

// angular.module('uploadApplication', ['fileModelDirective'])
//
//
//   .controller('uploadCtrl', function ($scope, $timeout, $http) {
//
//     var upload = function(file){
//       var fd = new FormData();
//       fd.append('myfile', file.upload);
//       return $http.post('/upload', fd, {
//         transformRequest: angular.identity,
//         headers: { 'Content-Type': undefined }
//       });
//     };
//
//
//     $scope.file = {};
//
//     $scope.uploadSubmit = function () {
//       $scope.uploading = true;
//       upload($scope.file).then(function (data) {
//         if(data.data.success) {
//           $scope.uploading = false;
//           $scope.alert = 'alert alert-success';
//           $scope.message = data.data.message;
//           $scope.file = {};
//         } else {
//           $scope.uploading = false;
//           $scope.alert = 'alert alert-danger';
//           $scope.message = data.data.message;
//           $scope.file = {};
//         }
//       });
//     };
//
//     $scope.photoChanged = function (files) {
//       if (files.length > 0 && files[0].name.match(/\.(png|jpg|jpeg)$/)) {
//         $scope.uploading = true;
//         var file = files[0];
//         var fileReader = new FileReader();
//         fileReader.readAsDataURL(file);
//         fileReader.onload = function (e) {
//           $timeout(function () {
//             $scope.thumbnail = {};
//             $scope.thumbnail.dataUrl = e.target.result;
//             $scope.uploading = false;
//             $scope.message = false;
//           });
//         };
//       } else {
//         $scope.thumbnail = {};
//         $scope.message = false;
//       }
//     };
//
//   });

// angular.module('artsubmissions').controller('imageController', ['$scope', '$timeout', '$window', 'Authentication', 'FileUploader',
//     function ($scope, $timeout, $window, Authentication, FileUploader) {
//     // vm = this;
//     //     // vm.artsubmissions = Authentication.artsubmissions;
//     //     vm.imageURL = vm.artsubmission.imageURL;
//     //
//     //     // Create file uploader instance
//     //     vm.uploader = new FileUploader({
//     //         url: 'api/artsubmissions/picture',
//     //         alias: 'newProfilePicture'
//     //     });
//     //
//     //     // Set file uploader image filter
//     //     vm.uploader.filters.push({
//     //         name: 'imageFilter',
//     //         fn: function (item, options) {
//     //             var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
//     //             return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
//     //         }
//     //     });
//     //
//     //     // Called after the artsubmissions selected a new picture file
//     //     vm.uploader.onAfterAddingFile = function (fileItem) {
//     //         if ($window.FileReader) {
//     //             var fileReader = new FileReader();
//     //             fileReader.readAsDataURL(fileItem._file);
//     //
//     //             fileReader.onload = function (fileReaderEvent) {
//     //                 $timeout(function () {
//     //                     vm.imageURL = fileReaderEvent.target.result;
//     //                 }, 0);
//     //             };
//     //         }
//     //     };
//     //
//     //     // Called after the artsubmissions has successfully uploaded a new picture
//     //     vm.uploader.onSuccessItem = function (fileItem, response, status, headers) {
//     //         // Show success message
//     //         vm.success = true;
//     //
//     //         // Populate artsubmissions object
//     //         vm.artsubmission = Authentication.artsubmission = response;
//     //
//     //         // Clear upload buttons
//     //         vm.cancelUpload();
//     //     };
//     //
//     //     // Called after the artsubmissions has failed to uploaded a new picture
//     //     vm.uploader.onErrorItem = function (fileItem, response, status, headers) {
//     //         // Clear upload buttons
//     //         vm.cancelUpload();
//     //
//     //         // Show error message
//     //         vm.error = response.message;
//     //     };
//     //
//     //     // Change artsubmissions profile picture
//     //     vm.uploadProfilePicture = function () {
//     //         // Clear messages
//     //         vm.success = vm.error = null;
//     //
//     //         // Start upload
//     //         vm.uploader.uploadAll();
//     //     };
//     //
//     //     // Cancel the upload process
//     //     vm.cancelUpload = function () {
//     //         vm.uploader.clearQueue();
//     //         vm.imageURL = vm.artsubmission.imageURL;
//     //     };
//     }
// ]);
