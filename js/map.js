'use strict';

(function () {
  var mapCardTemplate = document.querySelector('#map_card_template').content;
  var mapCardList = document.querySelector('.map__pins');

  var MAP_PIN_DEFAULT_LOCATION = {x: 385, y: 375}; // дефолтные значения метки

  var mapInfo = window.data.getDateInfo(5);

  /* рендер карточек и меток */
  var renderCardMap = function (kard, dataId) {
    var template = mapCardTemplate.cloneNode(true);

    var mapCard = template.querySelector('.js-map-card');
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

  var buttonMouseupHandler = function () {
    activatedMapKeks();
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

  mapPinDefault.addEventListener('mouseup', buttonMouseupHandler);

  var fragment = document.createDocumentFragment();
  for (var i = 0; i < mapInfo.length; i++) {
    fragment.appendChild(renderCardMap(mapInfo[i], i));
  }
  mapCardList.appendChild(fragment);

})();
