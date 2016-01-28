'use strict'

const xmpp = require('node-xmpp-server')

const COMPONENT_PORT = process.env.COMPONENT_PORT ? process.env.COMPONENT_PORT : 6666
const COMPONENT_PASS = process.env.COMPONENT_PASS ? process.env.COMPONENT_PASS : 'password'

var server = null
const startServer = function (done) {
  server = new xmpp.ComponentServer({
    port: COMPONENT_PORT
  })

  server.on('connect', function (component) {
    component.on('verify-component', function (jid, cb) {
      console.log(`verify-component '${jid}' on port ${COMPONENT_PORT}, expecting password '${COMPONENT_PASS}'`)
      return cb(null, COMPONENT_PASS)
    })

    component.on('online', () => console.log(`online, ready to receive components at ${COMPONENT_PORT}`))

    component.on('stanza', (stanza) => console.log(`[R] ${stanza.root().toString()}`))

    component.on('disconnect', () => console.log('disconnect'))
  })

  server.on('listening', done)
}

startServer(() => console.log('initialization done, happy hacking'))
