'use strict'

const assert = require('assert')
const Database = require('../src/db')

const stanza = '<message type="chat" from="some.user.001@test.domain" to="nagios.fitnesse700.2214@test.domain" id="nb0xq" xmlns:stream="http://etherx.jabber.org/streams"><body>hello world</body></message>'

describe('the database', function () {
  const db = new Database()
  it('saves and gets items correctly', (done) => {
    db.insert(stanza, (err, newdoc) => {
      if (err) return done(err)

      db.findAll((err, docs) => {
        if (err) return done(err)

        assert.equal(1, docs.length)
        assert.equal(stanza, docs[0].xml)
        done()
      })
    })
  })
})
