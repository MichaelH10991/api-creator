const fs = require("fs");
const path = require("path");
const express = require("express");

/**
 * Returns some helpful helpers for doing stuff.
 * @param {*} absolutePath 
 * @returns some helpful helpers.
 */
const getHelpers = (absolutePath) => {
  const pathPart = path.relative(__dirname, absolutePath);
  return {
    apiName: pathPart.substring(pathPart.lastIndexOf('/') + 1 ),
    filePath: (file) => path.join(absolutePath, file),
    modulePath: (file) => `./${path.join(pathPart, file)}`
  }
}

/**
 * Recursively loads the endpoints under a given directory path, building up the routes from the directory structure.
 * @param {object} router an express router instance
 * @param {object} config configuration
 * @param {object} resources resources for the endpoints to use
 * @param {string} absolutePath the absolute path to the api endpoints
 * @param {object} logger a logger intance
 */
const init = (router, config, resources, absolutePath = __dirname, logger) => {
  const { modulePath, filePath, apiName } = getHelpers(absolutePath);
  const dir = fs.readdirSync(absolutePath).filter((file) => file !== "index.js");

  dir.forEach((file) => {
    if (fs.statSync(filePath(file)).isDirectory()) {
      const subRouter = express.Router();
      init(subRouter, config, resources, filePath(file), logger);
      router.use(`/${file}`, subRouter);
    } else {
      const route = require(modulePath(file));
      if (route.init) {
        if(config && config[apiName]) {
          logger.info(`Configuring /${apiName} with supplied config.`)
          route.init(router, config[apiName], resources);
        }else {
          logger.warn(`No config provided for /${apiName} endpoint.`)
          route.init(router, config, resources);
        }
      }
    }
  });
};

module.exports = { init }