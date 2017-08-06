'use strict';

const hapi = require('hapi');
const participantController = require('./api/controllers/participant');
const db = require('./api/helpers/db');

const server = new hapi.Server();
server.connection({
  port: 3001,
  host: 'localhost'
});

const routes = [
  {
    method: 'GET',
    path: '/participant/{participant_id?}',
    config: {
      description: 'Get participant(s)',
      tags: ['api', 'participant']
    },
    handler: participantController.getParticipant
  },
  {
    method: 'POST',
    path: '/participant',
    config: {
      description: 'Add participant',
      tags: ['api', 'participant']
    },
    handler: participantController.postParticipant
  },
  {
    method: 'PATCH',
    path: '/participant/{participant_id}',
    config: {
      description: 'Add participant',
      tags: ['api', 'participant']
    },
    handler: participantController.postParticipant
  },
  {
    method: 'GET',
    path: '/{file?}',
    config: {
      description: 'Serve content',
      tags: ['content']
    },
    handler: function (request, reply) {
      let file = request.params.file || 'add_participant.html';
      reply.file(`./ui/${file}`);
    }
  }
];

const plugins = [
  require('inert')
];

server.route(routes);

db.init().then(() => {
  server.register(plugins, (err) => {
    if (err) {
      console.log('Failed to load 1 or more plugins');
      throw err;
    }
    server.start((err) => {
      if(err) {
        throw err;
      }

      console.log(`Server running at: ${server.info.uri}`);
    });
  });
}).catch((err) => {
  console.log('db.init() failed!');
  console.dir(err);
  throw err;
});