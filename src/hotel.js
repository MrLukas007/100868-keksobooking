/**
 * @fileoverview Отель
 * @author Igor Alexeenko (igor.alexeenko@htmlacademy.ru)
 */


'use strict';


define([
  './gallery',
  './load'
], function(gallery, load) {
  /** @constant {number} */
  var IMAGE_LOAD_TIMEOUT = 10000;

  var templateElement = document.querySelector('#hotel-template');
  var elementToClone = 'content' in templateElement ? templateElement.content.querySelector('.hotel') : templateElement.querySelector('.hotel');

  var getHotelElement = function(data) {
    var element = elementToClone.cloneNode(true);
    element.querySelector('.hotel-name').textContent = data.name;

    var backgroundImage = new Image();
    var backgroundLoadTimeout;

    /** @param {ProgressEvent} evt */
    backgroundImage.onload = function(evt) {
      clearTimeout(backgroundLoadTimeout);
      element.style.backgroundImage = 'url(\'' + evt.target.src + '\')';
    };

    backgroundImage.onerror = function() {
      element.classList.add('hotel-nophoto');
    };

    backgroundImage.src = data.preview;

    backgroundLoadTimeout = setTimeout(function() {
      backgroundImage.src = '';
      element.classList.add('hotel-nophoto');
    }, IMAGE_LOAD_TIMEOUT);

    return element;
  };


  var Hotel = function(data) {
    this.data = data;
    this.element = getHotelElement(data);

    this.onBackgroundClick = this.onBackgroundClick.bind(this);

    this.element.addEventListener('click', this.onBackgroundClick);

  };

  Hotel.prototype.onBackgroundClick = function(evt) {
    if (evt.target.classList.contains('hotel')) {
      gallery.show(this.data.pictures);
    }
  };

  Hotel.prototype.remove = function() {
    this.element.removeEventListener('click', this.onBackgroundClick);
  };

  return Hotel;
});
