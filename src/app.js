'use strict'

const express = require('express')
const EventEmitter = require('events')
const ewait = require('ewait')
const Xmpp = require('./xmpp')
const XmppServer = require('./xmpp-server')
const Database = require('./db')
const bodyParser = require('body-parser')

const COMPONENT_PORT = process.env.COMPONENT_PORT ? process.env.COMPONENT_PORT : 6666
const COMPONENT_PASS = process.env.COMPONENT_PASS ? process.env.COMPONENT_PASS : 'password'

const SERVER_HOST = process.env.SERVER_HOST ? process.env.SERVER_HOST : 'localhost'
const SERVER_PORT = process.env.SERVER_PORT ? process.env.SERVER_PORT : 5552

const xmpp = new Xmpp(COMPONENT_PORT, COMPONENT_PASS)
const xmppServer = new XmppServer(SERVER_HOST, SERVER_PORT)

class Eventer extends EventEmitter {}

const emitter = new Eventer()

const db = new Database()

// Indicates if something received through XMPP
var dirty = false

xmpp.addStanzaHandler((stanza) => {
  db.insert(stanza, (err, newdoc) => {
    if (err) {
      console.error(`error inserting document: ${err}`)
      return
    }
    emitter.emit('inserted')
    dirty = true
  })
})

xmppServer.addStanzaHandler((stanza) => {
  db.insert(stanza, (err, newdoc) => {
    if (err) {
      console.error(`error inserting document: ${err}`)
      return
    }
    emitter.emit('inserted')
    dirty = true
  })
})

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(require('morgan')('dev'))
app.use((err, req, res, next) => {
  console.error(err.stack)
  next(err)
})

app.get('/', (req, res) => {
  res.json({ status: 'ok' }).end()
})

app.get('/v1/stanzas', (req, res) => {
  function findAndRespond () {
    db.findAll((err, docs) => {
      if (err) {
        res.status(500).send(err).end()
        return
      }
      res.json(docs).end()
    })
  }
  if (dirty) {
    findAndRespond()
  } else {
    ewait.waitForAll([emitter], (err) => {
      if (err) {
        console.log('Timeout waiting for stanzas')
      }
      findAndRespond()
    }, 10000, 'inserted')
  }
})

app.post('/v1/stanzas', (req, res) => {
  console.log(req.body)
  xmpp.send(req.body.stanza)
  res.status(200).end()
})

app.post('/server/v1/stanzas', (req, res) => {
  console.log(req.body)
  xmppServer.send(req.body.stanza)
  res.status(200).end()
})

app.delete('/v1/stanzas', (req, res) => {
  db.flush()
  dirty = false
  res.status(200).end()
})

app.listen(3000, () => { console.log('XMPP Mock listening on port 3000!') })

xmpp.start()
xmppServer.start()

