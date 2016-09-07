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
        var loadedData = JSON.parse(evt.target.response);
        callback(loadedData);
      };

      xhr.open('GET', url + '?' + getSearchString(params));

      xhr.send();
    },

    loadJSONP: function(url, callback, cbName) {
      cbName = cbName || 'cb' + Date.now();
      window[cbName] = callback;

      var scriptElement = document.createElement('script');
      scriptElement.src = url + '?callback=' + cbName;
      scriptElement.async = true;
      document.body.appendChild(scriptElement);
    }
  };
});
