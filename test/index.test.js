'use strict'

const AWS = require('aws-sdk')
const proxyquire = require('proxyquire')
const { test } = require('tap')

const url = 'https://api.example.com/api/person'

const perms = [
  {
    payload: {
      name: 'Jo Bloggs',
      age: 80
    },
    credentials: {
      secretAccessKey: 'dummy-secret',
      accessKeyId: 'dummy-key'
    },
    expected: {
      host: 'api.example.com',
      payload: {
        name: 'Jo Bloggs',
        age: 80
      }
    }
  },
  {
    headers: {
      host: 'alternative.example.com'
    },
    expected: {
      host: 'alternative.example.com',
      payload: undefined
    }
  },
  {
    payload: 'just-a-string',
    expected: {
      host: 'api.example.com',
      payload: 'just-a-string'
    }
  }
]

perms.forEach(({
  payload,
  headers,
  expected,
  credentials
}) =>
  test('Request is signed', async t => {
    AWS.config.credentials = credentials

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
      data: payload,
      headers
    })

    t.equal(received.signArgs.request.host, expected.host)
    if (expected.payload) {
      if (typeof expected.payload === 'string') {
        t.equal(received.requestArgs[0].data, expected.payload)
      } else {
        t.same(JSON.parse(received.requestArgs[0].data), expected.payload)
      }
    } else {
      t.notOk(expected.payload)
    }

    t.same(result, {})
    t.end()
  }))
