import { Browser, Page, chromium, expect } from "@playwright/test";
import { Helpers } from "../../utils/helpers";
import { error, timeLog } from "console";
import exp from "constants";
import SystemSettingsPage from "./SystemSettingsPage";


// System Settings communication class
export default class AuthorizationSetupPage extends SystemSettingsPage {

    page: Page;

    selectors = {

        ...super.getSelectors(),
        PageHeading: 'div-page-title',
        authSetupPageHeading: 'div-page-title',//sepecific to page 
        authSetupUlist: 'data-testid-ul-tiles-container',
        authUsers: 'Authorisation Users',
        authTemplates: 'Authorisation Templates',
        authGroups: 'Authorisation Groups',
        jobAuthMasterTemplates: 'Job Authorisation Master Template',


        // Add more selectors as needed
    };

    // Class constructor 
    constructor(page: Page) {
        super(page);
        this.page = page;


    }

    async verifyAuthorisationSetupScreen() {

        await expect(this.page.getByRole('heading', { name: this.selectors.authorizationSetUp })).toBeVisible();
        console.log("authorizatio setup main page heading is visible.");
        await expect(this.page.getByRole('heading', { name: this.selectors.authUsers })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.authTemplates })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.authGroups })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.jobAuthMasterTemplates })).toBeVisible();
        console.log("All elements on the authorization setup screen are visible.");
    }

}