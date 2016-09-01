'use strict';

const getPage = require('./get-page');
const filter = require('./filter');
const fs = require('fs');
const levelup = require('levelup');
const path = require('path');


const datePrecision = 10000000;
const DBNAME = 'hotels';
const FILENAME = 'hotels.json';
const twoWeeks = 2 * 7 * 24 * 60 * 60 * 1000;


const getRandTimestampInRange = (range) => {
  return Date.now() - Math.random() * range;
};

const restoreDate = (date, precision) => {
  return new Date(date * precision);
};

const roundDate = (date, precision) => {
  return parseInt(date / precision);
};

const preprocessRec = (rec) => {
  return Object.assign({}, {
    id: rec.key,
    created: restoreDate(rec.key, datePrecision)
  }, rec.value);
};


const db = levelup(path.resolve(__dirname, DBNAME), { valueEncoding: 'json' });


module.exports = {
  regenerate: () => {
    return new Promise((resolve, reject) => {
      let fileContent = fs.readFileSync(path.resolve(__dirname, FILENAME), 'utf-8');
      let data = JSON.parse(fileContent);

      let actions = data.map(rec => ({
        type: 'put',
        key: roundDate(getRandTimestampInRange(twoWeeks), datePrecision),
        value: rec
      }));

      db.batch(actions, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  },

  read: (filterID, from, to) => {
    from = typeof from === 'undefined' ? -Infinity : from;
    to = typeof to === 'undefined' ? Infinity : to;

    let data = [];

    return new Promise((resolve, reject) => {
      db.createReadStream().
          on('data', record => data.push(preprocessRec(record))).
          on('error', err => reject(err)).
          on('end', () => resolve(
            getPage(filter(data, filterID), from, to)
          ));
    });
  }
};
