(function () {
  'use strict';

<<<<<<< HEAD
  var canvas;
  var tile;
  var selectionOne = {
    selected: false,
    xCoord: 0,
    yCoord: 0,
    letter: 'A'
  };
  var selectionTwo = {
    selected: false,
    xCoord: 0,
    yCoord: 0,
    letter: 'A'
  };
  var letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
  var gameboard = new Array(15);
  for (var i =0; i < 15; i++) {
    gameboard[i] = new Array(15);
    for (var j = 0; j < 15; j++){
      var rando = Math.random() * 26;
      var gamePiece = { letter:letters[Math.floor(rando)], xCoord:0, yCoord:0, isSelected:false };
      gameboard[i][j] = gamePiece;
    }
  }
  var answers = ['bacon','steak','cheese','ribs','ham','chicken','salad','potato','mushroom','pepperoni','sausage','bbq','bread','lettuce','carrot','beans','food'];
=======
    var canvas;
    var tile;
    var selectionOne = {
        selected: false,
        xCoord: 0,
        yCoord: 0,
        letter: "A"
    };
    var selectionTwo = {
        selected: false,
        xCoord: 0,
        yCoord: 0,
        letter: "A"
    };
    var letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    var gameboard = new Array(15);
    for (var i =0; i < 15; i++) {
        gameboard[i] = new Array(15);
        for (var j = 0; j < 15; j++){
            var rando = Math.random() * 26;
            var gamePiece = {letter:letters[Math.floor(rando)], xCoord:0, yCoord:0, isSelected:false};
            gameboard[i][j] = gamePiece;
        }
    }
    var answers = ['bacon','steak','cheese','ribs','ham','chicken','salad','potato','mushroom','pepperoni','sausage','bbq','bread','lettuce','carrot','beans','food'];
>>>>>>> 6c2c0a17cec9d0e9c194c34b9bbb3dc984ecff82

  // Games controller
  angular
    .module('games')
    .controller('GamesController', GamesController);

  GamesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'gameResolve'];

  function GamesController ($scope, $state, $window, Authentication, game) {
    var vm = this;

    vm.authentication = Authentication;
    vm.game = game;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    init(); // initialize the game board
    // Remove existing Game
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.game.$remove($state.go('games.list'));
      }
    }

    // Save Game
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.gameForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.game._id) {
        vm.game.$update(successCallback, errorCallback);
      } else {
        vm.game.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('games.view', {
          gameId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    $scope.clicked = function(event){
      var address = detectClickAddress(event.offsetX, event.offsetY);
      var i = address.iAddress;
      var j = address.jAddress;
      if (selectionOne.found){
        if (address.found){
          if ((selectionOne.xCoord === i && selectionOne.yCoord === j) || (selectionTwo.found && selectionTwo.xCoord === i && selectionTwo.yCoord === j)){
            selectionOne.found = false;
            selectionTwo.found = false;
          } else {
            var compatible = detectCompatibleSelection(address);
            if (compatible){
              selectionTwo.xCoord = i;
              selectionTwo.yCoord = j;
              selectionTwo.letter = address.letter;
              selectionTwo.found = true;
            }
                      // Test if the address found is compatible with selectionOne. In other words, is it on the same x OR y OR is it diagonal. Apply selectionTwo if so
                      // maybe I should found = false on selection one if incompatible thing?
          }
        }
      } else {
        if (address.found){
          selectionOne.xCoord = i;
          selectionOne.yCoord = j;
          selectionOne.letter = address.letter;
          selectionOne.found = true;
        }
      }


          //console.log("mx offset = " + event.offsetX + "   my offset = " + event.offsetY);
      draw();
          //init();
<<<<<<< HEAD
    };
=======
      };
>>>>>>> 6c2c0a17cec9d0e9c194c34b9bbb3dc984ecff82
  }

  function init() {
    canvas = document.getElementById('gameCanvas');
    tile = canvas.getContext('2d');
    draw();
  }

  function draw(){
    tile.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    drawAnswers();
    drawSelection();
  }

  function drawSelection(){

    if (selectionOne.found){
      tile.beginPath();
      tile.arc(25 + selectionOne.xCoord * 32, 17 + selectionOne.yCoord * 32, 12, 0, Math.PI*2, false);
      tile.strokeStyle = '#FF0000';
      tile.stroke();
      tile.closePath();
    }

    if (selectionTwo.found){
      tile.beginPath();
      tile.arc(25 + selectionTwo.xCoord * 32, 17 + selectionTwo.yCoord * 32, 12, 0, Math.PI*2, false);
      tile.strokeStyle = '#FF0000';
      tile.stroke();
      tile.closePath();

      tile.beginPath();
      tile.strokeStyle = '#FFFF00';

      tile.moveTo(25 + selectionOne.xCoord * 32, 17 + selectionOne.yCoord * 32);
      tile.lineTo(25 + selectionTwo.xCoord * 32, 17 + selectionTwo.yCoord * 32);
      tile.stroke();
      tile.closePath();
    }
  }

  function drawBoard(){
    for (var i = 0; i < gameboard.length; i++){
      for (var j = 0; j < gameboard.length; j++){
        var xCoord = 15 + i * 32;
        var yCoord = 25 + j * 32;
        gameboard[i][j].xCoord = xCoord;
        gameboard[i][j].yCoord = yCoord;
        tile.beginPath();
        tile.fillStyle = '#000000';
        tile.font = '24px serif';
        tile.fillText(gameboard[i][j].letter, xCoord, yCoord);
        tile.closePath();
      }
    }
  }

  function drawAnswers(){
    tile.beginPath();
    if (answers.length >= 6) {
      for (var i = 0; i < 6; i++) {
        tile.fillStyle = '#000000';
        tile.font = '24px serif';
        tile.fillText(answers[i], 25, 524 + i * 28);
      }
    } else if (answers >= 12) {

    } else {

    }

<<<<<<< HEAD
    for (var j = 0; j < answers.length; j++) {
      tile.fillStyle = '#000000';
      tile.font = '24px serif';
      if (j < 6) {
        tile.fillText(answers[j], 25, 524 + j * 28);
      } else if (j < 12) {
        tile.fillText(answers[j], 205, 524 + ((j - 6) * 28));
      } else {
        tile.fillText(answers[j], 375, 524 + ((j - 12) * 28));
      }
=======
        for (var j = 0; j < answers.length; j++) {
            tile.fillStyle = "#000000";
            tile.font = '24px serif';
            if (j < 6) {
                tile.fillText(answers[j], 25, 524 + j * 28);
            } else if (j < 12) {
                tile.fillText(answers[j], 205, 524 + ((j - 6) * 28));
            } else {
                tile.fillText(answers[j], 375, 524 + ((j - 12) * 28));
            }
        }
        tile.closePath();
>>>>>>> 6c2c0a17cec9d0e9c194c34b9bbb3dc984ecff82
    }
    tile.closePath();
  }

  function detectCompatibleSelection(secondSel){
    var compatible = false;
    var i = secondSel.iAddress;
    var j = secondSel.jAddress;
    if (i === selectionOne.xCoord || j === selectionOne.yCoord){
      compatible = true;
    }
    var xtest = Math.abs(i - selectionOne.xCoord);
    var ytest = Math.abs(j - selectionOne.yCoord);
    if (xtest === ytest){
      compatible = true;
    }
    return compatible;
  }

  function detectClickAddress(xClick, yClick){
        //console.log("clicked");
    var address = { found:false, xCoord:0, yCoord:0, iAddress: 0, jAddress: 0 };
    for (var i = 0; i < gameboard.length; i++) {
      for (var j = 0; j < gameboard.length; j++) {
        var xCoord = gameboard[i][j].xCoord;
        var yCoord = gameboard[i][j].yCoord;
        var newx = Math.abs(xCoord - xClick + 8);
        var newy = Math.abs(yCoord - yClick - 8);
        var distance = Math.sqrt(newx * newx + newy * newy);
                //console.log("Distance = " + distance);
        if (distance <= 12){
          address.found = true;
          address.xCoord = xCoord;
          address.yCoord = yCoord;
          address.iAddress = i;
          address.jAddress = j;
        }

      }
    }
    return address;
  }

    //console.log("loading");
    //window.onload = init; // initilize the canvas and tile variables after the page loads.
}());
