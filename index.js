'use strict';

const hapi = require('hapi');
const participantController = require('./api/controllers/participant');

const server = new hapi.Server();
server.connection({
  port: 3001,
  host: 'localhost'
});

const routes = [
  {
    method: 'GET',
    path: '/participant/{participant_id?}',
    handler: participantController
  },
  {
    method: 'POST',
    path: '/participant',
    handler: participantController
  }
];

server.route(routes);

server.start((err) => {
  if(err) {
    throw err;
  }

  console.log(`Server running at: ${server.info.uri}`);
});