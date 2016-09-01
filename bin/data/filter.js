'use strict';

module.exports = function(list, filterID) {
  switch(filterID) {
    case 'expensive-first':
      return list.sort(function(a, b) {
        return b.price - a.price;
      });
  }

  return list;
};
