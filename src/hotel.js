/**
 * @fileoverview Отель
 * @author Igor Alexeenko (igor.alexeenko@htmlacademy.ru)
 */


'use strict';


define([
  './gallery',
  './load',
  './get-hotel-element'
], function(gallery, load, getHotelElement) {
  var Hotel = function(data) {
    this.data = data;
    this.element = getHotelElement(data);

    this._onBackgroundClick = this._onBackgroundClick.bind(this);

    this.element.addEventListener('click', this._onBackgroundClick);
  };


  Hotel.prototype._onBackgroundClick = function(evt) {
    if (evt.target.classList.contains('hotel')) {
      gallery.show(this.data.pictures);
    }
  };

  Hotel.prototype.remove = function() {
    this.element.removeEventListener('click', this._onBackgroundClick);
  };

  return Hotel;
});
