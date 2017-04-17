
    'use strict';

    angular.module('sponsors').controller('SponsorsManageController', SponsorsManageController);

    SponsorsManageController.$inject = ['$scope','SponsorsService'];

    function SponsorsManageController($scope, SponsorsService, sponsor) {
        $scope.sponsors = SponsorsService.query();
        $scope.sponsor = sponsor;

        $scope.makeAd = function(){
            document.getElementById("adModal").style.display = "block";
        };

        document.getElementsByClassName("close")[0].onclick = function() {
            document.getElementById("adModal").style.display = "none";
        };

        window.onclick = function(event) {
            if (event.target === document.getElementById("adModal")) {
                document.getElementById("adModal").style.display = "none";
            }
        };

        // assign ad to the proper ad space in api
        document.getElementById("left-btn").onclick = function() {

        };
    }


