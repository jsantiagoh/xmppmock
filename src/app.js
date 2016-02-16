'use strict'

const express = require('express')
const Xmpp = require('./xmpp')
const Database = require('./db')

const COMPONENT_PORT = process.env.COMPONENT_PORT ? process.env.COMPONENT_PORT : 6666
const COMPONENT_PASS = process.env.COMPONENT_PASS ? process.env.COMPONENT_PASS : 'password'

const xmpp = new Xmpp(COMPONENT_PORT, COMPONENT_PASS)

const db = new Database()
xmpp.addStanzaHandler((stanza) => {
  db.insert(stanza, (err, newdoc) => {
    if (err) console.error(`error inserting document: ${err}`)
  })
})

const app = express()
app.use(require('morgan')('dev'))
app.use((err, req, res, next) => {
  console.error(err.stack)
  next(err)
})

app.get('/', (req, res) => {
  res.json({ status: 'ok' }).end()
})

app.get('/v1/stanzas', (req, res) => {
  db.findAll((err, docs) => {
    if (err) {
      res.status(500).send(err).end()
    }
    res.json(docs).end()
  })
})

app.delete('/v1/stanzas', (req, res) => {
  db.flush()
  res.status(200).end()
})

app.listen(3000, () => { console.log('XMPP Mock listening on port 3000!') })

xmpp.start()
