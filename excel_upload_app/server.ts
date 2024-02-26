import 'zone.js/node';
import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { renderModule } from '@angular/platform-server';

// Importar fetch
const fetch = require('node-fetch');

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();
  const { provideModuleMap } = require('@nguniversal/module-map-ngfactory-loader');

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Configurar el uso de fetch para HttpClient
  server.use('*', (req, res, next) => {
    req['protocol'] = req.protocol;
    req['hostname'] = req.hostname;
    req['originalUrl'] = req.originalUrl;
    next();
  });

  server.use((req, res, next) => {
    const scheme = req.protocol;
    const protocol = `${scheme}://${req.get('host')}`;
    const url = `${protocol}${req.originalUrl}`;

    commonEngine
      .render({
        document: indexHtml,
        url: url,
        providers: [
          { provide: APP_BASE_HREF, useValue: '/' },
          { provide: 'serverUrl', useValue: `${scheme}://${req.headers.host}` }
        ]
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
