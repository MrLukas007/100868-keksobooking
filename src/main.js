'use strict';


define([
  './hotel',
  './load',
  './utils'
], function(Hotel, load, utils) {
  var THROTTLE_TIMEOUT = 100;
  var HOTELS_LOAD_URL = '/api/hotels';

  var activeFilter = 'all';
  var container = document.querySelector('.hotels-list');
  var filters = document.querySelector('.hotels-filters');
  var footer = document.querySelector('footer');
  var pageNumber = 0;
  var pageSize = 9;

  var renderHotels = function(loadedHotels) {
    loadedHotels.forEach(function(hotelData) {
      container.appendChild(new Hotel(hotelData).element);
    });
  };

  var loadHotels = function(filter, currentPageNumber) {
    load(HOTELS_LOAD_URL, {
      from: currentPageNumber * pageSize,
      to: currentPageNumber * pageSize + pageSize,
      filter: filter
    }, renderHotels);
  };

  var changeFilter = function(filterID) {
    container.innerHTML = '';
    activeFilter = filterID;
    pageNumber = 0;
    loadHotels(filterID, pageNumber);
  };

  var scrollHandler = utils.throttle(function() {
    if (utils.elementIsAtTheBottom(footer)) {
      loadHotels(activeFilter, ++pageNumber);
    }
  }, THROTTLE_TIMEOUT);

  window.addEventListener('scroll', scrollHandler);

  filters.addEventListener('click', function(evt) {
    if (evt.target.classList.contains('hotel-filter')) {
      changeFilter(evt.target.id);
    }
  });

  changeFilter(activeFilter);
});
