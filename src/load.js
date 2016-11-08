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

  return function(url, params, callback) {
    var xhr = new XMLHttpRequest();

    xhr.onload = function(evt) {
      var loadedData = JSON.parse(evt.target.response);
      callback(loadedData);
    };

    xhr.open('GET', url + '?' + getSearchString(params));

    xhr.send();
  };
});
