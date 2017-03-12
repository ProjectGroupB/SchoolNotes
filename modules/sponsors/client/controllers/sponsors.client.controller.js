(function () {
  'use strict';

  // Sponsors controller
  angular.module('sponsors')
    .controller('SponsorsController', SponsorsController);

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
      } else {
        vm.sponsor.$save(successCallback, errorCallback);
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

    document.getElementById('upload').onchange = function (evt) {
      //document.getElementById('uploadFile').value = this.value;
      var files = evt.target.files; // FileList object

      //$scope.uploader.uploadAll();

      // Loop through the FileList and render image files as thumbnails.
      for (var i = 0, f; f = files[i]; i++){

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

    // used to send email with sponsor request info
    document.getElementById('send-btn').onchange = function (evt){
      var mailBody=document.getElementById('message').innerHTML;
      window.location.href="mailto:schoolnotesmag@gmail.com?subject=New%20Sponsor%20Request&body="+mailBody;
    };

  }
}());
