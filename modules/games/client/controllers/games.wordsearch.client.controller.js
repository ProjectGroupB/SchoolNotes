// word search variables
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
var answers;

var app = angular.module('games');
app.controller('WordsearchController', function($scope) {

  $scope.init = function(gameData){
    //gameData.game = game;
    parseAnswers(gameData);
    parseGameboard(gameData);
    init();// initialize the game board, this should only fire if the wordsearch gameveiw has been loaded

  }


  $scope.clicked = function(event){
    var address = detectClickAddress(event.offsetX, event.offsetY);
    checkSelection(address);
    var foundString = getTextString();
    if (foundString.length > 0){
      // when a string is found, I need to leave the line / circle around the found word so it remains rendering.
      checkStringIsAnswer(foundString);
    }
    draw();
  };
});

  function init() {
    canvas = document.getElementById('gameCanvas');
    tile = canvas.getContext('2d');
    draw();
  }

  function parseAnswers(vm){
    var answerList = vm.answerLine;
    answerList = answerList.replace(/\s+/g, '');
    answerList = answerList.split(',');
    answers = new Array(answerList.length);
    for (var i = 0; i < answerList.length; i++){
      var start = { selected:false, xCoord:0, yCoord:0, letter:'A'};
      var end = { selected:false, xCoord:0, yCoord:0, letter:'A'};
      answers[i] = { string:answerList[i], found:false, selectionFirst:start, selectionSecond:end };
    }
  }

  function parseGameboard(vm){
    for (var i = 0; i < gameboard.length; i++){
      gameboard[i] = new Array(15);
    }
    parseGameboardLine(vm.line1, 0);
    parseGameboardLine(vm.line2, 1);
    parseGameboardLine(vm.line3, 2);
    parseGameboardLine(vm.line4, 3);
    parseGameboardLine(vm.line5, 4);
    parseGameboardLine(vm.line6, 5);
    parseGameboardLine(vm.line7, 6);
    parseGameboardLine(vm.line8, 7);
    parseGameboardLine(vm.line9, 8);
    parseGameboardLine(vm.line10, 9);
    parseGameboardLine(vm.line11, 10);
    parseGameboardLine(vm.line12, 11);
    parseGameboardLine(vm.line13, 12);
    parseGameboardLine(vm.line14, 13);
    parseGameboardLine(vm.line15, 14);
  }

  function parseGameboardLine(line, boardj){
    line = line.replace(/\s+/g, ''); // remove all the empty space
    line = line.replace(',', ''); // remove any commas
    line = line.toUpperCase(); // make all caps
    for (var i = 0; i < 15; i++){
      if (line.length >= i){
        var gamePiece = { letter:line[i], xCoord:0, yCoord:0, isSelected:false };
        gameboard[i][boardj] = gamePiece;
      } else {
        // The line that was saved is short, add in random letters to make up the difference
        var rando = Math.random() * 26;
        var piece = { letter:letters[Math.floor(rando)], xCoord:0, yCoord:0, isSelected:false };
        gameboard[i][boardj] = piece;
      }
    }
  }

  /* Calls all the draw functions */
  function draw(){
    tile.clearRect(0, 0, canvas.width, canvas.height);
    drawFoundAnswers();
    drawSelection();
    drawBoard();
    drawAnswers();
    drawWinner();
  }

  /* Checks all the answers to see if they are all found. If so, renders indication the player has won */
  function drawWinner(){
    var isWinner = true;
    for (var i = 0; i < answers.length; i++){
      if (!answers[i].found){
        isWinner = false;
      }
    }
    if (isWinner){
      tile.beginPath();
      tile.strokeStyle = '#36a500';
      tile.fillStyle = '#000000';
      tile.lineWidth = 25;
      tile.fillRect(100, 90, 300, 200);
      tile.clearRect(110, 100, 280, 180);
      tile.strokeRect(120, 110, 260, 160);
      tile.font = 'bold 42pt serif';
      tile.fillText('You Win!', 137, 208);
      tile.closePath();
    }
  }

  /* Draws the selection arounnd the letter(s) */
  function drawSelection(){
    if (selectionOne.found){
      tile.beginPath();
      tile.arc(25 + selectionOne.xCoord * 32, 17 + selectionOne.yCoord * 32, 10, 0, Math.PI*2, false);
      tile.lineWidth = 1;
      tile.strokeStyle = '#f8e947';
      tile.fillStyle = '#f8e947';
      tile.fill();
      tile.stroke();
      tile.closePath();
    }

    if (selectionTwo.found){
      tile.beginPath();
      tile.arc(25 + selectionTwo.xCoord * 32, 17 + selectionTwo.yCoord * 32, 10, 0, Math.PI*2, false);
      tile.lineWidth = 1;
      tile.strokeStyle = '#f8e947';
      tile.fillStyle = '#f8e947';
      tile.fill();
      tile.stroke();
      tile.closePath();

      tile.beginPath();
      tile.lineWidth = 20;
      tile.strokeStyle = '#f8e947';
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
        tile.fillStyle = '#000000';
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
        tile.fillStyle = '#36a500';
      } else {
        tile.fillStyle = '#000000';
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

  function drawFoundAnswers(){
    for (var i = 0; i < answers.length; i++) {
      if (answers[i].found){

        var foundAnswer = answers[i];
        var start = {x:foundAnswer.selectionFirst.xCoord, y:foundAnswer.selectionFirst.yCoord};
        var end = {x:foundAnswer.selectionSecond.xCoord, y:foundAnswer.selectionSecond.yCoord};

        tile.beginPath();
        tile.lineWidth = 1;
        tile.arc(25 + start.x * 32, 17 + start.y * 32, 12, 0, Math.PI*2, false);
        tile.strokeStyle = '#36a500';
        tile.fill();
        tile.fillStyle = '#36a500';
        tile.stroke();
        tile.arc(25 + end.x * 32, 17 + end.y * 32, 12, 0, Math.PI*2, false);
        tile.fill();
        tile.stroke();
        tile.closePath();

        tile.beginPath();
        tile.strokeStyle = '#36a500';
        tile.lineWidth = 26;
        tile.moveTo(25 + start.x * 32, 17 + start.y * 32);
        tile.lineTo(25 + end.x * 32, 17 + end.y * 32);
        tile.stroke();
        tile.closePath();
      }
    }
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
    var reverseString = '';
    for (var i = string.length - 1; i >= 0; i--) {
      reverseString += string[i];
    }
    reverseString = reverseString.toString().toLowerCase();
    for (var j = 0; j < answers.length; j++) {
      var stringTest = string.toString().toLowerCase();
      var answerTest = answers[j].string.toString().toLowerCase();
      if (answerTest.valueOf() === stringTest.valueOf() || answerTest.valueOf() === reverseString.valueOf()){
        answers[j].found = true;
        answers[j].selectionFirst = { selected:true, xCoord:selectionOne.xCoord, yCoord:selectionOne.yCoord, letter:selectionOne.letter};
        answers[j].selectionSecond = { selected:true, xCoord:selectionTwo.xCoord, yCoord:selectionTwo.yCoord, letter:selectionTwo.letter};
        selectionOne.selected = false;
        selectionTwo.selected = false;
        console.log('Found answer: ' + answers[j].string);
      }
    }
  }

  /* Checks the two selection points and gets returns a string between the points */
  function getTextString(){
    // I am betting this function can be optimizted in some clever way.
    var returnValue = '';
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
          for (var j = selectionOne.yCoord; j <= selectionTwo.yCoord; j++){
            returnValue += gameboard[selectionOne.xCoord][j].letter;
          }
        }
      } else if (selectionOne.yCoord === selectionTwo.yCoord) {
        // horizontal
        if (selectionOne.xCoord > selectionTwo.xCoord){
          for (var k = selectionTwo.xCoord; k <= selectionOne.xCoord; k++){
            returnValue += gameboard[k][selectionOne.yCoord].letter;
          }
        } else {
          for (var l = selectionOne.xCoord; l <= selectionTwo.xCoord; l++){
            returnValue += gameboard[l][selectionOne.yCoord].letter;
          }
        }
      } else {
        //diagonal
        if (selectionOne.xCoord > selectionTwo.xCoord) {
          //selectionTwo is first, going left to right
          if (selectionOne.yCoord > selectionTwo.yCoord){
            // going left to right, bottom to top
            for (var m = selectionTwo.xCoord, n = selectionTwo.yCoord; m <= selectionOne.xCoord; m++, n++){
              returnValue += gameboard[m][n].letter;
            }
          } else {
            // doing left to right, top to bottom
            for (var o = selectionTwo.xCoord, p = selectionTwo.yCoord; o <= selectionOne.xCoord; o++, p--){
              returnValue += gameboard[o][p].letter;
            }
          }
        } else {
          //selectionOne is first, going left to right
          if (selectionTwo.yCoord > selectionOne.yCoord){
            // going left to right, bottom to top
            for (var q = selectionOne.xCoord, r = selectionOne.yCoord; q <= selectionTwo.xCoord; q++, r++){
              returnValue += gameboard[q][r].letter;
            }
          } else {
            // doing left to right, top to bottom
            for (var s = selectionOne.xCoord, t = selectionOne.yCoord; s <= selectionTwo.xCoord; s++, t--){
              returnValue += gameboard[s][t].letter;
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

