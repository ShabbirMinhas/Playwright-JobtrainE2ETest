/**
 * File: SystemSettingsPage.ts
 * Author: Shabbir Minhas
 * Date: July 29, 2024
 * 
 * Description:
 * This file defines the Systems Settings Page class, which implements the Page Object Model (POM) pattern.
 * The Systems Settings  class encapsulates all interactions and elements related to the settings
 *  page functionality of the application.
 * 
 * Classes:
 *   SystemSettingsPage :
 *     Description: Encapsulates interactions and elements related to the Systems Settings page functionality.
 *     Author: Shabbir Minhas
 * 
 * Usage:
 * import HomePage from "../pages/SystemsSettingsPage";
 * const systSettings = new SystemSettingsPage(page);
 * 
 */

import { Browser, Locator, Page, chromium, expect } from "@playwright/test";
import { Helpers } from "../../utils/helpers";
import { error, timeLog } from "console";
import exp from "constants";
import * as fs from 'fs';
import * as path from 'path';
// Resolve __dirname equivalent
import { fileURLToPath } from 'url';
import { TIMEOUT } from "dns";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Load the expected data from the JSON file
const expectedData = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../../systemsettings.json'), 'utf-8')
);

// System Settings class
export default class SystemSettingsPage {

    page: Page;

    selectors: {

        pageHeading: string
        systemSettingsLink: string
        tilesContainer: string
        systemSettingsScreen: string
        systemSettingsQuickLink: string
        systemSettingsLeftMenuList: string
        systemCustomisation: string
        systemUsers: string
        securityRoles: string
        multipleDocumentUpload: string
        systemPipelines: string
        welcomeEmail: string
        publicReportLibrary: string

        //communicationLink: string
        authorizationSetUp: string
        //general settings
        generalSettingsLocations: string
        //media library
        mediaLibrarySearchInputBox: string
        mediaLibrarySearchButton: string
        mediaLibraryLeftMenu:string 
        // mediaLibraryImageLeftMenu:'ul-conatiner-listing-media-library-leftmenu',
        // mediaLibraryVideoLeftMenu:'ul-conatiner-listing-media-library-leftmenu'
        //Communication
        emailTemplates: string
        //general settings location
        selectFirstRecord:string 

        // Add more selectors as needed
    };
    // Class constructor 
    constructor(page: Page) {

        this.page = page;
        this.selectors = {
            pageHeading: 'div-page-title-',
            systemSettingsLink: 'btn-header-home-setting',
            systemSettingsScreen: 'data-testid-tiles-container',//'data-testid-ul-tiles-container',
            tilesContainer: 'data-testid-tiles-container',
            systemSettingsLeftMenuList: 'ul-conatiner--leftmenu',//jobs-page-left-menu-ul-list
            systemSettingsQuickLink: 'btn-system-settings',// Use getById

            systemCustomisation: 'System Customisation',
            systemUsers: 'System Users',
            securityRoles: 'Security Roles',
            multipleDocumentUpload: 'Multiple Document Upload',
            systemPipelines: 'System Pipelines',
            welcomeEmail: 'Welcome Email',
            publicReportLibrary: 'Public Report Library',
            //systemSettingsLeftMenuList:'sidebar',
            //systemSettingsLeftMenuList: 'jobs-page-left-menu-ul-list',// Use getByTestID
            // communicationLink: 'btn-communication',// Use getByTestID
            authorizationSetUp: 'Authorisation Setup',
            //media Library 
            mediaLibrarySearchInputBox: 'txt-search-listing-media-library',
            mediaLibrarySearchButton: 'btn-search-listing-media-library',
            mediaLibraryLeftMenu: 'ul-conatiner-listing-media-library-leftmenu',
            //Communication
            emailTemplates: 'ul-conatiner-listing-email-templates-leftmenu',
            //general settings
            generalSettingsLocations: 'ul-conatiner-listing-location-leftmenu',
            selectFirstRecord:'div-tbl-row-data-cell-checkbox-0-LOCATIONID',


        };

    }
    // Method to get selectors
    getSelectors() {
        return this.selectors;
    }

    async navigateToSystemSettingsLink() {

        return await this.page.getByTestId(this.selectors.systemSettingsLink);
    }
    async selectFirstRecord() {

        return await this.page.getByTestId(this.selectors.selectFirstRecord).click();

    }

    async navigateToSystemSettingsQuickLink() {

        await this.page.getByTestId(this.selectors.systemSettingsQuickLink).click();
    }


    async openSystemCustomisation() {

        return await this.page.getByText(this.selectors.systemCustomisation);
    }
    async openSystemUsers() {

        return await this.page.getByRole('heading', { name: this.selectors.systemUsers });

    }
    async openSecurityRoles() {

        return await this.page.getByRole('heading', { name: this.selectors.securityRoles });

    }
    async openLiItem(headingText: string) {

        return await this.page.getByRole('heading', { name: headingText, exact: true });

    }
    async verifyHeadingText(headingText: string) {

        await expect.soft(await this.page.getByRole('heading', { name: headingText })).toBeVisible();

    }
    async clickButtonByText(buttonText: string) {
        const bottomDiv = await this.page.getByTestId('div-actions');
        await expect.soft(bottomDiv).toBeVisible();

        await bottomDiv.getByRole('button', { name: buttonText }).click();
        // call a sucess message verification funtion here
        TIMEOUT: 5000;
    }
    async actionButton(actionButtonLabel: string) {

        // Click the button with the specified label (e.g., "Yes", "No", "OK", "Cancel", etc.)
        const actionButtonLocator = this.page.locator(`text="${actionButtonLabel}"`);
        const isButtonVisible = await actionButtonLocator.isVisible();

        if (isButtonVisible) {
            console.log(`Clicking button: ${actionButtonLabel}`);
            await actionButtonLocator.click();
        } else {
            console.log(`Button with label "${actionButtonLabel}" not found.`);
        }

    }

    async openMultipleDocumentUpload() {

        return await this.page.getByRole('heading', { name: this.selectors.multipleDocumentUpload });

    }
    async openSystemPipelines() {

        return await this.page.getByRole('heading', { name: this.selectors.systemPipelines });

    }
    async openWelcomeEmail() {

        return await this.page.getByRole('heading', { name: this.selectors.welcomeEmail });

    }

    async openPublicReportLibrary() {

        return await this.page.getByRole('heading', { name: this.selectors.publicReportLibrary });

    }
    async mediaLibraySearchInput() {

        return await this.page.getByTestId(this.selectors.mediaLibrarySearchInputBox);

    }
    async mediaLibraySearchButton() {

        return await this.page.getByTestId(this.selectors.mediaLibrarySearchButton).click();

    }

    async verifySystemSettingsScreen() {
        try {
            const sysSettinsgListItems = await this.page.getByTestId(this.selectors.systemSettingsScreen)
            if (!sysSettinsgListItems) {
                console.error('System settings list items not found.');
                return;
            }

            const ulElements = sysSettinsgListItems.locator('ul')
            const ulCount = await ulElements.count();
            if (ulCount !== expectedData.SystemSettingsPage.ulCount) {
                throw new Error(`Expected ${expectedData.SystemSettingsPage.ulCount} <ul> elements, but found ${ulCount}`);
            }
            console.log(`Found ${ulCount} <ul> elements inside the container.`);
            //Iterate over each < ul > and log the < li > elements inside
            for (let i = 0; i < ulCount; i++) {
                const ul = ulElements.nth(i);  // Get the ith <ul> element
                const liItems = ul.locator('li');  // Find all <li> elements under the <ul>
                const liCount = await liItems.count();

                console.log(`UL ${i + 1} has ${liCount} <li> elements.`);
                // Iterate over each <li> and log its text content
                for (let j = 0; j < liCount; j++) {
                    const liText = await liItems.nth(j).innerText();
                    if (liText.trim() !== expectedData.SystemSettingsPage.liItems[j]) {

                        throw new Error(`Expected LI ${j + 1} in UL ${i + 1} to be "${expectedData.SystemSettingsPage[i].liItems[j]}", but found "${liText}"`);
                    }
                    console.log(`   LI ${j + 1}: ${liText}`);
                }

            }
        } catch (error) { console.error('An error occurred:', error) }

    }

    async systemSettingsQuickLinks() {

        //const systemSettingsLeftMenu= await this.page.getByTestId(this.selectors.systemSettingsLeftMenuList);
        const ul = await this.page.getByTestId(this.selectors.systemSettingsLeftMenuList);
        if (!ul) {
            throw new Error('Unable to find the <ul> element.');

        }
        // Locate all child <a> tags within the <ul>
        const anchorTags = await ul.locator('a');
        const count = await anchorTags.count();
        await expect(count).toBeGreaterThan(0);
        // Optionally, perform actions or assertions on each anchor tag
        for (let i = 1; i < count; i++) {
            const anchor = anchorTags.nth(i);
            const href = await anchor.getAttribute('href');
            const identifier = href ? href.replace(/^\//, '') : 'default';
            console.log('Anchor Href:', href);
            await expect(href).not.toBeNull();
            await anchor.click();
            await this.page.waitForLoadState('networkidle');
            await this.page.waitForTimeout(1000)
            await Helpers.takeScreenshot(this.page, identifier);
            this.page.goBack();
            await this.page.waitForLoadState('networkidle');
            // Optional: Validate that you are back on the expected page
            await this.page.
                waitForSelector('[data-testid="ul-conatiner--leftmenu"]', { timeout: 5000 });  // Adjust the selector and timeout as needed
            //ul-conatiner--leftmenu changed 
        }


    }
    // Note: An overload of this function exists that allows selection by name.
    async systemSettingsLeftMenuLinkByIndex(linkNumber: number) {

        //const systemSettingsLeftMenu= await this.page.getByTestId(this.selectors.systemSettingsLeftMenuList);
        const ul = await this.page.getByTestId(this.selectors.systemSettingsLeftMenuList);
        if (!ul) {
            throw new Error('Unable to find the <ul> element.');

        }
        // Locate all child <a> tags within the <ul>
        const anchorTags = await ul.locator('a');
        let anchorTag;
        anchorTag = await anchorTags.nth(linkNumber);
        await anchorTag.click();
    }
    

    async systemSettingsLeftMenuLinkByName(name: string) {

        const ul = await this.page.getByTestId(this.selectors.generalSettingsLocations);
        if (!ul) {
            throw new Error('Unable to find the <ul> element.');

        }
        // Locate all child <a> tags within the <ul>
        const anchorTag = await ul.locator('a');
        await anchorTag.getByText(name).click();

    }
    async generalSettingsLocationsLeftMenuLinkByName(name: string) {

        const ul = await this.page.getByTestId(this.selectors.generalSettingsLocations);
        if (!ul) {
            throw new Error('Unable to find the <ul> element.');

        }
        // Locate all child <a> tags within the <ul>
        const anchorTag = await ul.locator('a');
        await anchorTag.getByText(name).click();

    }
    async mediaLibraryLeftMenuLinkByIndex(linkNumber: number) {

        //const systemSettingsLeftMenu= await this.page.getByTestId(this.selectors.systemSettingsLeftMenuList);
        const ul = await this.page.getByTestId(this.selectors.mediaLibraryLeftMenu);
        if (!ul) {
            throw new Error('Unable to find the <ul> element.');

        }
        // Locate all child <a> tags within the <ul>
        const anchorTags = await ul.locator('a');
        let anchorTag;
        anchorTag = await anchorTags.nth(linkNumber);
        await anchorTag.click();
    }

    async mediaLibraryLeftMenuLinkByName(name: string) {

        const ul = await this.page.getByTestId(this.selectors.mediaLibraryLeftMenu);
        if (!ul) {
            throw new Error('Unable to find the <ul> element.');

        }
        // Locate all child <a> tags within the <ul>
        const anchorTag = await ul.locator('a');
        await anchorTag.getByText(name).click();

    }
    async locationsLeftMenuLinkByName(name: string) {

        const ul = await this.page.getByTestId(this.selectors.mediaLibraryLeftMenu);
        if (!ul) {
            throw new Error('Unable to find the <ul> element.');

        }
        // Locate all child <a> tags within the <ul>
        const anchorTag = await ul.locator('a');
        await anchorTag.getByText(name).click();

    }
    async emailTemplateLeftMenuLinkByName(name: string) {

        const ul = await this.page.getByTestId(this.selectors.emailTemplates);
        if (!ul) {
            throw new Error('Unable to find the <ul> element.');

        }
        // Locate all child <a> tags within the <ul>
        const anchorTag = await ul.locator('a');
        await anchorTag.getByText(name).click();

    }


    async verifyUnorderedListsAndItems(systemSettingsPageName: string) {

        try {
            const sysSettinsPageItems = await this.page.getByTestId(this.selectors.tilesContainer)
            if (!sysSettinsPageItems) {
                console.error('System settings list items not found.');
                return;
            }

            const ulElements = sysSettinsPageItems.locator('ul')
            const ulCount = await ulElements.count();
            if (ulCount !== expectedData[systemSettingsPageName].ulCount) {
                throw new Error(`Expected ${expectedData[systemSettingsPageName].ulCount} <ul> elements, but found ${ulCount}`);
            }
            console.log(`Found ${ulCount} <ul> elements inside the container.`);
            //Iterate over each < ul > and log the < li > elements inside
            for (let i = 0; i < ulCount; i++) {
                const ul = ulElements.nth(i);  // Get the ith <ul> element
                const liItems = ul.locator('li');  // Find all <li> elements under the <ul>
                const liCount = await liItems.count();
                console.log(`UL ${i + 1} has ${liCount} <li> elements.`)
                // Get the expected liCount from the JSON
                const expectedLiCount = expectedData[systemSettingsPageName].ulItems[i].liCount;
                await expect(expectedLiCount).toBe(liCount);
                // Iterate over each <li> and log its text content
                for (let j = 0; j < liCount; j++) {
                    const liText = await liItems.nth(j).innerText();
                    // Access the expected list item from the JSON
                    if (liText.trim() !== expectedData[systemSettingsPageName].ulItems[i].liItems[j]) {

                        throw new Error(`Expected LI ${j + 1} in UL ${i + 1} to be "${expectedData.SystemSettingsPage[i].liItems[j]}", but found "${liText}"`);
                    }
                    console.log(`   LI ${j + 1}: ${liText.trim()}`);
                }

            }
        } catch (error) { console.error('An error occurred:', error) }


    }

    async handleModalDialog(expectedTitle: string, actionButtonLabel: string, expectedMessage?: string) {
        // Check if any modal with the given title is visible
        const modalTitleLocator = await this.page.locator(`text="${expectedTitle}"`);
        const isModalVisible = await modalTitleLocator.isVisible();

        if (isModalVisible) {
            console.log("Modal is visible.");

            // If an expectedMessage is provided, check if the modal contains the expected message
            if (expectedMessage) {
                const modalMessageLocator = this.page.locator(`text="${expectedMessage}"`);
                const actualMessage = await modalMessageLocator.innerText();

                if (actualMessage !== expectedMessage) {
                    console.log(`Unexpected message: ${actualMessage}`);
                    return;
                }
                console.log(`Expected message found: "${expectedMessage}"`);
            }

            // Click the button with the specified label (e.g., "Yes", "No", "OK", "Cancel", etc.)
            const actionButtonLocator = this.page.locator(`text="${actionButtonLabel}"`);
            const isButtonVisible = await actionButtonLocator.isVisible();

            if (isButtonVisible) {
                console.log(`Clicking button: ${actionButtonLabel}`);
                await actionButtonLocator.click();
            } else {
                console.log(`Button with label "${actionButtonLabel}" not found.`);
            }
        } else {
            console.log(`Modal with title "${expectedTitle}" not visible.`);
        }
        TIMEOUT: 4000;
    }
}

