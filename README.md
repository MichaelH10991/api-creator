# api-creator

An express wrapper which allows you to quickly and dynamically create api endpoints, without having to worry about boilerplate code.

## Installation

It'll be a npm package eventually, but for the meantime, in your node project run:

`npm i https://github.com/MichaelH10991/api-creator.git`

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
  router.get("/hello", (req, res) => res.send("hello"));
};

module.exports = { init };
```

Initialise the library with something like this:

```javascript
const apiCreator = require("api-creator");
const path = require("path");

const apiPath = path.resolve("./api/");

apiCreator.init(apiPath, config, resources);
```

Your endpoints will be accessible on:

http://localhost:8080/foo/

# Configuration

You can control the creator behaviour with the following environment varibles:

| Name     | Description           | Default value |
| -------- | --------------------- | ------------- |
| APP_PORT | the port to listen on | 8080          |

You can provide endpoint specific configuration by passing in a `config` param.

```javascript
const config = {
  foo: {
    some: "config";
  }
}
```

This will configure everything under the `foo` directory.
