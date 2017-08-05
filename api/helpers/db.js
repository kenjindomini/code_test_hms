'use strict';

const fs = require('fs');
const crypto = require('crypto');
const _ = require('lodash');

const dbPath = process.env.HMSDBPATH || './db.json';

let _db = {
  participant: {},
  audit: {}
};

const _generateId = function () {
  let id = crypto.randomBytes(10).toString('hex');
  return id;
};

const _writeToDisk = function () {
  return new Promise((resolve, reject) => {
    // write db to disk overwriting the file if it already exists
    fs.writeFile(dbPath, JSON.stringify(_db), (err) => {
      if (err) {
        reject(err);
      } else {
        console.log('db file created/updated.');
        resolve();
      }
    });
  });
};

const _audit = function (action, user, table, id) {
  if (table !== 'audit') {
    // for this test keep the audit "table" to 25 items to keep footprint down
    if (Object.keys(_db.audit).length >= 25) {
      _db.audit = {};
    }
    let audit_id = _generateId();
    let description = `${action.toUpperCase()} ${table}.${id}`;
    _db.audit[audit_id] = {
      audit_id,
      user,
      table,
      id,
      description
    };
  }
  return _writeToDisk();
};

const init = function () {
  return new Promise((resolve, reject) => {
    fs.readFile(dbPath, (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') { // file does not exist
          // create file at path with empty database
          _writeToDisk().then(() => {
            resolve();
          }).catch((err) => {
            reject(err);
          });
        }
      } else {
        _db = JSON.parse(data);
        resolve();
      }
    });
  });
};

const query = function (table, requester, where) {
  let results = _.filter(_db[table], where);
  return _audit('query', requester, table, null);
};

const add = function (table, entity, author) {
  let id = _generateId();
  let id_attr = `${table}_id`;
  entity[id_attr] = id;
  _db[table][id] = entity;
  return _audit('create', author, table, id);
};

const update = function (table, id, entity, author, overwrite = false) {
  let action;
  if (overwrite) {
    let id_attr = `${table}_id`;
    entity[id_attr] = id;
    _db[table][id] = entity;
    action = 'overwrite';
  } else {
    for (let attr in entity) {
      if (entity.hasOwnProperty(attr)) {
        _db[table][id][attr] = entity[attr];
      }
    }
    action = 'update';
  }
  return _audit(action, author, table, id);
};

const remove = function (table, id, author) {
  delete _db[table][id];
  return _audit('delete', author, table, id);
};

module.exports = {
  init: init,
  query: query,
  add: add,
  update: update,
  remove: remove
};