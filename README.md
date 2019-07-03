# aws-signed-axios

[![license](https://img.shields.io/npm/l/aws-signed-axios.svg)](./LICENSE)

Make HTTP requests with an AWSv4 signature.  This library wraps [https://github.com/axios/axios](axios) and signs requests using [aws4](https://github.com/mhart/aws4).
In its current form, this module wraps the axios `request()` function when a URL is provided. Contributions are welcome for other features.

## Usage

```
npm install --save aws-signed-axios
```

```
const signedRequest = require('aws-signed-axios')

const response = signedAxios({
  method: 'GET',
  url
}).then(response => ...)
```

## LICENSE

[MIT](./LICENSE)

