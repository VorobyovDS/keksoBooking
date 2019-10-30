'use strict';

(function () {
    var HEIGHT_PIN = 44; // высота пина
    var HEIGHT_AFTER_PIN = 18; // высота псевдо элемента

  var removePopup = function() {
     this.remove();
  };

  var openPopup = function(popup) {
    popup.classList.add('__visible');

    setTimeout(function () {
      popup.addEventListener('transitionend', removePopup);
      popup.classList.remove('__visible');
    }, 10000)
  };

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
    },

    /*
    *  Константы
    */
    constants: {
      WIDTH_PIN: 40, // ширина пина
      All_HEIGHT_PIN: HEIGHT_PIN + HEIGHT_AFTER_PIN
    },

    /* простой попап для различных всплывающих окон */
    popup: function (msg, theme) {
      var popupWindow = document.createElement('div');
      popupWindow.classList.add('help_popup');
      switch (theme) {
        case 'error': {
          popupWindow.classList.add('__danger');
          break;
        }
        case 'success': {
          popupWindow.classList.add('__success');
          break;
        }
        default: {
          popupWindow.classList.add('__default');
          break;
        }
      }
      popupWindow.textContent = msg;
      document.body.insertAdjacentElement('afterbegin', popupWindow);


      setTimeout(function () {
        openPopup(popupWindow);
      }, 500);
    }
  }
})();