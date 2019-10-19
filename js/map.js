'use strict';

(function () {
  var mapCardTemplate = document.querySelector('#map_card_template').content;
  var mapCardList = document.querySelector('.map__pins');

  var MAP_PIN_DEFAULT_LOCATION = {x: 385, y: 375}; // дефолтные значения метки

  var mapInfo = window.data.getDateInfo(5);

  var WIDTH_PIN = 40; // ширина пина
  var HEIGHT_PIN = 44; // высота пина
  var HEIGHT_AFTER_PIN = 18; // высота псевдо элемента

  var All_HEIGHT_PIN = HEIGHT_PIN + HEIGHT_AFTER_PIN;

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
      positionStyleCoords = value + (WIDTH_PIN / 2);
    }

    if (xOry === 'y') {
      positionStyleCoords = value - HEIGHT_PIN - HEIGHT_AFTER_PIN;
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
    template.querySelector('.js-popup__type').textContent = kard.offer.type;
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

  var mapKeks = document.querySelector('.js-map'); // карта
  var mapPinDefault = document.querySelector('.js-map__pin--main'); // default метка
  var mapKards = document.querySelectorAll('.js-map-card'); // карточки
  var noticeForm = document.querySelector('.js-notice__form'); // форма
  var formElement = noticeForm.getElementsByTagName('fieldset'); // элемент формы
  var formElementAddresInput = noticeForm.querySelector('#address'); // поля ввода адреса
  formElementAddresInput.value = MAP_PIN_DEFAULT_LOCATION.x + ',' + MAP_PIN_DEFAULT_LOCATION.y; // дефолтные координаты

  /* активация активного состояния карты и формы */
  var activatedMapKeks = function () {
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
  };

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

  var fragment = document.createDocumentFragment();
  for (var i = 0; i < mapInfo.length; i++) {
    fragment.appendChild(renderCardMap(mapInfo[i], i));
  }
  mapCardList.appendChild(fragment);

  /* нужно будет ещё разделить на модули */
  var mapPinsoverlay = document.querySelector('.js-map__pinsoverlay');
  var mapPinsoverlayWidth = mapPinsoverlay.offsetWidth;
  var mapPinsoverlayHeigth = mapPinsoverlay.offsetHeight;

  mapPinDefault.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var dragged = false;

    var mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);

      if (!dragged) {
        activatedMapKeks();
        return;
      }

      formElementAddresInput.value = (mapPinDefault.offsetLeft - WIDTH_PIN) + ',' + (mapPinDefault.offsetTop - All_HEIGHT_PIN);
    };

    var mouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();

      dragged = true;

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      mapPinDefault.style.top = regularPositionMovePin(mapPinDefault.offsetTop - shift.y, 'top') + 'px';
      mapPinDefault.style.left = regularPositionMovePin(mapPinDefault.offsetLeft - shift.x, 'left') + 'px';
    };

    var regularPositionMovePin = function (currentCoords, topOrLeft) {

      var correctCoords = currentCoords;

      if (correctCoords < WIDTH_PIN) {
        correctCoords = WIDTH_PIN;
      }

      if (topOrLeft === 'left') {
        if (correctCoords > mapPinsoverlayWidth - WIDTH_PIN) {
          correctCoords = mapPinsoverlayWidth - WIDTH_PIN
        }
      }

      if (topOrLeft === 'top') {
        if (correctCoords > mapPinsoverlayHeigth - All_HEIGHT_PIN) {
          correctCoords = mapPinsoverlayHeigth - All_HEIGHT_PIN
        }
      }
      return correctCoords
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  })
})();
