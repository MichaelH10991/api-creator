# api-creator

An express wrapper which allows you to quickly and dynamically create api endpoints, without having to worry about boilerplate code.

## Installation

`npm i @iobxt/api-creator`

## Usage

Create a directory structure, something like this:

```
api
  |- foo
    |- doSomething.js
```

Your api endpoints must look something like this:

```javascript
// doSomething.js
const init = (router, config, resources) => {
  router.get('/hello', (req, res) => res.send('hello'));
};

module.exports = { init };
```

Initialise the library with something like this:

```javascript
const apiCreator = require('api-creator');
const path = require('path');

const apiPath = path.resolve('./api/');

apiCreator.init(apiPath, config, resources);
```

Your endpoints will be accessible on:

http://localhost:8080/foo/

# As a lambda

Create a `lambda.js` file and export the module like so;

```javascript
const api = apiCreator.init(apiPath, config, resources);

module.exports = api.handler;
```

# Configuration

You can control the creator behaviour with the following environment varibles:

| Name     | Description           | Default value | Possible values     |
| -------- | --------------------- | ------------- | ------------------- |
| APP_PORT | the port to listen on | 8080          |                     |
| PLATFORM | How the api runs      | development   | development, lambda |

You can provide endpoint specific configuration by passing in a `config` param.

```javascript
const config = {
  corsOptions: {
    origin: ['http://localhost:3000']
  },
  bodyParserOptions: {
    bodyParserEnabled: true,
  },
  foo: {
    some: "config";
  }
}
```

This will configure everything under the `foo` directory.

# Publishing a new version

1. Commit changes
2. Run `npm publish:version`
3. Profit
