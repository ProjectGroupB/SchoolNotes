'use strict';

var canvas;
var tile;
var entries;
var hasLetters = false;
var longestWord;
var offset = 0;

var app = angular.module('games');
app.controller('ScrambleController', function($scope) {
  $scope.init = function(gameData){
    console.log('init scope');
    parseEntires(gameData);
    getLongestWord();
    initScramble();
  };

  $scope.clicked = function(event){
    console.log('scramble click');

  };
});

function initScramble() {
  canvas = document.getElementById('scrambleCanvas');
  tile = canvas.getContext('2d');
  drawScramble();
}

function parseEntires(vm){
  entries = new Array(vm.size);
  hasLetters = vm.hasletters;
  if (entries.length >= 1){ entries[0] = getEntry(vm.scram1, vm.word1, vm.letterpos1)}
  if (entries.length >= 2){ entries[1] = getEntry(vm.scram2, vm.word2, vm.letterpos2)}
  if (entries.length >= 3){ entries[2] = getEntry(vm.scram3, vm.word3, vm.letterpos3)}
  if (entries.length >= 4){ entries[3] = getEntry(vm.scram4, vm.word4, vm.letterpos4)}
  if (entries.length >= 5){ entries[4] = getEntry(vm.scram5, vm.word5, vm.letterpos5)}
  if (entries.length >= 6){ entries[5] = getEntry(vm.scram6, vm.word6, vm.letterpos6)}
  if (entries.length >= 7){ entries[6] = getEntry(vm.scram7, vm.word7, vm.letterpos7)}
  if (entries.length >= 8){ entries[7] = getEntry(vm.scram8, vm.word8, vm.letterpos8)}
  if (entries.length >= 9){ entries[8] = getEntry(vm.scram9, vm.word9, vm.letterpos9)}
  if (entries.length >= 10){ entries[9] = getEntry(vm.scram10, vm.word10, vm.letterpos10)}
  if (entries.length >= 11){ entries[10] = getEntry(vm.scram11, vm.word11, vm.letterpos11)}
  if (entries.length >= 12){ entries[11] = getEntry(vm.scram12, vm.word12, vm.letterpos12)}
  if (entries.length >= 13){ entries[12] = getEntry(vm.scram13, vm.word13, vm.letterpos13)}
  if (entries.length >= 14){ entries[13] = getEntry(vm.scram14, vm.word14, vm.letterpos14)}
  if (entries.length >= 15){ entries[14] = getEntry(vm.scram15, vm.word15, vm.letterpos15)}
  if (entries.length >= 16){ entries[15] = getEntry(vm.scram16, vm.word16, vm.letterpos16)}
  if (entries.length >= 17){ entries[16] = getEntry(vm.scram17, vm.word17, vm.letterpos17)}
  if (entries.length >= 18){ entries[17] = getEntry(vm.scram18, vm.word18, vm.letterpos18)}
  if (entries.length >= 19){ entries[18] = getEntry(vm.scram19, vm.word19, vm.letterpos19)}
  if (entries.length >= 20){ entries[19] = getEntry(vm.scram20, vm.word20, vm.letterpos20)}
  console.log(entries[0]);
}

function getEntry(scram, word, letterpos){
  var entry = {
    scramble: scram,
    answer: word,
    letterPos: letterpos
  };
  return entry;
}

function drawScramble(){
  tile.beginPath();
  for (var i = 0; i < entries.length; i++) {
    tile.font = '24px serif';
    var num = i + 1 + '. ';
    if (i < 9){
      num += '  ';
    }
    tile.fillText(entries[i].scramble, 25 + offset, 35 + i * 32);
    var wordLength = entries[i].answer.length;
    for (var j = 0; j < wordLength; j++) {
      if (entries[i].answer[j] !== ' ') {
        if (j + 1 === entries[i].letterPos){
          drawBox(120 + (j * 42), 38 + i * 32, false);
        }else {
          drawUnderline(120 + (j * 42), 37 + i * 32, false);
        }
      }
    }
  }
  tile.closePath();
}

function drawUnderline(x, y, highlight) {
  x = x + offset;
  tile.beginPath();
  tile.lineWidth = 2;
  if (highlight) {
    tile.strokeStyle = '#00B000';
  } else {
    tile.strokeStyle = '#000000';
  }
  tile.moveTo(x, y);
  tile.lineTo(x + 32, y);
  tile.stroke();
  tile.closePath();
}

function drawBox(x, y, highlight){
  x = x + offset;
  tile.beginPath();
  tile.lineWidth = 2;
  if (highlight) {
    tile.strokeStyle = '#00B000';
  } else {
    tile.strokeStyle = '#000000';
  }
  tile.moveTo(x, y);
  tile.lineTo(x + 32, y);
  tile.moveTo(x, y - 26);
  tile.lineTo(x + 32, y - 26);
  tile.moveTo(x, y);
  tile.lineTo(x, y - 26);
  tile.moveTo(x + 32, y);
  tile.lineTo(x + 32, y - 26);
  tile.stroke();
  tile.closePath();
}

function getLongestWord(){
  var longest = 0;
  for (var i = 0; i < entries.length; i++){
    var l = entries[i].answer.length;
    if (l > longest){
      longest = l;
    }
  }
  //25 == offset 0
  // subtract 20 for size less than
  offset = + (25 - longest) * 20;
  // TODO add a minor offset to offset the scrambled words from the answer lines
  console.log('offset = ' + offset);
}
