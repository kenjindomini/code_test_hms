'use strict';

const getParticipant = function (request, reply) {
  let participant_id = request.params.participant_id || null;
  reply();
};

const postParticipant = function (request, reply) {
  //
};

module.exports = {
  getParticipant: getParticipant,
  postParticipant: postParticipant
};