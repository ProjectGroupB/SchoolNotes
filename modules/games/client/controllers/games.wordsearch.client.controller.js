(function () {

    // Games controller
    angular
        .module('games')
        .controller('WordsearchController', WordsearchController);

    WordsearchController.$inject = ['$scope', '$state', '$window', 'Authentication', 'gameResolve'];

    console.log("this runs.");
    function WordsearchController ($scope, $state, $window, Authentication, game) {

    }
}());
