"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const loader_1 = __importDefault(require("./loader"));
const config_1 = __importDefault(require("./config"));
const logger_1 = __importDefault(require("./logger"));
const serverless_http_1 = __importDefault(require("serverless-http"));
let app = (0, express_1.default)();
const router = express_1.default.Router();
/**
 * An express wrapper which dynamically configures and loads api endpoints.
 * @param {String} apiPath The absolute path to the directory containing the apis.
 * @param {object} apiConfig optional configuration.
 * @param {object} resources optional resources for the apis to use.
 */
const init = (apiPath, apiConfig, resources, customApp) => {
    const serviceLogger = logger_1.default.init(apiConfig);
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
    if (apiConfig && apiConfig.corsOptions) {
        serviceLogger.info("Configuring cors using:", apiConfig.corsOptions);
        app.use((0, cors_1.default)(apiConfig.corsOptions));
    }
    loader_1.default.init(router, apiConfig, resources, apiPath, serviceLogger);
    app.use(router);
    if (config_1.default.platform === "lambda") {
        serviceLogger.info("exporting", (0, serverless_http_1.default)(app));
        return {
            handler: (0, serverless_http_1.default)(app),
        };
    }
    else {
        app.listen(config_1.default.port, serviceLogger.info(`app listening on ${config_1.default.port}`));
    }
};
module.exports = { init };
