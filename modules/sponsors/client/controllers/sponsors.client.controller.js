/*jshint sub:true*/
/*global escape:true */
/*jshint loopfunc:true */
(function () {
  'use strict';

  // Sponsors controller
  angular.module('sponsors').controller('SponsorsController', SponsorsController);

  SponsorsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'sponsorResolve'];

  function SponsorsController ($scope, $state, $window, Authentication, sponsor) {
    var vm = this;

    vm.authentication = Authentication;
    vm.sponsor = sponsor;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Sponsor
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.sponsor.$remove($state.go('sponsors.list'));
      }
    }

    // Save Sponsor
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.sponsorForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.sponsor._id) {
        vm.sponsor.$update(successCallback, errorCallback);
        js_send();
      } else {
        vm.sponsor.$save(successCallback, errorCallback);
        js_send();
      }

      function successCallback(res) {
        $state.go('sponsors.view', {
          sponsorId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }


    if (document.getElementById('upload') !== null && document.getElementById('upload') !== undefined) {
      document.getElementById('upload').onchange = function (evt) {
        //document.getElementById('uploadFile').value = this.value;
        var files = evt.target.files; // FileList object
        //$scope.uploader.uploadAll();

        // Loop through the FileList and render image files as thumbnails.
        /*jshint boss:true */ // This should suppress the jshint error
        for (var i = 0, f; f = files[i]; i++) {

          // Only process image files.
          if (!f.type.match('image.*')) {
            continue;
          }

          var reader = new FileReader();

          // Closure to capture the file information.
          reader.onload = (function (theFile) {
            return function (e) {
              // Render thumbnail.
              var span = document.createElement('span');
              span.innerHTML = ['<img class="thumb" src="', e.target.result,
                '" title="', escape(theFile.name), '"/>'].join('');
              document.getElementById('list').insertBefore(span, null);
              $scope.imageURL = theFile.target.result;
            };
          })(f);

          // Read in the image file as a data URL.
          reader.readAsDataURL(f);
        }
      };


    }

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
