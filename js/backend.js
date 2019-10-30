'use strict';

(function () {
  var getPhotoURL = 'https://js.dump.academy/keksobooking/data';
  var postSaveFormURL = 'https://js.dump.academy/keksobooking';

  window.backend = {
    load: function (onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
          onLoad(xhr.response);
        } else {
          onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText, 'error');
        }
      });

      xhr.addEventListener('error', function () {
        onError('Произошла ошибка соединения', 'error');
      });
      xhr.addEventListener('timeout', function () {
        onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс', 'error');
      });

      xhr.open('GET', getPhotoURL);
      xhr.send()
    },

    save: function (data, onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
          onLoad(xhr.response, 'success');
        } else {
          onError(xhr.response, 'error');
        }
      });

      xhr.open('POST', postSaveFormURL);
      xhr.send(data);
    }
  }
})();