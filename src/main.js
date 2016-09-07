'use strict';


define([
  './hotel',
  './load',
  './map',
  './utils'
], function(Hotel, loader, initializeMap, utils) {
  var THROTTLE_TIMEOUT = 100;
  var HOTELS_LOAD_URL = '/api/hotels';

  var activeFilter = 'all';
  var container = document.querySelector('.hotels-list');
  var filters = document.querySelector('.hotels-filters');
  var footer = document.querySelector('footer');
  var mapContainer = document.querySelector('.map');
  var pageNumber = 0;
  var pageSize = 9;

  var isMapRequested = function() {
    return location.hash.indexOf('map') > -1;
  };

  var renderHotels = function(loadedHotels) {
    loadedHotels.forEach(function(hotelData) {
      container.appendChild(new Hotel(hotelData).element);
    });
  };

  var loadHotels = function(filter, currentPageNumber) {
    loader.load(HOTELS_LOAD_URL, {
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

  changeFilter(activeFilter);

  /**
   * Проверка состояния приложения — запрошена ли карта. В случае если карта
   * запрошена, скачивается список отелей и карта разворачивается на полный
   * экран. В противном случае ничего не происходит
   * @param {GMap} map
   */
  var checkMap = function(map) {
    if (isMapRequested()) {
      map.show();

      // NB! На открытой карте должен быть показан не тот список, который
      // отображен в виде карточек, а полный список всех отелей Токио, потому
      // что постраничное отображение и фильтры — это особенность отрисовки
      // исключительно списка, а не карты. Поэтому перед открытием карты
      // будем загружать все отели Токио и передавать их в объект карты
      // для отрисовки
      loader.load(HOTELS_LOAD_URL, { }, function(loadedMarkers) {
        map.setMarkers(loadedMarkers);
      });
    } else {
      map.hide();
    }
  };

  /** @type {GMap} */
  var mapController = initializeMap(mapContainer, function() {
    checkMap(mapController);
  });

  /**
   * @override Обработчик клика по переключателю карты. Наличие абстрактного
   * обработчика позволяет описывать поведение карты по-разному. В нашем
   * случае при клике на переключатель изменяется только адрес страницы,
   * а карта уже реагирует на изменение адреса и принимает решение, стоит ли
   * переключиться в полноэкранный режим
   */
  mapController.onSwitchClick = function() {
    location.hash = isMapRequested() ? '' : 'map';
  };

  window.addEventListener('scroll', scrollHandler);
  window.addEventListener('popstate', function() {
    checkMap(mapController);
  });

  filters.addEventListener('click', function(evt) {
    if (evt.target.classList.contains('hotel-filter')) {
      changeFilter(evt.target.id);
    }
  });
});
