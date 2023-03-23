const loader = require('../loader.ts');
const express = require('express');
jest.mock('express');

const router = {
  use: jest.fn(),
};

express.mockImplementation(() => ({
  Router: () => router,
}));

const config = {};
const resources = {};
const absolutePath = `${__dirname}/testDir`;
const logger = {};

describe('loader.js tests', () => {
  test('loads endpoints under a directory', () => {
    loader.init(router, config, resources, absolutePath, logger);
    expect(router.use).toHaveBeenCalledWith('/foo', router);
  });
});
