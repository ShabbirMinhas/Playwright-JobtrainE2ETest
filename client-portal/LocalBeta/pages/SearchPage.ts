import { Browser, Page, chromium, expect } from "@playwright/test";
import { Helpers } from "../utils/helpers";
import { error, timeLog } from "console";
import exp from "constants";


// System Settings class
export default class SearchPage {

    page: Page;

    selectors: {

        searchLink: string;
        searchJobs: string;
        searchCandidates: string;
        candidateKeywordSearch:string;
        savedSearch:string;
        searchTalent:string;
        internalAddressBookSearch:string;

        



        // Add more selectors as needed
    };
    // Class constructor 
    constructor(page: Page) {

        this.page = page;
        this.selectors = {

            searchLink: 'btn-home-search',// Use getById
            searchJobs: 'Search Jobs',//use getByHeading
            searchCandidates: 'Search Candidates',
            candidateKeywordSearch:'Candidate Keyword Search',
            savedSearch:'Saved Search',
            searchTalent:'Search Talent',
            internalAddressBookSearch:'Internal Address Book Search',
           

        };
    }

    async navigateToSearchLink() {

        return await this.page.getByTestId(this.selectors.searchLink);
    }

    async openSearchJobs() {

        return await this.page.getByRole('heading',{name:this.selectors.searchJobs});
    }
    async openSearchCandidates() {

        return await this.page.getByRole('heading', { name: this.selectors.searchCandidates });

    }
    async openCandidateKeywordSearch() {

        return await this.page.getByRole('heading', { name: this.selectors.candidateKeywordSearch });

    }
    async openSavedSearch() {

        return await this.page.getByRole('heading', { name: this.selectors.savedSearch });

    }
    async openSearchTalent() {

        return await this.page.getByRole('heading', { name: this.selectors.searchTalent });

    }
    async openInternetAddressBookSearch() {

        return await this.page.getByRole('heading', { name: this.selectors.internalAddressBookSearch });

    }

    async navigateToAllSearchLinks() {

        //const systemSettingsLeftMenu= await this.page.getByTestId(this.selectors.systemSettingsLeftMenuList);
        const ul = await this.page.getByTestId('');
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
            await Helpers.takeScreenshot(this.page, identifier);
            this.page.goBack();
            await this.page.waitForLoadState('networkidle');
            // Optional: Validate that you are back on the expected page
            await this.page.
                waitForSelector('[data-testid="jobs-page-left-menu-ul-list"]', { timeout: 5000 });  // Adjust the selector and timeout as needed
        }
    }

}

