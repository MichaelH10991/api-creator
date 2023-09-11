import path from 'path';

/**
 * Returns some helpful helpers for doing stuff.
 * @param {*} absolutePath
 * @returns some helpful helpers.
 */
const getHelpers = (absolutePath: string) => {
  const pathPart = path.relative(__dirname, absolutePath);
  return {
    endpoint: pathPart.substring(pathPart.lastIndexOf('/') + 1),
    filePath: (file: string) => path.join(absolutePath, file),
    modulePath: (file: string) => `./${path.join(pathPart, file)}`,
  };
};

export default getHelpers;
