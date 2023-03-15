import fs from "fs";
import path from "path";
import express from "express";

/**
 * Returns some helpful helpers for doing stuff.
 * @param {*} absolutePath
 * @returns some helpful helpers.
 */
const getHelpers = (absolutePath) => {
  const pathPart = path.relative(__dirname, absolutePath);
  return {
    endpoint: pathPart.substring(pathPart.lastIndexOf("/") + 1),
    filePath: (file) => path.join(absolutePath, file),
    modulePath: (file) => `./${path.join(pathPart, file)}`,
  };
};

/**
 * Recursively loads the endpoints under a given directory path, building up the routes from the directory structure.
 * @param {object} router an express router instance
 * @param {object} config configuration
 * @param {object} resources resources for the endpoints to use
 * @param {string} absolutePath the absolute path to the api endpoints
 * @param {object} logger a logger intance
 */
const init = (router, config, resources, absolutePath = __dirname, logger) => {
  console.log("hereee");
  const { modulePath, filePath, endpoint } = getHelpers(absolutePath);
  const dir = fs
    .readdirSync(absolutePath)
    .filter((file) => file !== "index.js");

  dir.forEach((file) => {
    if (fs.statSync(filePath(file)).isDirectory()) {
      const subRouter = express.Router();
      init(subRouter, config, resources, filePath(file), logger);
      router.use(`/${file}`, subRouter);
    } else {
      const route = require(modulePath(file));
      if (route.init) {
        if (config && config[endpoint]) {
          logger.info(`Loading /${endpoint} with supplied config.`);
          route.init(router, config[endpoint], resources);
        } else {
          logger.warn(`Loading /${endpoint}, no config.`);
          logger.info(`Loading ${modulePath(file)}.`);
          route.init(router, config, resources);
        }
      }
    }
  });
};

export default { init };
