/**
 * @fileoverview Модуль для подключения API Google карт и отображения отелей
 * на карте
 * @author Igor Alexeenko (igor.alexeenko@htmlacademy.ru)
 */

'use strict';

define(['./load', './utils'], function(loader, utils) {
  /** @type {boolean} Подключено ли API Google карт */
  var isAPIInitialized = false;


  /** @type {GMap} Объект для работы с картой */
  var mapController = null;


  /** @constant {string} API-ключ для запросов к Google Maps API */
  var GOOGLE_MAPS_KEY = 'AIzaSyApoV_gVN6br56nvhB7UU4rRGXkaXgXCSU';


  /** @constant {string} URL для подключения Google Maps API */
  var GOOGLE_MAPS_URL = '//maps.googleapis.com/maps/api/js';


  /**
   * @constant {number} Продолжительность анимации по переключения режима
   * карты. При изменении размеров контейнера, у блока с картой Google нужно
   * вызывать метод resize, чтобы карта адаптировалась под новые размеры
   * блока. В нашем случае размер карты меняется плавно, с помощью CSS-анимации,
   * поэтому событие обновления размера нужно вызывать только один раз в конце
   * анимации
   */
  var MAPS_ANIMATION_TIMEOUT = 500;


  /**
   * @constant {{ lat: number, lng: number }} Координаты центра Токио —
   * изначальная центральная точка, с которой начинается показ карт
   */
  var TOKYO_CENTER = { lat: 35.6895, lng: 139.6917 };

  /**
   * Конструктор создает только объект для управления картой,
   * но не инициализирует карту. Инициализация происходит
   * позже — когда загрузится API карт и пользователю будет
   * показана часть карты. В этот же момент, уже снаружи
   * станет доступен контрол показа карты
   * @constructor
   */
  var GMap = function() {
    /** @type {HTMLElement} */
    this.container = null;

    /** @type {HTMLElement} */
    this.mapContainer = null;

    /** @type {boolean} */
    this.isDecorated = false;

    /** @type {google.maps.Map} */
    this.mapElement = null;

    /** @type {google.maps.MapOptions} */
    this.defaults = {
      center: TOKYO_CENTER,
      scrollwheel: false,
      zoom: 14
    };
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
    map.mapContainer = map.container.querySelector('.map-container');
    map.mapElement = new window.google.maps.Map(map.mapContainer, map.defaults);
    map.isDecorated = true;

    if (typeof onDecorate === 'function') {
      onDecorate();
    }

    if (expand) {
      map.show();
    }
  };

  GMap.prototype.show = function() {
    utils.setElementHidden(this.container, false);

    setTimeout(function() {
      google.maps.event.trigger(this.mapElement, 'resize');
    }, MAPS_ANIMATION_TIMEOUT);
  };

  GMap.prototype.hide = function() {
    utils.setElementHidden(this.container, true);

    setTimeout(function() {
      google.maps.event.trigger(this.mapElement, 'resize');
    }, MAPS_ANIMATION_TIMEOUT);
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
      }, { key: GOOGLE_MAPS_KEY });
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
