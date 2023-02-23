const express = require('express');
const cors = require("cors");
const loader = require('./loader');
const creatorConfig = require('./config')

const app = express();
const router = express.Router();

app.use(cors())

/**
 * An express wrapper which dynamically configures and loads api endpoints.
 * @param {String} apiPath The absolute path to the directory containing the apis.
 * @param {object} config optional configuration.
 * @param {object} resources optional resources for the apis to use.
 */
const init = (apiPath, apiConfig, resources) => {


  loader.init(router, apiConfig, apiPath);

  app.use(router);

  app.listen(creatorConfig.port, console.log(`app listening on ${creatorConfig.port}`));

}

module.exports = { init }