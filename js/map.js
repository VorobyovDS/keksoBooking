'use strict';

var mapCardTemplate = document.querySelector('#map_card_template').content;
var mapCardList = document.querySelector('.map__pins');

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

var generateRandomElement = function (array) {
    var arrayRandomNumber = Math.floor(array.length * Math.random());

    return array[arrayRandomNumber]
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

/* Функция для генерации и вывода случайного элемента массива */
var generateArrayNumber = function (array) {
    var randomTypeNumber = Math.floor(array.length * Math.random());

    return array[randomTypeNumber];
};

/* Функция для генерации случайного числа в заданных пределах */
function randomNumber(minNumber, maxNumber) {
    return Math.floor(minNumber + Math.random() * (maxNumber + 1 - minNumber));
}

/* Функция для генерации дополнительных опций для дома */
var generateFeatures = function (array) {
    array.length = randomNumber(1, array.length);

    return array;
};

/* функция для перемешивания массива */
var sortRandomArray = function (array) {
    var j, temp;
    for(var i = array.length - 1; i > 0; i--){
        j = Math.floor(Math.random()*(i + 1));
        temp = array[j];
        array[j] = array[i];
        array[i] = temp;
    }

    return array
};

var addDateInfo = function (number) {
    var dataArray = [];
    var currentObject = {};
    for (i = 0; i < number; i++) {
        currentObject = {
            author: {
                avatar: generateImgSrc(i, 8)
            },
            offer: {
                title: generateTitleKeks(ONE_MANE_KEKS, TWO_MANE_KEKS, FREE_NAME_KEKS), // заголовок
                address: ' ' + randomNumber(300, 900) + ' ' + randomNumber(130, 630), // адрес
                price:  randomNumber(1000, 1000000) + ' ₽/ночь.', // стоимость проживания
                type: generateArrayNumber(TYPE_KEKS), //тип, ну тут надо ещё обдумать что имели ввиду
                rooms: randomNumber(1, 5), // количество комнат
                guests: randomNumber(1, 100), // количество гостей
                checkin: generateArrayNumber(TIME_CHECK), // время заезда
                checkout: generateArrayNumber(TIME_CHECK), // время выезда
                features: generateFeatures(FEATURES_HOUSE), // дополнительные опции
                description: 'Подходит как туристам, так и бизнесменам. Полностью укомплектована и недавно отремонтирована.',
                photos: sortRandomArray(ARRAY_PHOTO) // фото
            },
            location: {
                x: randomNumber(300, 900),
                y: randomNumber(130, 630),
            }
        };
        dataArray.push(currentObject)
    }
    return dataArray;
};

var mapInfo = addDateInfo(5);

var renderCardMap = function (kard) {
    var template = mapCardTemplate.cloneNode(true);

    var pin =  template.querySelector('.js-map__pin');
    var pinImg = template.querySelector('.js-pin_img_btn');
    var photoIList = template.querySelector('.js-popup__pictures');
    var photoItem = photoIList.firstElementChild;

    template.querySelector('.js-popup__avatar').src = kard.author.avatar;
    template.querySelector('.js-popup__title').textContent = kard.offer.title;
    template.querySelector('.js-popup__text--address').textContent = kard.offer.address;
    template.querySelector('.js-popup__text--price').textContent = kard.offer.price;
    template.querySelector('.js-popup__type').textContent = kard.offer.type;
    template.querySelector('.js-popup__text--capacity').textContent = kard.offer.rooms + ' комнаты для ' + kard.offer.guests + ' гостей';
    template.querySelector('.js-popup__text--time').textContent = 'заезд после ' + kard.offer.checkin + ' , выезд до ' + kard.offer.checkout;
    template.querySelector('.js-popup__description').textContent = kard.offer.title + ' ' + kard.offer.description;
    pin.style.left = kard.location.x + 'px';
    pin.style.top = kard.location.y + 'px';
    pinImg.src = kard.author.avatar;
    pinImg.alt = kard.offer.title;
    pinImg.title = kard.offer.title;

    for (var i = 0; i < kard.offer.photos.length; i++) {
        var photoLi = photoItem.cloneNode(true);
        photoLi.firstElementChild.src = kard.offer.photos[i];

        photoIList.appendChild(photoLi);
    }

    return template;
};

var fragment = document.createDocumentFragment();
for (var i = 0; i < mapInfo.length; i++) {
    fragment.appendChild(renderCardMap(mapInfo[i]));
}
mapCardList.appendChild(fragment);