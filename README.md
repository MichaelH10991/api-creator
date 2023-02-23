# api-creator

## Usage

Your apis must look something like this:

```javascript
const init = (router, resources, config) => {
  router.get("/foo", (req, res) => res.send("hello"));
};

module.exports = { init };
```

Initialise the library with something like this:

```javascript
const apiCreator = require("api-creator");

const apiPath = `${__basename}/api`;
apiCreator.init(config, resources, apiPath);
```
