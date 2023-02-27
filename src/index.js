const express = require('express');
const cors = require("cors");
const loader = require('./loader');
const creatorConfig = require('./config');
const logger = require('./logger');

const app = express();
const router = express.Router();

app.use(cors());

/**
 * An express wrapper which dynamically configures and loads api endpoints.
 * @param {String} apiPath The absolute path to the directory containing the apis.
 * @param {object} apiConfig optional configuration.
 * @param {object} resources optional resources for the apis to use.
 */
const init = (apiPath, apiConfig, resources) => {

  const serviceLogger = logger.init(apiConfig);

  if(!apiPath) {
    throw new Error('Cannot proceed loading endpoints without an apiPath.')
  }

  if(!apiConfig) [
    serviceLogger.warn('No config provided for service.')
  ]
  
  loader.init(router, apiConfig, resources, apiPath, serviceLogger);

  app.use(router);

  app.listen(creatorConfig.port, serviceLogger.info(`app listening on ${creatorConfig.port}`));

}

module.exports = { init }