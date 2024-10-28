const { defineConfig } = require("cypress");
const cypressEnv = require("./cypress.env.json");

module.exports = defineConfig({
  pageLoadTimeout: 30000,
  experimentalModifyObstructiveThirdPartyCode: true,
  modifyObstructiveCode: false,
  e2e: {
    baseUrl: cypressEnv.BASE_URL,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
