
/**
 * File: LoginPage.ts
 * Author: Shabbir Minhas
 * Date: May 1, 2024
 * 
 * Description:
 * This file defines the Login Page class, which implements the Page Object Model (POM) pattern.
 * The Login Page class encapsulates all interactions and elements related to the login functionality of the application.
 * 
 * Classes:
 *   LoginPage:
 *     Description: Encapsulates interactions and elements related to the login functionality.
 *     Author: Shabbir Minhas
 * 
 * Usage:
 * import LoginPage from "../pages/LoginPage";
 *  const login = new LoginPage(page);
 * loginPage.loginJobPortal(userName: string , password: string);
 */


import { Page, chromium, expect } from "@playwright/test";
//import { checkPrime } from "crypto";
//import { url } from "inspector";


// LoginPage class
export default class LoginPage {

    page: Page;
    // Define the selectors object 
    selectors: {
        loginButton: string;
        usernameInput: string;
        passwordInput: string;
        forgetPasswordLink: string;
        tradeMarkText: string;
        invalidUserOrPasswordTex: string;
        jtAdminLink: string;
        logOutButton: string;
        // Add more selectors as needed
    };
    // Class constructor 
    constructor(page: Page) {

        this.page = page;
        this.selectors = {

            usernameInput: 'txt-email',// Use getByTestId
            passwordInput: 'txt-password',// Use getByTestId
            loginButton: 'btn-login',// Use getByRole(button)
            forgetPasswordLink: 'Forgotten your password?',// Use getByRole (Link)
            tradeMarkText: '© 1998 - 2024 Jobtrain Ltd. All rights reserved.',// Use getByText
            invalidUserOrPasswordTex: 'MainContent_diverror',// Use getByTestId
            jtAdminLink: 'btn-header-home-right-side-menu',//Use getByTestId
            logOutButton: 'btn-logout',// Use getByTestId
        };
    }
    //Navigation to the login page
    async navigateToJobtrain(url: string) {


        await this.page.goto(url);

    }

    // this funtion enter user name into input field
    async enterUserName(username: string) {

        // Wait for the user name input field to be present and editabl 

        await this.page.getByTestId(this.selectors.usernameInput).fill(username);

    }

    // Enters the provided password into the password input field.

    async enterPassword(password: string) {

        await this.page.getByTestId(this.selectors.passwordInput).fill(password);
    }

    //    Wait for the login button to be present and clickable
    async clickOnLoginButton() {

        await this.page.getByTestId(this.selectors.loginButton).click();

    }
    //Logs in to the job portal application.
    async loginJobPortal(userName: string, password: string) {


        await this.page.getByTestId(this.selectors.usernameInput).fill(userName);
        await this.page.getByTestId(this.selectors.passwordInput).fill(password);
        await this.page.getByTestId(this.selectors.loginButton).click();
        await this.page.waitForLoadState('networkidle');
        //Assertion 
        await expect(this.page).toHaveTitle('Jobtrain');
    }

    //Logs in to the job portal application.
    async loginAndSaveState(userName: string, password: string) {

        console.log('Filling input with username:', userName);
        console.log('Selector being used:', this.selectors.usernameInput);
        await this.page.getByTestId(this.selectors.usernameInput).fill(userName);
        await this.page.getByTestId(this.selectors.passwordInput).fill(password);
        await this.page.getByTestId(this.selectors.loginButton).click();
        // Wait for navigation or some element that indicates a successful login
        await this.page.waitForLoadState('networkidle');
        //Assertion 
        await expect(this.page).toHaveTitle('Jobtrain');
        // Save the authenticated state
        await this.page.context().storageState({ path: 'state.json' });
    }
    //   Verify the login screen controls 
    async loginScreenVerification() {


        const usernameInput = await this.page.getByTestId(this.selectors.usernameInput);
        expect(usernameInput).not.toBeNull();
        const passwordInputExists = await this.page.locator(this.selectors.passwordInput);
        expect(passwordInputExists).not.toBeNull();

        return true;

    }
    //Verifies the presence and functionality of the "Forgot Password" link.
    async verifyForgetPasswordLink() {

        try {
            // expect will validate the text of Forget Password link here.
            await expect(this.page.getByRole('link')).toHaveText('Forgotten your password?');
            const passwordText = await this.page.getByText(this.selectors.forgetPasswordLink);
            // passwordText.highlight();
            await expect(passwordText).toBeVisible();
            return passwordText;


        } catch (elementNotFoundError) {

            console.error('Password Link does not appear on the Login poage', elementNotFoundError)
            return elementNotFoundError;

        }

    }

    //Verifies the presence and correctness of trademark text on the webpage.
    async tradeMarkTextVerification() {
        // This will verify the text of trade mark on jobtrain login portal
        await this.page.getByText(this.selectors.tradeMarkText).isVisible();;

    }
    async invalidUserOrPasswordText() {

        return (await this.page.getByTestId(this.selectors.invalidUserOrPasswordTex));
    }

    async LoggedInUserLink() {

        return await this.page.getByTestId(this.selectors.jtAdminLink);
    }

    async clickOnLogOutButton() {
        //this will logout from the application
        return (await this.page.getByTestId(this.selectors.logOutButton));
    }

}


