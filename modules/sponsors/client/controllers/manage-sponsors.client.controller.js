
    'use strict';

    angular.module('sponsors').controller('SponsorsManageController', SponsorsManageController);

    SponsorsManageController.$inject = ['$scope','SponsorsService'];

    function SponsorsManageController($scope, SponsorsService, thumbnail, leftAd, rightAd) {
        $scope.sponsors = SponsorsService.query();
        $scope.thumbnail = thumbnail;
        $scope.leftAd = leftAd;
        $scope.rightAd = rightAd;

        $scope.makeAd = function(sponsor){
            document.getElementById("adModal").style.display = "block";
            $scope.thumbnail = sponsor.thumbnail;
        };

        // assign ad to the proper ad space in api
        $scope.left = function() {
            $scope.leftAd = $scope.thumbnail;
        };

        $scope.right = function() {
            $scope.rightAd = $scope.thumbnail;
        };

        document.getElementsByClassName("close")[0].onclick = function() {
            document.getElementById("adModal").style.display = "none";
        };

        window.onclick = function(event) {
            if (event.target === document.getElementById("adModal")) {
                document.getElementById("adModal").style.display = "none";
            }
        };

    }


