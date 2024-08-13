/**
 * File: HomePage.ts
 * Author: Shabbir Minhas
 * Date: July 16, 2024
 * 
 * Description:
 * This file defines the Job Page class, which implements the Page Object Model (POM) pattern.
 * The Job Page class encapsulates all interactions and elements related to the Job Page/Link
 *  page functionality of the application.
 * 
 * Classes:
 *   JobPage:
 *     Description: Encapsulates interactions and elements related to the Job page functionality.
 *     Author: Shabbir Minhas
 * 
 * Usage:
 * import JobPage from "../pages/HomePage";
 * const home = new JobPage(page);
 * ;
 */
import { Browser, Page, chromium, expect } from "@playwright/test";


// JobPage class
export default class JobPage {

    page: Page;

    selectors: {

        jobsLink: string;
        JobsQuickLinkSideBarDiv: string;
        quickLinksButton: string;
        sidebarCollapseButton: string;
        ulSideBarMenuList: string;
        listOfJobsHeading: string;

        // Add more selectors as needed
    };
    // Class constructor 
    constructor(page: Page) {

        this.page = page;
        this.selectors = {

            jobsLink: 'JobHeader',// Use getByTestId
            JobsQuickLinkSideBarDiv: 'sidebar',// Use getByTestId
            quickLinksButton: 'menu-bar',// Use getByTestId
            sidebarCollapseButton: 'sidebarCollapse',// Use getByTestId
            ulSideBarMenuList: '.list-unstyled.components.first',// Use getByClass
            listOfJobsHeading: 'List of Jobs', // use geByRole

            // Use getByRole (Link)
            // Use getByText
        };
    }

    async navigateToJobsPage() {

        return await this.page.getByTestId(this.selectors.jobsLink);
    }

    async navigateToJobsList() {

        await this.page.getByTestId(this.selectors.jobsLink).click();
        await this.page.waitForLoadState("networkidle");
        await expect(this.page).toHaveTitle('List of Jobs');

    }

    async clickOnQuickLinksButton() {

        return await this.page.getByTestId(this.selectors.quickLinksButton);
    }

    async listOfJobsHeading() {

        return await this.page.getByRole('heading', { name: this.selectors.listOfJobsHeading });
    }
    async clickOnSidebarCollapseButton() {

        return await this.page.getByTestId(this.selectors.sidebarCollapseButton);
    }

    async verifySideBarQuickLinkSection() {

        await this.page.waitForLoadState("networkidle");
        const ulElement = await this.page.locator('ul.list-unstyled.components.first'); // Update with the correct selector
        
        const allListElements = await ulElement.getByRole('listitem')
        // // Locate all a elements within the ul element
        const allLinks = await allListElements.locator('a');

        const count = await allLinks.count();
        if (count == 5) {
            // Evaluate the count of a elements
            for (let i = 0; i <= count; i++) {
               
                console.log(await allLinks.nth(i).innerText());
                
                await this.page.waitForLoadState("networkidle")

            }
        }


    }
}
