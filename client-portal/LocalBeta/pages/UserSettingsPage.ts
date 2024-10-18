/**
 * File: UserSettingsPage.ts
 * Author: Shabbir Minhas
 * Date: July 18, 2024
 * 
 * Description:
 * This file defines the User Settings Page class, which implements the Page Object Model (POM) pattern.
 * The User Settings Page class encapsulates all interactions and elements related to the user settings Page/Link
 *  page functionality of the application.
 * 
 * Classes:
 *   UserSettingsPage:
 *     Description: Encapsulates interactions and elements related to the UserSettings page functionality.
 *     Author: Shabbir Minhas
 * 
 * Usage:
 * import UserSettingsPage from "../pages/UserSettingsPage";
 * const home = new UserSettingsPage(page);
 * ;
 */
import { Browser, Page, chromium, expect } from "@playwright/test";
import { error, timeLog } from "console";
import exp from "constants";


// JobPage class
export default class UserSettingsPage {

    page: Page;

    selectors: {

        userProfileLink: string;
        userSettingsLink: string;
        userSettingsMainScreen: string;
        userSettingsPageTitle: string;

        // Add more selectors as needed
    };
    // Class constructor 
    constructor(page: Page) {

        this.page = page;
        this.selectors = {

            userProfileLink: 'RightSideMenu',// Use getByTestId
            userSettingsLink: 'User Settings',// Use getByText
            userSettingsMainScreen: 'accordion',// Use getByTestId
            userSettingsPageTitle: 'User settings',
            // Use getByRole (Link)

        };
    }

    async navigateToUserProfileLink() {

        return await this.page.getByTestId(this.selectors.userProfileLink);
    }

    async navigateToUserSettingsLink() {

        return await this.page.getByRole('link', { name: this.selectors.userSettingsLink });
    }

    async verifyUserSettingsPageTitle(title: string, url: string) {

        //const userSettingTitle = await this.page.getByTitle(this.selectors.userSettingsPageTitle);
        // Get the current page title
        const actualTitle = await this.page.title();

        // Log both the actual and expected titles to the console
        console.log('Actual Title:', actualTitle);
        console.log('Expected Title:', title);
        await expect(this.page).toHaveTitle(title);
        await expect(this.page).toHaveURL(url);
    }

    async verifythemeDetails(title: string, url: string) {

        const userSettingTitle = await this.page.getByTitle(this.selectors.userSettingsPageTitle);
        expect(this.page).toHaveTitle(title);
        expect(this.page).toHaveURL(url);
    }
    async verifyPersonalInfo() {


        const firstName = await this.page.locator('#accordion div').filter({ hasText: /^First Name$/ }).getByRole('textbox').inputValue();
        const lastName = await this.page.locator('div').filter({ hasText: /^Last Name$/ }).getByRole('textbox').inputValue();
        const email = await this.page.locator('div').filter({ hasText: /^Email Address$/ }).getByRole('textbox').inputValue();
        return [firstName, lastName, email]
    }

    async clickOnThemeDetailButton() {
        const rootElement = await this.page.getByTestId(this.selectors.userSettingsMainScreen);
        const allButtons = await rootElement.getByRole('button').all();
        const themeButton = await rootElement.getByRole('button', { name: 'Theme Detail' });
        await themeButton.click();

    }
    async verifyThemeDetail() {
        const rootElement = await this.page.getByTestId(this.selectors.userSettingsMainScreen);
        const themeComboBox = await rootElement.getByRole('combobox');
        await themeComboBox.screenshot({path:'utils/Screenshots/theme.png'});
        const allOptions = await rootElement.getByRole('combobox').locator('option').allTextContents();
        const selectedTheme = await themeComboBox.inputValue();
        const expectedValues = ['Please Select', 'Light Mode', 'Dark Mode'];
        // Validation
        if (allOptions.length !== 3) {
            throw new Error(`Validation failed: Expected ${3} options, but got ${allOptions.length}`);
        }
        for (let i = 0; i < allOptions.length; i++) {
            if (allOptions[i] !== expectedValues[i]) {
                throw new Error(`Validation failed: Expected option "${expectedValues[i]}", but got "${allOptions[i]}"`);
            }
        }
        if (selectedTheme != 'light') {
            console.log('Light Mode is not seleted.');
            throw new Error('Light Mode is not seleted.');
        }


    }

    async verifyMainButtonsOnUserSettings() {
        const rootElement = await this.page.getByTestId(this.selectors.userSettingsMainScreen);
        const allButtons = await rootElement.getByRole('button');
        const count = await allButtons.count();
        if (count == 4) {
            // Loop through all children and log their tag names
            for (let i = 0; i < count; i++) {
                const child = allButtons.nth(i);
                const tagName = await child.evaluate(node => node.tagName.toLowerCase());
                await child.click()

                let innerText = '';
                try {
                    innerText = await child.innerText();
                } catch (e) {
                    console.log(`Error getting innerText for child ${i}:`, e);
                }

                console.log(`Child ${i} tag name: ${tagName}, innerText: ${innerText}`);

            }
        } else {
            throw new Error('Validation failed: count is not 4. This indicates that controls may have been added or removed unexpectedly.');
        }


    }


    async getAllDivControlsWithChildren() {

        const rootElement = await this.page.getByTestId(this.selectors.userSettingsMainScreen);
        // Get all div elements under the root element
        const divElements = await rootElement.locator('div').elementHandles();
        // Array to store names of all controls with their children
        const controlsWithChildren = [];
        // Loop through each div element
        for (const div of divElements) {
            // Get the name or text of the div element
            const divName = await div.evaluate(node => div.innerText || (node as HTMLElement).className);
            // const divName = await div.evaluate(node => node.textContent || (node as HTMLElement).id || (node as HTMLElement).className);
            // Get all children of the div element
            const children = await div.$$('div');
            // Array to store names of children
            const childrenNames = [];
            for (const child of children) {
                const childName = await child.evaluate(node => node.innerText || node.id || node.className);
                childrenNames.push(childName);
            }
            // Store the div name and its children names in the array
            controlsWithChildren.push({
                name: divName,
                children: childrenNames
            });
        }
        return controlsWithChildren;
    }

}


