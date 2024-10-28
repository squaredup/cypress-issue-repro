// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

const msLogin = (options) => {
    const sentArgs = {
        username: options.username,
        password: options.password,
        clickAadTile: options.clickAadTile,
        clickDontRemainSignedIn: options.clickDontRemainSignedIn
    };

    /**
     * It is currently not possible to access page objects from within
     * cy.origin() callbacks so we have to use explicit selectors
     */

    const urlToVisit = options.visit?.url ? options.visit?.url : '/';
    const failOnStatusCode = options.visit?.failOnStatusCode ? options.visit?.failOnStatusCode : false; // optionally ignore any status code errors

    cy.visit(urlToVisit, { failOnStatusCode: failOnStatusCode });

    // On DEV our auth domain (login-dev.squaredup.com) on a separate top level domain
    // because of lack of HTTPS: cypress considers both are different domain

    //When app.squaredup.com loaded second time
    //somehow cypress is considering login.squaredup.com and app.squaredup.com different domain
    //However, the login.squaredup.com is part of squaredup.com, so cypress also not updating document.domain
    //now using experimentalSkipDomainInjection:['*.squaredup.com'] and below origin code we can login second time

    cy.origin('login-dev.squaredup.com', () => {
        cy.contains('Microsoft').click();
    });

    // Enter credentials on MS login pages
    cy.origin(
        'login.microsoftonline.com',
        { args: sentArgs },
        ({
            username,
            password,
            clickAadTile,
            clickDontRemainSignedIn
        }) => {    
            cy.on('window:before:load', (win) => {
                // just log the win.location.href for convenience
                cy.log('WINDOW BEFORE LOAD', win.location.href);

                // if we're trying to load the page we want to stop, win.stop()
                if (win.location.href === 'https://login.microsoftonline.com/common/login') {
                    win.stop();
                }
            });

            cy.get('input[type="email"]').should('be.visible').type(username);
            cy.get('input[type=submit]').should('be.visible').click();

            if (clickAadTile) {
                cy.get('#aadTile').should('be.visible').click();
            }

            // use the 'log: false' option so we show the password in the test runner
            cy.get('input[type="password"]').should('be.visible').type(password, { log: false });
            cy.get('input[type=submit]').should('be.visible').click();

            if (clickDontRemainSignedIn) {
                cy.get('input[value="No"]').should('be.visible').click();
            }
        }
    );

    // if (options.orgButtonText) {
    //     /**
    //      * An org text has been provided, but it is possible that the tenant screen is not displayed as the user
    //      * has access to only one org, in which case we get straight thru to the app.
    //      */
    //     const orgButtonText = options.orgButtonText;
    //     waitForElementToBeVisible({
    //         selector: '[data-testid="selectTenantPage"]'
    //     }).then((elementVisible) => {
    //         if (elementVisible) {
    //             cy.contains(orgButtonText).click();
    //         } else {
    //             cy.logTestProgress('Tenant selection screen not visible, continuing...');
    //         }
    //     });
    // }

    // Verify that the expected element is visible after logging in
    options.postLoginSelector
        ? cy.get(options.postLoginSelector).should('be.visible')
        : cy.get('nav').should('be.visible');
};

/**
 * Login to and select org, saving the local storage so it can be restored next time
 * @param { Object } options - The AAD login options
 * @param { string } options.username - username
 * @param { string } options.password - password
 * @param { boolean } options.clickAadTile - click the AAD tile
 * @param { boolean } options.clickDontRemainedSignedIn -
 *  click the 'No' button to not remain signed in after logging out
 * @param { string } options.orgButtonText - org button text on org selection screen to click
 * @param { string } options.postLoginSelector - selector of element to expect after login successful
 * @param { string } options.sessionName - specify session name.  If not provided, won't use session
 *
 * @example
 * cy.loginWithMicrosoftAccountAndSelectOrg(options);
 */

Cypress.Commands.add('loginWithMicrosoftAccountAndSelectOrg', (options) => {
    // Use cached session if a session name string has been provided so we don't have to log in
    if (Cypress._.isString(options.sessionName)) {
        cy.session(
            options.sessionName,
            () => {
                // log in if no session data has been saved
                msLogin(options);
            },
            {
                validate:() => {
                    cy.wrap(localStorage.getItem('msal.idtoken'), { log: false }).should('exist');
                },
                cacheAcrossSpecs: true
            }
        );
    } else {
        msLogin(options);
    }
});

