const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    projectId: "bkgpha", //npx cypress run --record --key 42cc32da-9d0f-4391-b13c-d6ebf82406ae
    excludeSpecPattern: ['**/1-getting-started', '**/2-advanced-examples'],
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
