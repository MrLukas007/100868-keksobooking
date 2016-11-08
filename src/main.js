'use strict';


define([
  './hotel',
  './load'
], function(Hotel, load) {
  var THROTTLE_TIMEOUT = 200;
  var GAP = 100;
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

  filters.addEventListener('click', function(evt) {
    if (evt.target.classList.contains('hotel-filter')) {
      changeFilter(evt.target.id);
    }
  });

  var lastCall = Date.now();

  window.addEventListener('scroll', function() {
    console.log('scroll');
    if (Date.now() - lastCall >= THROTTLE_TIMEOUT) {
      console.log('complex scroll');
      if (footer.getBoundingClientRect().bottom - window.innerHeight <= GAP) {
        loadHotels(activeFilter, ++pageNumber);
      }

      lastCall = Date.now();
    }
  });

  changeFilter(activeFilter);
});
