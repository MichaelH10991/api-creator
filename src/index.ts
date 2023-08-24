import express from 'express';
import cors from 'cors';
import loader from './loader';
import creatorConfig from './config';
import logger from './logger';
import serverless from 'serverless-http';
import awsServerlessExpress from "aws-serverless-express";

let app = express();
const router = express.Router();

/**
 * An express wrapper which dynamically configures and loads api endpoints.
 * @param {String} apiPath The absolute path to the directory containing the apis.
 * @param {object} apiConfig optional configuration.
 * @param {object} resources optional resources for the apis to use.
 */
const init = (apiPath: any, apiConfig: any, resources: any, customApp: any) => {
  const serviceLogger = logger.init(apiConfig);

  if (customApp) {
    serviceLogger.info('Using custom app');
    app = customApp;
  }

  if (!apiPath) {
    throw new Error('Cannot proceed loading endpoints without an apiPath.');
  }

  if (!apiConfig) {
    serviceLogger.warn('No config provided for service.');
  }

  if (apiConfig && apiConfig.corsOptions) {
    serviceLogger.info('Configuring cors using:', apiConfig.corsOptions);
    app.use(cors(apiConfig.corsOptions));
  }

  loader.init(router, apiConfig, resources, apiPath, serviceLogger);

  app.use(router);

  if (creatorConfig.platform === 'lambda') {
    const server = awsServerlessExpress.createServer(app)
    // serviceLogger.info('exporting', serverless(app));
    // return {
    //   handler: serverless(app),
    // };
    return {
      handler: (event: any, context: any) => {
        awsServerlessExpress.proxy(server, event, context);
      }
    }
  } else {
    app.listen(creatorConfig.port, () => serviceLogger.info(`app listening on ${creatorConfig.port}`));
  }
};

module.exports = { init };
