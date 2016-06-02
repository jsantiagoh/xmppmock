'use strict'

const xmpp = require('node-xmpp-server')
var server = null

const xml = require('ltx')

const XmppServer = function (serverDomain, serverPort) {
  this.serverDomain = serverDomain
  this.serverPort = serverPort
  this.stanzaHandlers = [
      (stanza) => {console.log(`[R] ${stanza.root().toString()}`)}
  ]

  this.server = new xmpp.C2SServer({port: this.serverPort, domain: this.serverDomain})

  const self = this

  this.server.on('connection', function (client) {

    this.client = client

    client.on('register', function (opts, cb) {
      console.log('REGISTER')
      cb(true)
    })

    client.on('authenticate', function (opts, cb) {
      console.log('server:', opts.username, opts.password, 'AUTHENTICATING')
      if (opts.password != '') {
        console.log('server:', opts.username, 'AUTH OK')
        cb(null, opts)
      } else {
        console.log('server:', opts.username, 'AUTH FAIL')
        cb(false)
      }
    })

    client.on('online', ()=> console.log('server:', client.jid.local, 'ONLINE'))

    client.on('stanza', (stanza) => {
      for (const handler of self.stanzaHandlers) {
        handler(stanza)
      }
    })

    client.on('disconnect', ()=> console.log('server:', client.jid, 'DISCONNECT'))

  })
}

XmppServer.prototype.addStanzaHandler = function (handler) {
  this.stanzaHandlers.push(handler)
}

XmppServer.prototype.start = function (done) {
  const doneFunc = done || function () {
      console.log('XmppServer initialization done, happy hacking')
    }
  this.server.on('listening', doneFunc)
}

XmppServer.prototype.send = function (stanzaString) {
  console.log("stanzaString, ", stanzaString)
  if (!this.server.client) {
    console.error('client is not connected')
  }
  var stanza = xml.parse(stanzaString)
  this.server.client.send(stanza)
}

module.exports = XmppServer

