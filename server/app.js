/* eslint-disable */
import 'regenerator-runtime/runtime';
import express from 'express';
import path from 'path';
import fs from 'fs';
import morgan from 'morgan';
import cors from 'cors';

// constants needed
const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 1338 : process.env.PORT;
const app = express();
const graphqlHTTP = require('express-graphql');
const query = 'query { employees { id, numemployees, location }}';

if (isDeveloping) {
  app.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });
  app.use(morgan('combined'));
}

app.use(express.static(__dirname + '/public'));

(async () => {
  try {
    app.use(
      '/api',
      cors()
    );

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'public/index.html'));
    });

    app.listen(port, '0.0.0.0', (err) => {
      if (err) { return console.warn(err); };
      return console.info(
        `==> 😎 Listening on port ${port}.
        Open http://0.0.0.0:${port}/ in your browser.`
        );
    });

  }
  catch(err) {

  }
})();
/* eslint-enable */