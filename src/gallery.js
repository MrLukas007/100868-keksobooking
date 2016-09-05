/**
 * @fileoverview Компонента фотогалереи
 * @author Igor Alexeenko (igor.alexeenko@htmlacademy.ru)
 */


'use strict';


define(function() {
  var Gallery = function() {
    this.pictures = [];
    this.activePicture = 0;

    this.galleryContainer = document.querySelector('.gallery');
    this.closeElement = this.galleryContainer.querySelector('.gallery-close');
    this.previewElement = this.galleryContainer.querySelector('.gallery-picture');
    this.thumbnailsContainer = this.galleryContainer.querySelector('.gallery-thumbnails');
  };


  Gallery.prototype.show = function(pictures) {
    if (pictures !== this.galleryPictures) {
      this.thumbnailsContainer.innerHTML = '';

      this.galleryPictures = pictures;

      pictures.forEach(function(pic) {
        var pictureElement = new Image();
        pictureElement.classList.add('gallery-thumbnails-image');
        this.thumbnailsContainer.appendChild(pictureElement);
        pictureElement.src = pic;
      }, this);
    }

    this.galleryContainer.classList.remove('hidden');

    var self = this;

    this.closeElement.onclick = function() {
      self.hide();
    };

    this.setActivePicture(0);
  };


  Gallery.prototype.hide = function() {
    this.galleryContainer.classList.add('hidden');
    this.closeElement.onclick = null;
  };


  Gallery.prototype.setActivePicture = function(picture) {
    this.activePicture = picture;

    var thumbnails = this.thumbnailsContainer.querySelectorAll('img');

    var currentlyActivePic = this.thumbnailsContainer.querySelector('.active');
    if (currentlyActivePic) {
      currentlyActivePic.classList.remove('active');
    }

    thumbnails[picture].classList.add('active');
    this.previewElement.src = thumbnails[picture].src;
  };

  return new Gallery();
});
