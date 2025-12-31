/**
 * to load the built addon in this test Storybook
 */
const path = require("path");

module.exports = {
  managerEntries: (entry = []) => {
    return [...entry, path.resolve(__dirname, "../dist/manager.js")];
  },
  previewAnnotations: (entry = []) => {
    return [...entry, path.resolve(__dirname, "../dist/preview.js")];
  },
};
