/*jshint sub:true*/
/*global escape:true */
/*jshint loopfunc:true */
(function () {
  'use strict';

  // Sponsors controller
  angular.module('sponsors')
    .controller('SponsorsController', SponsorsController)
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
  SponsorsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'sponsorResolve', '$timeout', '$http'];

  function SponsorsController ($scope, $state, $window, Authentication, sponsor, $timeout, $http) {
    // var vm = this;
    //
    // vm.authentication = Authentication;
    // vm.sponsor = sponsor;
    // vm.error = null;
    // vm.form = {};
    // vm.remove = remove;
    // vm.save = save;

    $scope.authentication = Authentication;
    $scope.sponsor = sponsor;
    $scope.error = null;
    $scope.form = {};
    $scope.remove = remove;
    $scope.save = save;

    var upload = function(file){
      var fd = new FormData();
      fd.append('myfile', file.upload);
      return $http.post('api/sponsors/', fd, {
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
            // Render thumbnail.
            $scope.thumbnail = {};
            $scope.thumbnail = e.target.result;
            var day = new Date();
            var d = day.getDay();
            var h = day.getHours();
            $scope.sponsor.thumbnail = 'modules/sponsors/client/img/' + d + '_' + h + '_' + files[0].name;
            $scope.uploading = false;
            $scope.message = false;
          });
        };
      } else {
        $scope.thumbnail = {};
        $scope.message = false;
      }
    };

    // Remove existing sponsor
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        $scope.sponsor.$remove($state.go('sponsors.list'));
      }
    }

    // Save sponsor
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', '$scope.form.sponsorForm');
        return false;
      }

      // TODO: move create/update logic to service
      if ($scope.sponsor._id) {
        $scope.sponsor.$update(successCallback, errorCallback);
      } else {
        $scope.sponsor.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $scope.uploadSubmit();
        js_send();
        $state.go('sponsors.view', {
          sponsorId: res._id
        });
      }

      function errorCallback(res) {
        $scope.error = res.data.message;
      }
    }


    // if (document.getElementById('upload') !== null && document.getElementById('upload') !== undefined) {
    //   document.getElementById('upload').onchange = function (evt) {
    //     //document.getElementById('uploadFile').value = this.value;
    //     var files = evt.target.files; // FileList object
    //     //$scope.uploader.uploadAll();
    //
    //     // Loop through the FileList and render image files as thumbnails.
    //     /*jshint boss:true */ // This should suppress the jshint error
    //     for (var i = 0, f; f = files[i]; i++) {
    //
    //       // Only process image files.
    //       if (!f.type.match('image.*')) {
    //         continue;
    //       }
    //
    //       var reader = new FileReader();
    //
    //       // Closure to capture the file information.
    //       reader.onload = (function (theFile) {
    //         return function (e) {
    //           // Render thumbnail.
    //           var span = document.createElement('span');
    //           span.innerHTML = ['<img class="thumb" src="', e.target.result,
    //             '" title="', escape(theFile.name), '"/>'].join('');
    //           document.getElementById('list').insertBefore(span, null);
    //           $scope.imageURL = theFile.target.result;
    //         };
    //       })(f);
    //
    //       // Read in the image file as a data URL.
    //       reader.readAsDataURL(f);
    //     }
    //   };
    //
    //
    // }

    /**  Email functionality through postmail. Quota of 25 emails a day */

    var data_js = {
      'access_token': 'r65pgrha6y9b90q9ph2xdp3k'
    };

    function js_onSuccess() {
      // remove this to avoid redirect
     // window.location = window.location.pathname + "?message=Email+Successfully+Sent%21&isError=0";
      //vm.save;
    }

    function js_onError(error) {
      // remove this to avoid redirect
      //window.location = window.location.pathname + "?message=Email+could+not+be+sent.&isError=1";
    }

    var sendButton = document.getElementById('send-btn');

    function js_send() {
      var request;
      if(sendButton){
        sendButton.disabled=true;
        request = new XMLHttpRequest();
        request.onreadystatechange = function() {
          if (request.readyState === 4 && request.status === 200) {
            js_onSuccess();
          } else if (request.readyState === 4) {
            js_onError(request.response);
          }
        };
      }

      // var subject = document.querySelector("#" + form_id_js + " [name='subject']").value;
      var subject = 'New sponsor submission from '+document.getElementById('name').value;
      var message = document.getElementById('message').value +
                    '\n\nBusiness: ' + document.getElementById('name').value +
                    '\n\nContact name: ' + document.getElementById('contact').value +
                    '\n\nContact email: ' + document.getElementById('email').value +
                    '\n\nPhone: ' +document.getElementById('phone').value;
      data_js['subject'] = subject;
      data_js['text'] = message;
      var params = toParams(data_js);

      request.open('POST', 'https://postmail.invotes.com/send', true);
      request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

      request.send(params);

      return false;
    }


    function toParams(data_js) {
      var form_data = [];
      for (var key in data_js) {
        form_data.push(encodeURIComponent(key) + '=' + encodeURIComponent(data_js[key]));
      }

      return form_data.join('&');
    }
  }
})();
