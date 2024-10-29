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
    require('cypress-terminal-report/src/installLogsPrinter')(on, {
        includeSuccessfulHookLogs: true, // Log out all before all and after all hooks
        outputRoot: config.projectRoot, // required if using outputTarget
        specRoot: 'cypress/e2e', // Spec root relative to package.json
        outputTarget: {
            'reports/mochareports/assets/terminalreport|ts.txt': 'txt' // Log specs to separate files in {directory|extension} in text format
        }
    })
    },
  },
});
