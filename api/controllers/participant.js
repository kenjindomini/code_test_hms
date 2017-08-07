'use strict';

const util = require('util');
const db = require('../helpers/db');
const _ = require('lodash');

const DB_TABLE_PARTICIPANT = 'participant';

const getParticipant = function (request, reply) {
  let participant_id = request.params.participant_id || null;
  let limit = request.query.limit || 10;
  let page = request.query.page || 1;
  let requester = request.query.requester;
  db.query(DB_TABLE_PARTICIPANT, requester, (participant) => {
    if (_.isNull(participant_id)) {
      return true;
    } else {
      return participant.participant_id = participant_id;
    }
  }).then((results) => {
    let pageIndex = page - 1;
    let totalParticipants = results.length;
    let meta = {
      total: totalParticipants
    };
    results = _.sortBy(results, ['name']);
    results = _.chunk(results, limit)[pageIndex];
    results.splice(0, 0, meta);
    reply(results);
  }).catch((err) => {
    console.log(`db.query(${DB_TABLE_PARTICIPANT}, ${requester}, _.filter predicate) Failed!`);
    console.dir(err);
    throw err;
  });
};

const postParticipant = function (request, reply) {
  console.log('in postParticipant');
  let author = request.payload.author;
  let participant_entity = request.payload.participant;
  console.log(util.inspect(request.payload, false, null));
  db.add(DB_TABLE_PARTICIPANT, participant_entity, author).then(() => {
    reply();
  }).catch((err) => {
    console.log(`db.add(${DB_TABLE_PARTICIPANT}, ${util.inspect(participant_entity, false, null)}, ${author}) Failed!`);
    console.dir(err);
    throw err;
  });
};

const patchParticipant = function (request, reply) {
  console.log('in patchParticipant');
  let author = request.payload.author;
  let participant_id = request.params.participant_id;
  let participant_entity = request.payload.participant;
  console.log(util.inspect(request.payload, false, null));
  db.update(DB_TABLE_PARTICIPANT, participant_id, participant_entity, author).then(() => {
    reply();
  }).catch((err) => {
    console.log(`db.update(${DB_TABLE_PARTICIPANT}, ${participant_id}, ${util.inspect(participant_entity, false, null)}, ${author}) Failed!`);
    console.dir(err);
    throw err;
  });
};

module.exports = {
  getParticipant: getParticipant,
  postParticipant: postParticipant,
  patchParticipant: patchParticipant
};