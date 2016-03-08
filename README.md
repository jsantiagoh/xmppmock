XMPP Mock
=========

The purpose of this project is to provide an XMPP endpoint for integration tests of services that require a [XEP-0114](http://www.xmpp.org/extensions/xep-0114.html) connection.


Requirements
============

Development Requirements
------------------------
- Node.js 5.7.1
- [Standard](http://standardjs.com/)
- [Mocha](https://mochajs.org/)
- [Docker](https://www.docker.com/)

Usage
=====

```yaml
version: "2"
services:
  mycomponent:
    build: .
    links:
      - xmppmock:xmppmock.local
    ports:
      - 80:80

  xmppmock:
    image: jsantiagoh/xmppmock
    environment:
      - COMPONENT_PORT=11221
      - COMPONENT_PASS=pass11221
    ports:
      - 3000:3000
```


[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
