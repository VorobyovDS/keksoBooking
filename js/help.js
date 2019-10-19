'use strict';

(function () {
  window.help = {
    /*
    * метод для перемешивания массива
    */
    sortRandomArray: function (array) {
      var j, temp;
      for (var i = array.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = array[j];
        array[j] = array[i];
        array[i] = temp;
      }

      return array
    },

    /*
    *  метод для генерации случайного числа в заданных пределах
    */
    getRandomNumber: function (minNumber, maxNumber) {
    return Math.floor(minNumber + Math.random() * (maxNumber + 1 - minNumber));
  },

    /*
    *  метод для генерации и вывода случайного элемента массива
    */
    generateArrayNumber: function (array) {
      var randomTypeNumber = Math.floor(array.length * Math.random());

      return array[randomTypeNumber];
    }
  }
})();