'use strict'

const Database = function () {
  const Datastore = require('nedb')
  this.db = new Datastore()
}

Database.prototype.insert = function (stanza, callback) {
  this.db.insert({xml: `${stanza}`}, callback)
}

Database.prototype.findAll = function (callback) {
  this.db.find({}, callback)
}

Database.prototype.flush = function () {
  this.db.remove({}, { multi: true })
}

module.exports = Database
