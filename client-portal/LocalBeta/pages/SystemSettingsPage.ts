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

import { Browser, Page, chromium, expect } from "@playwright/test";
import { Helpers } from "../utils/helpers";
import { error, timeLog } from "console";
import exp from "constants";


// System Settings class
export default class SystemSettingsPage {

    page: Page;

    selectors: {

        systemSettingsLink: string;
        systemCustomisation: string;
        systemUsers: string;
        securityRoles: string;
        multipleDocumentUpload: string;
        systemPipelines: string;
        welcomeEmail: string;
        publicReportLibrary: string;
        systemSettingsLeftMenuList: string;



        // Add more selectors as needed
    };
    // Class constructor 
    constructor(page: Page) {

        this.page = page;
        this.selectors = {

            systemSettingsLink: 'btn-header-home-setting',// Use getByHeading
            systemCustomisation: 'System Customisation',
            systemUsers: 'System Users',
            securityRoles: 'Security Roles',
            multipleDocumentUpload: 'Multiple Document Upload',
            systemPipelines: 'System Pipelines',
            welcomeEmail: 'Welcome Email',
            publicReportLibrary: 'Public Report Library',
            //systemSettingsLeftMenuList:'sidebar',
            systemSettingsLeftMenuList: 'jobs-page-left-menu-ul-list',
            // Use getByText
            // Use getByTestId

            // Use getByRole (Link)

        };
    }


    async navigateToSystemSettingsLink() {

        return await this.page.getByTestId(this.selectors.systemSettingsLink);
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

    async systemSettingsQuickLinks() {

        //const systemSettingsLeftMenu= await this.page.getByTestId(this.selectors.systemSettingsLeftMenuList);
        const ul = await this.page.getByTestId('jobs-page-left-menu-ul-list');
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
                waitForSelector('[data-testid="jobs-page-left-menu-ul-list"]', { timeout: 5000 });  // Adjust the selector and timeout as needed
        }


    }
}