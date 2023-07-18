"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    port: process.env.API_CREATOR_APP_PORT || 8080,
    platform: process.env.API_CREATOR_PLATFORM || "development",
};
exports.default = config;
