'use strict';

(function () {
  var mapCardTemplate = document.querySelector('#map_card_template').content;
  var mapCardList = document.querySelector('.map__pins');
  var pinsAndCrads = {};

  var MAP_PIN_DEFAULT_LOCATION = {x: 385, y: 375}; // дефолтные значения метки

  /* определение заголовка */
  var getTypeTitile = function (currentType) {
    var typeTitle = '';
    switch (currentType) {
      case ('palace'): {
        typeTitle = 'Дворец';
        break;
      }
      case ('flat'): {
        typeTitle = 'Квартира';
        break;
      }
      case ('house'): {
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

  /*
  * функция в которую передаем значение координаты (указанную в объявлении) и её название x или y
 */
  var getCoordsRenderPin = function (value, xOry) {
    var getPinElement = mapCardTemplate.querySelector('.js-map-card');
    var positionStyleCoords = value;

    /*
    * вижу здесь пока несколько вариантов:
    * - самый просто вариант, но не очень гибкий это просто задать константы и скорректировать отображение;
    * - можно вставить дефолтный Pin в дерево, будет всегда скрыт и уже у него вычислить все необходимые значения;
    * - можно ещё после рендеринга пробегаться по значениям и корректирвоать их, но это уже совсем плохой вариант;
    * выбрал пока самый простой из них
    * */

    if (xOry === 'x') {
      positionStyleCoords = value + (window.help.constants.WIDTH_PIN / 2);
    }

    if (xOry === 'y') {
      positionStyleCoords = value - window.help.constants.All_HEIGHT_PIN;
    }

    return positionStyleCoords;
  };

  /* рендер карточек и меток */
  var renderCardMap = function (kard, dataId) {
    var template = mapCardTemplate.cloneNode(true);

    var mapCard = template.querySelector('.js-map-card');
    var featuresElements = template.querySelectorAll('.feature');
    var pin = template.querySelector('.js-map__pin');
    var pinImg = template.querySelector('.js-pin_img_btn');
    var photoIList = template.querySelector('.js-popup__pictures');
    var popupClose = template.querySelector('.js-popup__close');
    var photoItem = photoIList.firstElementChild;

    mapCard.setAttribute('data-kard-id', 'kard_id_' + dataId);
    pin.setAttribute('data-button-id', 'kard_id_' + dataId);
    template.querySelector('.js-popup__avatar').src = kard.author.avatar;
    template.querySelector('.js-popup__title').textContent = kard.offer.title;
    template.querySelector('.js-popup__text--address').textContent = kard.offer.address;
    template.querySelector('.js-popup__text--price').textContent = kard.offer.price;
    template.querySelector('.js-popup__type').textContent = getTypeTitile(kard.offer.type);
    template.querySelector('.js-popup__text--capacity').textContent = kard.offer.rooms + ' комнаты для ' + kard.offer.guests + ' гостей';
    template.querySelector('.js-popup__text--time').textContent = 'заезд после ' + kard.offer.checkin + ' , выезд до ' + kard.offer.checkout;
    template.querySelector('.js-popup__description').textContent = kard.offer.title + ' ' + kard.offer.description;
    pin.style.left = getCoordsRenderPin(kard.location.x, 'x') + 'px';
    pin.style.top = getCoordsRenderPin(kard.location.y, 'y') + 'px';
    pinImg.src = kard.author.avatar;
    pinImg.alt = kard.offer.title;
    pinImg.title = kard.offer.title;

    for (var i = 0; i < kard.offer.photos.length; i++) {
      var photoLi = photoItem.cloneNode(true);
      photoLi.firstElementChild.src = kard.offer.photos[i];

      photoIList.appendChild(photoLi);
    }

    for (var j = 0; j < featuresElements.length; j++) {
      var reg = new RegExp('feature--.*');

      /* получаем классы на элементе, находим нужные, разделяем их и выводим вторую часть */
      var featuresElementsClassFind = featuresElements[j].classList.value.match(reg).toString().split('--')[1];

      /* если элемента в массиве нет, то скрываем его */
      if (!kard.offer.features.includes(featuresElementsClassFind)) {
        featuresElements[j].style.display = 'none';
      }
    }

    pin.addEventListener('click', buttonPinClickHandler);
    popupClose.addEventListener('click', closePopupCard);

    return template;
  };

  var housingType = document.querySelector('#housing-type');
  var housingPrice = document.querySelector('#housing-price');
  var housingRooms = document.querySelector('#housing-rooms');
  var housingGuests = document.querySelector('#housing-guests');

  /* for clear Pin map block */
  var clearPinMap = function () {
    var mapCurrentButton = mapCardList.querySelectorAll('button');
    var mapCurrentArticle = mapCardList.querySelectorAll('article');
    for (var i = 0; i < mapCurrentArticle.length; i++) {
      mapCurrentArticle[i].remove();
    }
    for (var j = 0; j <  mapCurrentButton.length; j++) {
      mapCurrentButton[j].remove();
    }
  };

  var filterPrice = function (selected, value) {
    var isCorrectValue = false;
    switch (selected) {
      case 'middle': {
        isCorrectValue = 10000 < value && value < 50000;
        break;
      }
      case 'low': {
        isCorrectValue = value <= 10000;
        break;
      }
      case 'high': {
        isCorrectValue = value >= 50000;
        break;
      }
      case 'any': {
        isCorrectValue = true;
        break
      }
    }
    return isCorrectValue;
  };

  var filterMap = function () {
    var rerenderMap = pinsAndCrads.slice().filter(function (item) {
      var type = housingType.value !== 'any' ? housingType.value === item.offer.type : true;
      var price = filterPrice(housingPrice.value, item.offer.price);
      var rooms = housingRooms.value !== 'any' ? housingRooms.value == item.offer.rooms : true;
      var guests = housingGuests.value !== 'any' ? housingGuests.value == item.offer.guests : true;
      return type && price && rooms && guests;
    });
    clearPinMap();
    var fragment = document.createDocumentFragment();
    for (var k = 0; k < rerenderMap.length; k++) {
      fragment.appendChild(renderCardMap(rerenderMap[k], k));
    }
    mapCardList.appendChild(fragment);
  };

  var startRenderCards = function (data) {
    pinsAndCrads = data.slice();
    var fragment = document.createDocumentFragment();
    for (var k = 0; k < data.length; k++) {
      fragment.appendChild(renderCardMap(data[k], k));
    }
    mapCardList.appendChild(fragment);
  };

  housingType.addEventListener('change', filterMap);
  housingPrice.addEventListener('change', filterMap);
  housingRooms.addEventListener('change', filterMap);
  housingGuests.addEventListener('change', filterMap);

  var mapKeks = document.querySelector('.js-map'); // карта
  var mapPinDefault = document.querySelector('.js-map__pin--main'); // default метка
  var mapKards = document.querySelectorAll('.js-map-card'); // карточки
  var noticeForm = document.querySelector('.js-notice__form'); // форма
  var formElement = noticeForm.getElementsByTagName('fieldset'); // элемент формы
  var formElementAddresInput = noticeForm.querySelector('#address'); // поля ввода адреса
  formElementAddresInput.value = MAP_PIN_DEFAULT_LOCATION.x + ',' + MAP_PIN_DEFAULT_LOCATION.y; // дефолтные координаты

  /* клик на метке и показ/скрытие карточки */
  var buttonPinClickHandler = function () {
    var kardsIdAtr = this.getAttribute('data-button-id');
    var mapKards = document.querySelectorAll('.js-map-card');
    for (var i = 0; i < mapKards.length; i++) {
      if (mapKards[i].getAttribute('data-kard-id') === kardsIdAtr) {
        mapKards[i].style.display = 'block';
      } else {
        mapKards[i].style.display = 'none';
      }
    }
  };

  var closePopupCard = function () {
    this.parentNode.style.display = 'none';
  };

  var onFormSuccess = function (data, theme) {
    noticeForm.reset();
    window.help.popup('Успешная отправка', theme);
  };

  var onFormError = function (data, theme) {
    console.log(data);
    window.help.popup('Форма не отправлена', theme);
  };

  /* таблица соответвия типа жилья и минимального значения цены за ночь */
  var mapTypeIsMinPrice = {
    "palace": 10000,
    "flat": 1000,
    "house": 5000,
    "bungalo": 0
  };

  var inputPrice = document.getElementById('price');
  var inputType = document.getElementById('type');
  var inputCapacity = document.getElementById('capacity');
  var inputRoomNumber = document.getElementById('room_number');

  window.mapKeksObj = {
    /* активация активного состояния карты и формы */
   activatedMapKeks: function () {
      mapKeks.classList.remove('map--faded');
      noticeForm.classList.remove('notice__form--disabled');
      mapCardList.style.display = "block";

      var mapPins = document.querySelectorAll('.js-map__pin');
      for (var i = 0; i < formElement.length; i++) {
        formElement[i].disabled = false;
      }
      for (var j = 0; j < mapPins.length; j++) {
        mapPins[j].style.display = 'block';
      }

     backend.load(startRenderCards, window.help.popup);

     inputPrice.setAttribute('min', mapTypeIsMinPrice[inputType.value]);
     inputPrice.placeholder = mapTypeIsMinPrice[inputType.value];

     inputType.addEventListener('input', function () {
       inputPrice.setAttribute('min', mapTypeIsMinPrice[inputType.value]);
       inputPrice.placeholder = mapTypeIsMinPrice[inputType.value];
     });

     /* TODO: валидацию формы нужно доработать */
     var checkNumberRoom = function (room_number, capacity) {
       var formError = false;

       switch (room_number.value) {
         case '1': {
           if (capacity.value !== '1') {
             window.help.popup('Доступно «для 1 гостя», поле было изменено! Проверьте форму и отправьте повторно!', 'error');
             capacity.value = 1;
             capacity.style.background = 'rgba(95,222,103,0.87)';
             formError = true;
           }
           break;
         }
         case '2': {
           if (capacity.value < 3 && capacity.value !== 0) {
             window.help.popup('Доступно «для 2 гостей» или «для 1 гостя», поле было изменено! Проверьте форму и отправьте повторно!', 'error');
             capacity.value = 2;
             capacity.style.background = 'rgba(95,222,103,0.87)';
             formError = true;
           }
           break;
         }
         case '3': {
           if (capacity.value < 4 && capacity.value !==0) {
             window.help.popup('Доступно «для 3 гостей», «для 2 гостей» или «для 1 гостя», поле было изменено, Проверьте форму и отправьте повторно!', 'error');
             capacity.value = 2;
             capacity.style.background = 'rgba(95,222,103,0.87)';
             formError = true;
           }
           break;
         }
         case '100': {
           if (capacity.value !== 0) {
             window.help.popup('Доступно «не для гостей», поле было изменено, Проверьте форму и отправьте повторно!', 'error');
             capacity.value = 2;
             capacity.style.background = 'rgba(95,222,103,0.87)';
             formError = true;
           }
           break;
         }
       }

       return formError;
     };

     noticeForm.addEventListener('submit', function (evt) {
       evt.preventDefault();
       if (checkNumberRoom(inputRoomNumber, inputCapacity)) {
         return false;
       } else {
         window.backend.save(new FormData(noticeForm), onFormSuccess, onFormError);
       }
     })
    }
  }
})();
