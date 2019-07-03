'use strict'

const axios = require('axios')
const AWS = require('aws')

module.exports = {
  signedAxios
}

function signedAxios(request) {
  const { host, pathname, search } = new URL(request.url)
  request.host = host
  request.path = pathname + search

  const signedRequest = aws4.sign(request, {
    secretAccessKey: AWS.config.credentials.secretAccessKey,
    accessKeyId: AWS.config.credentials.accessKeyId,
    sessionToken: AWS.config.credentials.sessionToken
  })

  delete signedRequest.headers['Host']
  delete signedRequest.headers['Content-Length']
  return axios(signedRequest)
}
