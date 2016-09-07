/**
 * @fileoverview Универсальный метод для загрузки данных
 * @author Igor Alexeenko (igor.alexeenko@htmlacademy.ru)
 */


'use strict';

define(function() {
  var getSearchString = function(params) {
    return Object.keys(params).map(function(param) {
      return [param, params[param]].join('=');
    }).join('&');
  };

  return {
    load: function(url, params, callback) {
      var xhr = new XMLHttpRequest();

      xhr.onload = function(evt) {
        try {
          var loadedData = JSON.parse(evt.target.response);
          callback(loadedData);
        } catch(err) {
          console.warn(err);
        }
      };

      xhr.open('GET', url + '?' + getSearchString(params));
      xhr.send();
    },

    loadJSONP: function(url, callback, params, cbName) {
      cbName = cbName || 'cb' + Date.now();
      window[cbName] = function() {
        if (typeof callback === 'function') {
          callback();
        }
      };

      var scriptElement = document.createElement('script');
      scriptElement.src = url + '?' + getSearchString(Object.assign({
        'callback': cbName
      }, params));

      scriptElement.async = true;
      scriptElement.defer = true;
      scriptElement.onload = function(evt) {
        delete window[cbName];
        document.body.removeChild(evt.target);
      };

      document.body.appendChild(scriptElement);
    }
  };
});
