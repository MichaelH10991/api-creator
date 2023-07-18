"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
/**
 * Returns some helpful helpers for doing stuff.
 * @param {*} absolutePath
 * @returns some helpful helpers.
 */
const getHelpers = (absolutePath) => {
    const pathPart = path_1.default.relative(__dirname, absolutePath);
    return {
        endpoint: pathPart.substring(pathPart.lastIndexOf("/") + 1),
        filePath: (file) => path_1.default.join(absolutePath, file),
        modulePath: (file) => `./${path_1.default.join(pathPart, file)}`,
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
    const { modulePath, filePath, endpoint } = getHelpers(absolutePath);
    const dir = fs_1.default
        .readdirSync(absolutePath)
        .filter((file) => file !== "index.js");
    dir.forEach((file) => {
        if (fs_1.default.statSync(filePath(file)).isDirectory()) {
            const subRouter = express_1.default.Router();
            init(subRouter, config, resources, filePath(file), logger);
            router.use(`/${file}`, subRouter);
        }
        else {
            const route = require(modulePath(file));
            if (route.init) {
                if (config && config[endpoint]) {
                    logger.info(`Loading /${endpoint} with supplied config.`);
                    route.init(router, config[endpoint], resources);
                }
                else {
                    logger.warn(`Loading /${endpoint}, no config.`);
                    logger.info(`Loading ${modulePath(file)}.`);
                    route.init(router, config, resources);
                }
            }
        }
    });
};
exports.default = { init };
