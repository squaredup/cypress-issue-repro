# cypress-issue-repro
This repo contains a repro of a problem where Cypress hangs if logging using a Microsoft(MS) account using `cy.origin()` and there are plugins installed that execute after a test fails.

To reproduce this there we force a `pageLoadTimeout` expiration by stopping the `load` event from firing during the MS login process and have the `cypress-terminal-report` plugin installed.

## To install
Run
```
pnpm install
```

## To execute
Run
```
npx cypress open
```

## Notes
You will need to create a `cypress.env.json` and provide the properties `AAD_USER` and `AAD_PASSWORD` for any Microsoft account, `AAD_ORG` is optional as the test doesn't get far enough to need it.  You may have to update the redirect origin in `support\commands.js` to get it to work as the test is expecting to be redirected to `login.microsoftonline.com`.
