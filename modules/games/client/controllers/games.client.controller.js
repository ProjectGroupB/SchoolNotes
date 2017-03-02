(function () {
  'use strict';
    // word search variables
    var canvas;
    var tile;
    var selectionOne = {
        selected: false,
        xCoord: 0,
        yCoord: 0,
        letter: "A"
    }
    var selectionTwo = {
        selected: false,
        xCoord: 0,
        yCoord: 0,
        letter: "A"
    }
    var letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    var gameboard = new Array(15);
    var answers;

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

    if (game.name != undefined){
      parseAnswers(vm);
      parseGameboard(vm);
      init();// initialize the game board, this should only fire if the wordsearch gameveiw has been loaded

    }
    $scope.gameTypes = ["Wordsearch", "Maze", "Test"];

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

    $scope.dropDownChange = function(event){

    }

    $scope.clicked = function(event){
      // eventually I will have to pass the clicked event on to the function that is based on whatever game we are going to run.
      // I might even be wise to get the games running in a seperate javascript file
      var address = detectClickAddress(event.offsetX, event.offsetY);
      checkSelection(address);
      var foundString = getTextString();
      if (foundString.length > 0){
        // when a string is found, I need to leave the line / circle around the found word so it remains rendering.
        checkStringIsAnswer(foundString);
      }
      draw();
    }
  }

  function init() {
    canvas = document.getElementById("gameCanvas");
    tile = canvas.getContext("2d");
    draw();
  }

  function parseAnswers(vm){
      var answerList = vm.game.answerLine
      answerList = answerList.replace(/\s+/g, '');
      answerList = answerList.split(",")
      answers = new Array(answerList.length);
      for (var i = 0; i < answerList.length; i++){
          answers[i] = {string:answerList[i], found:false, selectionFirst:selectionOne, selectionSecond:selectionTwo};
      }
  }

  function parseGameboard(vm){
    for (var i = 0; i < gameboard.length; i++){
      gameboard[i] = new Array(15);
    }
    parseGameboardLine(vm.game.line1, 0);
    parseGameboardLine(vm.game.line2, 1);
    parseGameboardLine(vm.game.line3, 2);
    parseGameboardLine(vm.game.line4, 3);
    parseGameboardLine(vm.game.line5, 4);
    parseGameboardLine(vm.game.line6, 5);
    parseGameboardLine(vm.game.line7, 6);
    parseGameboardLine(vm.game.line8, 7);
    parseGameboardLine(vm.game.line9, 8);
    parseGameboardLine(vm.game.line10, 9);
    parseGameboardLine(vm.game.line11, 10);
    parseGameboardLine(vm.game.line12, 11);
    parseGameboardLine(vm.game.line13, 12);
    parseGameboardLine(vm.game.line14, 13);
    parseGameboardLine(vm.game.line15, 14);
  }

  function parseGameboardLine(line, boardj){
      line = line.replace(/\s+/g, ''); // remove all the empty space
      line = line.replace(',', ''); // remove any commas
      line = line.toUpperCase(); // make all caps
      for (var i = 0; i < 15; i++){
          if (line.length >= i){
              var gamePiece = {letter:line[i], xCoord:0, yCoord:0, isSelected:false};
              gameboard[i][boardj] = gamePiece;
          } else {
              // The line that was saved is short, add in random letters to make up the difference
              var rando = Math.random() * 26;
              var gamePiece = {letter:letters[Math.floor(rando)], xCoord:0, yCoord:0, isSelected:false};
              gameboard[i][boardj] = gamePiece;
          }
      }
  }

  /* Calls all the draw functions */
  function draw(){
    tile.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    drawAnswers();
    drawSelection();
  }

  /* Draws the selection arounnd the letter(s) */
  function drawSelection(){
    if (selectionOne.found){
      tile.beginPath();
      tile.arc(25 + selectionOne.xCoord * 32, 17 + selectionOne.yCoord * 32, 12, 0, Math.PI*2, false);
      tile.strokeStyle = "#FF0000";
      tile.stroke();
      tile.closePath();
    }

    if (selectionTwo.found){
        tile.beginPath();
      tile.arc(25 + selectionTwo.xCoord * 32, 17 + selectionTwo.yCoord * 32, 12, 0, Math.PI*2, false);
      tile.strokeStyle = "#FF0000";
      tile.stroke();
      tile.closePath();

      tile.beginPath();
      tile.strokeStyle = "#FFFF00";

      tile.moveTo(25 + selectionOne.xCoord * 32, 17 + selectionOne.yCoord * 32);
      tile.lineTo(25 + selectionTwo.xCoord * 32, 17 + selectionTwo.yCoord * 32);
      tile.stroke();
      tile.closePath();
    }
  }

   /* Draws the game board in the form of a 15x15 word search game board */
  function drawBoard(){
    for (var i = 0; i < gameboard.length; i++){
      for (var j = 0; j < gameboard.length; j++){
        var xCoord = 15 + i * 32;
        var yCoord = 25 + j * 32;
        gameboard[i][j].xCoord = xCoord;
        gameboard[i][j].yCoord = yCoord;
        tile.beginPath();
        tile.fillStyle = "#000000";
        tile.font = '24px serif';
        tile.fillText(gameboard[i][j].letter, xCoord, yCoord);
        tile.closePath();
      }
    }
  }
   /* draws the answers at the bottom of the game board */
  function drawAnswers(){
    tile.beginPath();
    for (var i = 0; i < answers.length; i++) {
      if (answers[i].found){
        tile.fillStyle = "#FF0000";
      } else {
        tile.fillStyle = "#000000";
      }
      tile.font = '24px serif';
      if (i < 6) {
          tile.fillText(answers[i].string, 25, 524 + i * 28);
      } else if (i < 12) {
          tile.fillText(answers[i].string, 205, 524 + ((i - 6) * 28));
      } else {
          tile.fillText(answers[i].string, 375, 524 + ((i - 12) * 28));
      }
    }
    tile.closePath();
  }

  /* Checks if the click address has selected the first or second letter */
  function checkSelection(address){
    var i = address.iAddress;
    var j = address.jAddress;
    if (selectionOne.found && selectionTwo.found){
        selectionOne.found = false;
        selectionTwo.found = false;
    }
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
          } else {
            selectionOne.xCoord = i;
            selectionOne.yCoord = j;
            selectionOne.letter = address.letter;
            selectionOne.found = true;
          }
          // Test if the address found is compatible with selectionOne. In other words, is it on the same x OR y OR is it diagonal. Apply selectionTwo if so, if not, change selectionOne
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
  }

  /* Check if string is an answer */
  function checkStringIsAnswer(string){
    var reverseString = "";
    for (var i = string.length - 1; i >= 0; i--) {
      reverseString += string[i];
    }
    reverseString = reverseString.toString().toLowerCase();
    for (var i = 0; i < answers.length; i++) {
      var stringTest = string.toString().toLowerCase();
      var answerTest = answers[i].string.toString().toLowerCase();
      if (answerTest.valueOf() === stringTest.valueOf() || answerTest.valueOf() === reverseString.valueOf()){
        answers[i].found = true;
        console.log("Found answer: " + answers[i].string);
      }
    }
  }

  /* Checks the two selection points and gets returns a string between the points */
  function getTextString(){
    // I am betting this function can be optimizted in some clever way.
    var returnValue = "";
    if (selectionOne.found && selectionTwo.found){
      if (selectionOne.xCoord === selectionTwo.xCoord) {
        //vertical
        if (selectionOne.yCoord > selectionTwo.yCoord){
            //selectionTwo is first, reading left to right
          for (var i = selectionTwo.yCoord; i <= selectionOne.yCoord; i++){
            returnValue += gameboard[selectionOne.xCoord][i].letter;
          }
        } else {
            //selectionOne is first, reading left to right
          for (var i = selectionOne.yCoord; i <= selectionTwo.yCoord; i++){
            returnValue += gameboard[selectionOne.xCoord][i].letter;
          }
        }
      } else if (selectionOne.yCoord === selectionTwo.yCoord) {
        // horizontal
        if (selectionOne.xCoord > selectionTwo.xCoord){
          for (var i = selectionTwo.xCoord; i <= selectionOne.xCoord; i++){
            returnValue += gameboard[i][selectionOne.yCoord].letter;
          }
        } else {
          for (var i = selectionOne.xCoord; i <= selectionTwo.xCoord; i++){
            returnValue += gameboard[i][selectionOne.yCoord].letter;
          }
        }
      } else {
        //diagonal
        if (selectionOne.xCoord > selectionTwo.xCoord) {
          //selectionTwo is first, going left to right
          if (selectionOne.yCoord > selectionTwo.yCoord){
          // going left to right, bottom to top
            for (var i = selectionTwo.xCoord, j = selectionTwo.yCoord; i <= selectionOne.xCoord; i++, j++){
              returnValue += gameboard[i][j].letter;
            }
          } else {
          // doing left to right, top to bottom
            for (var i = selectionTwo.xCoord, j = selectionTwo.yCoord; i <= selectionOne.xCoord; i++, j--){
                returnValue += gameboard[i][j].letter;
            }
          }
        } else {
          //selectionOne is first, going left to right
          if (selectionTwo.yCoord > selectionOne.yCoord){
            // going left to right, bottom to top
            for (var i = selectionOne.xCoord, j = selectionOne.yCoord; i <= selectionTwo.xCoord; i++, j++){
                returnValue += gameboard[i][j].letter;
            }
          } else {
            // doing left to right, top to bottom
            for (var i = selectionOne.xCoord, j = selectionOne.yCoord; i <= selectionTwo.xCoord; i++, j--){
                returnValue += gameboard[i][j].letter;
            }
          }
        }
      }
    }
    return returnValue;
  }

  /* Checks if a selection range is valid */
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

  /* Detect the address of the letter clicked on the game board */
    function detectClickAddress(xClick, yClick){
      //console.log("clicked");
      var address = {found:false, xCoord:0, yCoord:0, iAddress: 0, jAddress: 0};
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
