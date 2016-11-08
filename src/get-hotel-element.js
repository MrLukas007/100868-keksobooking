'use strict';

define(function() {
  var IMAGE_LOAD_TIMEOUT = 10000;

  var templateElement = document.querySelector('#hotel-template');
  var elementToClone = 'content' in templateElement ? templateElement.content.querySelector('.hotel') : templateElement.querySelector('.hotel');

  return function(data) {
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
});
