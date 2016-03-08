XMPP Mock
=========
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/) [![Build Status](https://travis-ci.org/jsantiagoh/xmppmock.svg?branch=master)](https://travis-ci.org/jsantiagoh/xmppmock) [![Code Climate](https://codeclimate.com/github/jsantiagoh/xmppmock/badges/gpa.svg)](https://codeclimate.com/github/jsantiagoh/xmppmock) [![bitHound Overall Score](https://www.bithound.io/github/jsantiagoh/xmppmock/badges/score.svg)](https://www.bithound.io/github/jsantiagoh/xmppmock)

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

I recommend using this alongside [Docker compose](https://docs.docker.com/compose/) to test some service connecting to _XMPP Mock_.

For example, below is a sample `docker-compose.yml` that builds and starts a service named _myservice_ connecting to an instance of _xmppmock_.

```yaml
version: "2"
services:
  myservice:
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
