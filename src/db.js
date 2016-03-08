'use strict'
const Datastore = require('nedb')

class Database {
  constructor () {
    this.db = new Datastore()
  }

  insert (stanza, callback) {
    this.db.insert({xml: `${stanza}`}, callback)
  }

  findAll (callback) {
    this.db.find({}, callback)
  }

  flush () {
    this.db.remove({}, { multi: true }, (err, numRemoved) => {
      if (err) {
        console.error(`error flushing database: ${err}`)
      } else {
        console.log(`flushed ${numRemoved} stanzas from the db`)
      }
    })
  }
}

module.exports = Database
