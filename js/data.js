'use strict';

(function () {
  /* массивы для формирования названий зданий */
  var ONE_MANE_KEKS = ['Большая', 'Маленькая', 'Огромная', 'Средняя', 'Миниатюрная', 'Микроскопическа'];
  var TWO_MANE_KEKS = ['прекрасная', 'ужасная', 'великолепная', 'могучая', 'галактическая', 'просторная'];
  var FREE_NAME_KEKS = ['квартира', 'вилла', 'дача', 'резиденция', 'комната в многоэтажке', 'дача для лилипутов'];

  /* массив для типа дома */
  var TYPE_KEKS = ['palace', 'flat', 'house', 'bungalo'];

  /* массив времени заезда/выезда */
  var TIME_CHECK = ['12:00', '13:00', '14:00'];

  /* массив видимо с доп. опциями для домов */
  var FEATURES_HOUSE = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

  var ARRAY_PHOTO = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

  /* Функция для генерации названия для дома */
  var generateTitleKeks = function (arr1, arr2, arr3) {
    var title = '';
    var minCount = Math.min(arr1.length, arr2.length, arr3.length);
    var randomNumber = Math.floor(minCount * Math.random());

    if (!minCount) {
      title = 'Ничем не примечательный дом';
      return title;
    }

    title = arr1.splice(randomNumber, 1) + ' ' + arr2.splice(randomNumber, 1) + ' ' + arr3.splice(randomNumber, 1);

    return title;
  };

  /* Функция для генерации путей для аватарок */
  var generateImgSrc = function (index, maxImg) {
    var imgSrc = '';
    if (maxImg >= index + 1) {
      if (index > 8) {
        imgSrc = 'img/avatars/user' + (index + 1) + '.png';
      } else {
        imgSrc = 'img/avatars/user0' + (index + 1) + '.png';
      }

      return imgSrc;
    }
    return imgSrc = 'img/avatars/default.png';
  };

  /*
  * метод для генерации дополнительных опций для дома
  */
  var generateFeatures = function (array) {
    var newArray = [];
    var randomLength =  Math.max(1, Math.floor(Math.random() * array.length));

    for ( var i = 0; i < randomLength; i++) {
      newArray.push(array[i])
    }

    return newArray;
  };

  /* определение заголовка */
  var getTypeTitile = function (currentType) {
    var typeTitle = '';
    switch (currentType) {
      case('palace'): {
        typeTitle = 'Дворец';
        break;
      }
      case('flat'): {
        typeTitle = 'Квартира';
        break;
      }
      case('house'): {
        typeTitle = 'Дом';
        break;
      }
      case ('bungalo'): {
        typeTitle = 'Бунгало';
        break;
      }
      default:
        typeTitle = 'Нет информации';
        break;
    }
    return typeTitle;
  };

  window.data = {
    getDateInfo: function (number) {
      var dataArray = [];
      var currentObject = {};
      for (var i = 0; i < number; i++) {
        currentObject = {
          author: {
            avatar: generateImgSrc(i, 8)
          },
          offer: {
            title: generateTitleKeks(ONE_MANE_KEKS, TWO_MANE_KEKS, FREE_NAME_KEKS), // заголовок
            address: ' ' + window.help.getRandomNumber(300, 900) + ' ' + window.help.getRandomNumber(130, 630), // адрес
            price: window.help.getRandomNumber(1000, 1000000) + ' ₽/ночь.', // стоимость проживания
            type: getTypeTitile(window.help.generateArrayNumber(TYPE_KEKS)),
            rooms: window.help.getRandomNumber(1, 5), // количество комнат
            guests: window.help.getRandomNumber(1, 100), // количество гостей
            checkin: window.help.generateArrayNumber(TIME_CHECK), // время заезда
            checkout: window.help.generateArrayNumber(TIME_CHECK), // время выезда
            features: generateFeatures(FEATURES_HOUSE), // дополнительные опции
            description: 'Подходит как туристам, так и бизнесменам. Полностью укомплектована и недавно отремонтирована.',
            photos: window.help.sortRandomArray(ARRAY_PHOTO) // фото
          },
          location: {
            x: window.help.getRandomNumber(300, 900),
            y: window.help.getRandomNumber(200, 630),
          }
        };
        dataArray.push(currentObject)
      }
      return dataArray;
    }
  }
})();
