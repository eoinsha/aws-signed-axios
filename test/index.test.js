'use strict'

const AWS = require('aws-sdk')
const proxyquire = require('proxyquire')
const { test } = require('tap')

test('Request is signed', async t => {
  AWS.config.credentials = {
    secretAccessKey: 'dummy-secret',
    accessKeyId: 'dummy-key'
  }
  const url = 'https://api.example.com/api/person'
  const payload = {
    name: 'Jo Bloggs',
    age: 80
  }

  const received = {}

  const signedAxios = proxyquire('..', {
    axios: {
      request: function mockRequest () {
        received.requestArgs = arguments
        return Promise.resolve({})
      }
    },
    aws4: {
      sign: function mockSign (request, options) {
        received.signArgs = { request, options }
        return request
      }
    }
  })

  const result = await signedAxios({
    url,
    method: 'POST',
    data: payload
  })

  t.equal(received.signArgs.request.host, 'api.example.com')
  t.same(JSON.parse(received.requestArgs[0].data), payload)

  t.same(result, {})
  t.end()
})
