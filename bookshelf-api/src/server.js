/**
 * Server
 * Author: Wildan Aqlis
 */

require('dotenv').config();
const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 9000,
    host: process.env.HOST || 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route(routes);

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

init();
