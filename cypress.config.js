const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    excludeSpecPattern: ['**/1-getting-started', '**/2-advanced-examples'],
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
