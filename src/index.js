const express = require("express");
const cors = require("cors");
const loader = require("./loader");
const creatorConfig = require("./config");
const logger = require("./logger");

let app = express();
const router = express.Router();

/**
 * An express wrapper which dynamically configures and loads api endpoints.
 * @param {String} apiPath The absolute path to the directory containing the apis.
 * @param {object} apiConfig optional configuration.
 * @param {object} resources optional resources for the apis to use.
 */
const init = (apiPath, apiConfig, resources, customApp) => {
  const serviceLogger = logger.init(apiConfig);

  if (customApp) {
    serviceLogger.info("Using custom app");
    app = customApp;
  }

  if (!apiPath) {
    throw new Error("Cannot proceed loading endpoints without an apiPath.");
  }

  if (!apiConfig) {
    serviceLogger.warn("No config provided for service.");
  }

  if (apiConfig.corsOptions) {
    serviceLogger.info("Configuring cors using:", apiConfig.corsOptions);
    app.use(cors(apiConfig.corsOptions));
  }

  loader.init(router, apiConfig, resources, apiPath, serviceLogger);

  app.use(router);

  app.listen(
    creatorConfig.port,
    serviceLogger.info(`app listening on ${creatorConfig.port}`)
  );
};

module.exports = { init };
