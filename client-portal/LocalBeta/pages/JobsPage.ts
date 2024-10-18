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
import { Helpers } from "../utils/helpers";


// JobPage class
export default class JobPage {

    page: Page;

    selectors: {

        jobsLink: string;
        JobsQuickLinkSideBarDiv: string;
        addJob:string;
        addToMyJobs:string;
        editJob:string;
        print:string;
        exportToExcel:string;
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

            jobsLink: 'btn-home-jobs',// Use getByTestId
            JobsQuickLinkSideBarDiv: 'jobs-page-left-menu-ul-list',// Use getByTestId
            addJob:'btn-create-new-job',
            addToMyJobs:'btn-create-new',
            editJob:'btn-edit',
            print:'btn-print',
            exportToExcel:'btn-export',
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
        const ulElement = await this.page.getByTestId(this.selectors.JobsQuickLinkSideBarDiv);
        
        const allListElements = await ulElement.getByRole('listitem')
        // // Locate all a elements within the ul element
        const allLinks = await allListElements.locator('a');

        const count = await allLinks.count();
        if (count == 5) {
            // Evaluate the count of a elements
            for (let i = 0; i < count; i++) {
               
                console.log(await allLinks.nth(i).innerText());
                
                await this.page.waitForLoadState("networkidle")

            }
        }


    }
    async navigateToAddJobLink(page:Page) {

        await this.page.waitForLoadState("networkidle");
        const addJobLink = await this.page.getByTestId(this.selectors.addJob); // Update with the correct selector
        await addJobLink.click();
        await this.page.waitForLoadState("networkidle");
        await Helpers.takeScreenshot(page,'Add a job');
     

    }

    async navigateToEditJobLink(page:Page) {

        await this.page.waitForLoadState("networkidle");
        const AddToMyJobs = await this.page.getByTestId(this.selectors.addToMyJobs); // Update with the correct selector
     
        await AddToMyJobs.click();
        await this.page.waitForLoadState("networkidle");
        await Helpers.takeScreenshot(page,'Add to my jobs')
    }
    async navigateToEditJobs(page:Page) {

        await this.page.waitForLoadState("networkidle");
        const editJobs = await this.page.getByTestId(this.selectors.editJob); // Update with the correct selector
     
        await editJobs.click();
        await this.page.waitForLoadState("networkidle");
        await Helpers.takeScreenshot(page,'Edit jobs')

    }
}
