/**
 * @fileoverview Модуль для подключения API Google карт и отображения отелей
 * на карте
 * @author Igor Alexeenko (igor.alexeenko@htmlacademy.ru)
 */

'use strict';

define(['./load'], function(loader) {
  /** @type {boolean} Подключено ли API Google карт */
  var isAPIInitialized = false;


  /** @type {GMap} Объект для работы с картой */
  var mapController = null;


  /** @constant {string} API-ключ для запросов к Google Maps API */
  var GOOGLE_MAPS_KEY = 'AIzaSyApoV_gVN6br56nvhB7UU4rRGXkaXgXCSU';


  /** @constant {string} URL для подключения Google Maps API */
  var GOOGLE_MAPS_URL = [
    'https://maps.googleapis.com/maps/api/js?key=',
    GOOGLE_MAPS_KEY
  ].join('');


  /**
   * @constant {{ lat: number, lng: number }} Координаты центра Токио —
   * изначальная центральная точка, с которой начинается показ карт
   */
  var TOKYO_CENTER = { lat: -34.397, lng: 150.644 };


  /**
   * Конструктор создает только объект для управления картой,
   * но не инициализирует карту. Инициализация происходит
   * позже — когда загрузится API карт и пользователю будет
   * показана часть карты. В этот же момент, уже снаружи
   * станет доступен контрол показа карты
   * @constructor
   */
  var GMap = function() {
    this.container = null;
    this.defaults = { center: TOKYO_CENTER, zoom: 8 };
    this.isDecorated = false;
    this.mapElement = null;
  };


  /**
   * Метод, который инициализирует карту на переданном DOM-элементе
   * и, если необходимо, раскрывает ее на весь экран. Метод статический —
   * он записан не в прототип, а в конструктор объекта. Это значит что метод
   * можно применять к любым объектам карты, чтобы он производил над ними
   * определенные действия, но при этом этот метод не является частью самого
   * объекта
   * @static
   * @param {GMap} map
   * @param {HTMLElement} container
   * @param {boolean=} expand Флаг, показывающий, открывать ли карту сразу после
   * инициализации. Необязательный параметр
   * @param {Function=} onDecorate
   */
  GMap.decorate = function(map, container, expand, onDecorate) {
    map.container = container;
    map.mapElement = new window.google.maps.Map(this.container, this.defaults);
    map.isDecorated = true;

    if (typeof onDecorate === 'function') {
      onDecorate();
    }

    if (expand) {
      map.setMarkers(markers || []);
      map.show();
    }
  };

  GMap.prototype.show = function() {

  };

  GMap.prototype.hide = function() {

  };

  /** @param {Array.<Object>} markers */
  GMap.prototype.setMarkers = function(markers) {
    this.markers = markers;
  };

  /**
   * Из модуля экспортируется не объект, управляющий картой, а функция, которая
   * инкапсулирует создание объекта, потому что работа с объектом достаточно
   * специфична и чтобы правильно создать объект нужно выполнить определенную
   * последовательность действий: если карта не была инициализирована, нужно
   * подключить API карт и только после этого создать объект карты и произвести
   * изначальные действия над ним и только после этого вернуть.
   * @param {HTMLElement} container
   * @param {boolean=} expandByDefault
   * @param {Function=} onDecorate
   * @return {GMap}
   */
  return function(container, expandByDefault, onDecorate) {
    if (!isAPIInitialized) {
      mapController = new GMap();
      loader.loadJSONP(GOOGLE_MAPS_URL, function() {
        GMap.decorate(mapController, container, expandByDefault, onDecorate);
        isAPIInitialized = true;
      });
    }

    // NB! Модуль всегда возвращает один объект, несмотря на то, что этот объект
    // создается с помощью конструктора. Это частая практика: иногда объект
    // может существовать на странице в единственном экземпляре. В этом случае
    // ООП используется во-первых для удобного описания интерфейса объекта,
    // во-вторых для остальных преимуществ объектного подхода — наследования
    // и полиморфизма: экспортируемый объект, пусть существует в единственном
    // экземпляре может быть унаследован от другого объекта и может пользоваться
    // методами и свойствами других объектов (тот же toString).
    //
    // Подход к созданию объекта, всегда существующего в единственном экземпляре
    // распространен в программировании и является одним из классических
    // паттернов ООП — синглтоном (англ. Singleton — одиночка)
    return mapController;
  };
});
