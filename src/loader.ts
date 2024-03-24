import fs from 'fs';
import path from 'path';
import express from 'express';
import getHelpers from './helpers';

/**
 * Recursively loads the endpoints under a given directory path, building up the routes from the directory structure.
 * @param {object} router an express router instance
 * @param {object} config configuration
 * @param {object} resources resources for the endpoints to use
 * @param {string} absolutePath the absolute path to the api endpoints
 * @param {object} logger a logger intance
 */
const init = (router: any, config: any, resources: object, absolutePath = __dirname, logger: any) => {
  const { modulePath, filePath, endpoint } = getHelpers(absolutePath);
  const dir = fs.readdirSync(absolutePath).filter((file) => file !== 'index.js');

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
          // logger.warn(`Loading /${endpoint}, no config.`);
          logger.info(`Loading ${path.parse(modulePath(file)).name}.`);
          route.init(router, config, resources);
        }
      }
    }
  });
};

export default { init };
