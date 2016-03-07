'use strict'

const xmpp = require('node-xmpp-server')
const xml = require('ltx')

const Xmpp = function (componentPort, componentPass) {
  this.componentPort = componentPort
  this.componentPass = componentPass
  this.stanzaHandlers = [
    (stanza) => { console.log(`[R] ${stanza.root().toString()}`) }
  ]

  this.server = new xmpp.ComponentServer({
    port: this.componentPort
  })

  const self = this
  this.server.on('connect', function (component) {
    this.component = component

    component.on('verify-component', function (jid, cb) {
      console.log(`verify-component '${jid}' on port ${self.componentPort}, expecting password '${self.componentPass}'`)
      return cb(null, self.componentPass)
    })

    component.on('online', () => console.log(`online, ready to receive components at ${self.componentPort}`))

    component.on('stanza', (stanza) => {
      for (const handler of self.stanzaHandlers) {
        handler(stanza)
      }
    })

    component.on('disconnect', () => console.log('disconnect'))
  })
}

Xmpp.prototype.addStanzaHandler = function (handler) {
  this.stanzaHandlers.push(handler)
}

Xmpp.prototype.start = function (done) {
  const doneFunc = done || function () { console.log('initialization done, happy hacking') }
  this.server.on('listening', doneFunc)
}

Xmpp.prototype.send = function (stanzaString) {
  if (!this.server.component) {
    console.error('component is not connected')
  }
  var stanza = xml.parse(stanzaString)
  this.server.component.send(stanza)
}
module.exports = Xmpp
