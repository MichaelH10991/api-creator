const fs = require("fs");
const path = require("path");
const express = require("express");

const getHelpers = (absolutePath) => {
  const pathPart = path.relative(__dirname, absolutePath);
  return {
    pathPart,
    filePath: (file) => path.join(absolutePath, file),
    apiName: pathPart.substring(pathPart.lastIndexOf('/') + 1 )
  }
}

const init = (router, config, resources, absolutePath = __dirname, logger) => {

  const { pathPart, filePath, apiName } = getHelpers(absolutePath);

  const dir = fs
    .readdirSync(absolutePath)
    .filter((file) => file !== "index.js");

  dir.forEach((file) => {
    if (fs.statSync(filePath(file)).isDirectory()) {
      const subRouter = express.Router();
      init(subRouter, config, resources, filePath(file), logger);
      router.use(`/${file}`, subRouter);
    } else {
      const modulePath = `./${path.join(
        pathPart,
        file
      )}`;
      const route = require(modulePath);
      if (route.init) {
        if(config && config[apiName]) {
          logger.info(`Using \"${apiName}\" specific config.`)
          route.init(router, config[apiName], resources);
        }else {
          logger.info(`No config provided for \"${apiName}\" endpoint.`)
          route.init(router, config, resources);
        }
      }
    }
  });
};

module.exports = { init }