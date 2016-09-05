'use strict';

const express = require('express');
const hotels = require('./data/hotels');
const serveStatic = express.static;
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackMiddlewareConfig = require('./middleware.config.js');


const PORT = parseInt(process.argv[2], 10) || 1506;


const isJSONPRequest = (req) => {
  return 'callback' in req.query;
};


const serve = serveStatic(webpackConfig.devServer.contentBase, {
  'index': ['index.html', 'index.htm']
});
const app = express();
const compiler = webpack(webpackConfig);
const middleware = webpackMiddleware(compiler, webpackMiddlewareConfig);
app.use(middleware);


app.
    get('/api/hotels', (req, res) => {
      hotels.read(req.query.filter, req.query.from, req.query.to).then((data) => {
        if (isJSONPRequest(req)) res.jsonp(data);
        else res.json(data);
      }).catch(err => {
        console.error('Ошибка при запросе к API', err.message);
        res.status(500).send(err);
      });
    }).
    get('*', serve);


app.listen(PORT, '0.0.0.0', (err) => {
  if (err) console.error('Ошибка!', err);

  console.info('==> 🌎 Сервер запущен на порту %s. Откройте http://localhost:%s/ у себя в браузере. Чтобы остановить сервер, нажмите Ctrl+C', PORT, PORT);
});
