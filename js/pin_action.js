'use strict';

(function () {
  var mapPinsoverlay = document.querySelector('.js-map__pinsoverlay');
  var mapPinsoverlayWidth = mapPinsoverlay.offsetWidth;
  var mapPinsoverlayHeigth = mapPinsoverlay.offsetHeight;
  var mapPinDefault = document.querySelector('.js-map__pin--main'); // default метка
  var noticeForm = document.querySelector('.js-notice__form'); // форма
  var formElementAddresInput = noticeForm.querySelector('#address'); // поля ввода адреса

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
        window.mapKeksObj.activatedMapKeks();
        return;
      }

      formElementAddresInput.value = (mapPinDefault.offsetLeft - window.help.constants.WIDTH_PIN) + ',' + (mapPinDefault.offsetTop - window.help.constants.All_HEIGHT_PIN);
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

      if (correctCoords < window.help.constants.WIDTH_PIN) {
        correctCoords = window.help.constants.WIDTH_PIN;
      }

      if (topOrLeft === 'left') {
        if (correctCoords > mapPinsoverlayWidth - window.help.constants.WIDTH_PIN) {
          correctCoords = mapPinsoverlayWidth - window.help.constants.WIDTH_PIN
        }
      }

      if (topOrLeft === 'top') {
        if (correctCoords > mapPinsoverlayHeigth - window.help.constants.All_HEIGHT_PIN) {
          correctCoords = mapPinsoverlayHeigth - window.help.constants.All_HEIGHT_PIN
        }
      }
      return correctCoords
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  })
})();
