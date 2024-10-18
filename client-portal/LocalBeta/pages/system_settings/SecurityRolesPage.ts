import { Browser, Page, chromium, expect } from "@playwright/test";
import { Helpers } from "../../utils/helpers";
import { error, timeLog } from "console";
import exp from "constants";
import SystemSettingsPage from "./SystemSettingsPage";
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { TIMEOUT } from "dns";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Load the expected data from the JSON file
const expectedData = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../../systemsettings.json'), 'utf-8')
);

// System Settings communication class
export default class SecurityRolesPage extends SystemSettingsPage {

    page: Page;

    selectors = {

        ...super.getSelectors(),
        // pageHeading:'div-page-title-',//'div-page-title',
        securityRolesLink: 'btn-security-role-details',
        securityRolesLeftMenu: 'ul-conatiner-listing-security-roles-leftmenu',
        securityRolesLeftSideMenu: 'nav-listing-security-roles-leftmenu',
        securityRolesTable: 'div-main-table-listing-security-roles',
        securityRolesPageHeader: 'Systems Administrator',
        securityRolesSearchInput: 'txt-search-listing-security-roles',
        securityRolesTopRow: 'div-tbl-row-data-cell-0-SecurityRole',
        seachResultsText: 'div-showing-results-listing-security-roles',
        myWorkspeaceTabId: 'a-tab-title-My Workspace-tab-security-roles',
        myWorkspacePage: 'tab-my-workspace',
        securityRolesUl: 'ul-container-tab-security-roles',
       
        myworkspaceTableId: 'tab-my-workspace',
        jobAndTalentPoolTableId:'tab-job-and-talents-pool',
        securityRolesSaveExitDiv:'div-action-buttons',
        hideSettingsIcon:'span-toggle-access-Hide Settings Icon',
        securityRolesHeaderText:'Security Roles',
        securityRolesFormTopComponent:'form-security-roles',
        listAllJobsCheckBox:'span-toggle-list-all-jobs'




        // Add more selectors as needed
    };

    // Class constructor 
    constructor(page: Page) {
        super(page);
        this.page = page;


    }
    async navigateToSecurityRolesLink() {

        return await this.page.getByTestId(this.selectors.securityRolesLink);
    }

    async saveOrExit(buttonName:string) {
        
       const bottomActionButtons = await this.page.getByTestId(this.selectors.securityRolesSaveExitDiv);
       //bottomActionButtons.scrollIntoViewIfNeeded();
       const button =await bottomActionButtons.getByRole('button',{name:buttonName}).click();
      
    }

    async verifySecurityRolesTable(securityRole: string) {

        const secRolesHeader = await this.page.getByRole('heading', { name: 'System Setup: Security Roles' })

        await this.page.getByTestId(this.selectors.securityRolesTable)
        const searchBox = await this.page.getByTestId(this.selectors.securityRolesSearchInput)
        const searchb = await this.page.getByTestId('div-main-container-listing-security-roles')
        await searchBox.fill(securityRole)
        const searchButton = await searchb.getByRole('button')
        await searchButton.click()

    }
    async verifySecurityRolesRecordsText() {

        const secRoleTopRow = await this.page.getByTestId(this.selectors.securityRolesTopRow)
        await expect(secRoleTopRow).toBeEditable()
        const searchRecordsText = await this.page.getByTestId(this.selectors.seachResultsText)
        const text = await searchRecordsText.innerText()
        await expect.soft(searchRecordsText).toHaveText('Showing  1 to 1 of 1 entries')

    }
    async openSuperUsersSecurityRoles() {

        await this.page.getByTestId(this.selectors.securityRolesTopRow).click()

    }
    async selectAllJobsCheckBox() {

        await this.page.getByTestId(this.selectors.listAllJobsCheckBox).click()

    }
    async securityRolesHeaderExists() {

        await expect(this.page.getByRole('heading',{ name:this.selectors.securityRolesHeaderText})).toBeVisible()

    }

    async securityRolesUserVerification() {

        await expect(this.page.getByRole('heading',{ name:this.selectors.securityRolesHeaderText})).toBeVisible()

    }
    async navigateToMyWorkspaceTab() {

        await this.page.getByTestId(this.selectors.myWorkspeaceTabId).click()


    }
    async navigateToSpecificSecurityRolesTabByName(securityRoleTabName: string) {
        const ul = await this.page.getByTestId(this.selectors.securityRolesUl);
        const ulCount = await ul.count();
        if (!ul && ulCount==14) {
            throw new Error('Unable to find the security Roles Tab element.');

        }
        // Locate all child <a> tags within the <ul>
        const anchorTag = await ul.locator('a');
        await anchorTag.getByText(securityRoleTabName).click();


    }
    async navigateToSpecificSecurityRolesTabByIndex(securityRolseTabNumber: number) {

        const ul = await this.page.getByTestId(this.selectors.securityRolesUl);
        if (!ul) {
            throw new Error('Unable to find the security Roles Tab element.');

        }
        // Locate all child <a> tags within the <ul>
        const anchorTags = await ul.locator('a');
        let anchorTag;
        anchorTag = await anchorTags.nth(securityRolseTabNumber);
        await anchorTag.click();

    }
    async deselectHideSettingsIcon() {

        const hideSettingsOptions =await this.page.getByTestId(this.selectors.hideSettingsIcon)
        const isChecked = await hideSettingsOptions.isChecked();
        if (isChecked) {

            await hideSettingsOptions.click();
            //await checkboxes.nth(i).locator('..').locator('.switch-handle').click();
        }

    }
    async selectAllCheckboxesAsTrue(tabName:string,tabId:string) {
        // Select all checkbox inputs based on their attribute
        const myWorkspaceTable = await this.page.getByTestId(tabId)
        
        // Locate all checkboxes within the table using the `.locator()` method
        const checkboxes = await myWorkspaceTable.locator('input[type="checkbox"].switch-input');
        // Get the count of checkboxes found
        const checkboxCount = await checkboxes.count();
        // Loop through and check each checkbox if not already checked
        for (let i = 0; i < checkboxCount; i++) {
            const checkbox = checkboxes.nth(i); // Access each checkbox individually
            const isChecked = await checkbox.isChecked();
            console.log(`Checkbox ${i} is checked: ${isChecked}`);
            if (!isChecked) {
                await checkbox.scrollIntoViewIfNeeded();
               
                await checkboxes.nth(i).locator('..').locator('span.switch-handle').click();
                //await checkboxes.nth(i).locator('..').locator('.switch-handle').click();
            }
        }
        
        await Helpers.takeScreenshot(this.page,'tabName.png');

    }

    async verifySecurityRolesLeftMenu(pageName: string) {

        try {
            const securityRolesLeftMenuList = await this.page.getByTestId(this.selectors.securityRolesLeftSideMenu)
            if (!securityRolesLeftMenuList) {
                console.error('Security roles left menu list items not found.');
                return;
            }

            const ulElements = securityRolesLeftMenuList.locator('ul')
            const ulCount = await ulElements.count();
            if (ulCount !== expectedData[pageName].ulCount) {
                throw new Error(`Expected ${expectedData[pageName].ulCount} <ul> elements, but found ${ulCount}`);
            }
            console.log(`Found ${ulCount} <ul> elements inside the container.`);
            //Iterate over each < ul > and log the < li > elements inside
            for (let i = 0; i < ulCount; i++) {
                const ul = ulElements.nth(i);  // Get the ith <ul> element
                const liItems = ul.locator('li');  // Find all <li> elements under the <ul>
                const liCount = await liItems.count();
                console.log(`UL ${i + 1} has ${liCount} <li> elements.`)

                // Iterate over each <li> and log its text content
                for (let j = 0; j < liCount; j++) {
                    const liText = await liItems.nth(j).innerText();
                    // Access the expected list item from the JSON
                    if (liText.trim() !== expectedData[pageName].ulItems[i].liItems[j]) {

                        throw new Error(`Expected LI ${j + 1} in UL ${i + 1} to be "${expectedData.SystemSettingsPage[i].liItems[j]}", but found "${liText}"`);
                    }
                    console.log(`   LI ${j + 1}: ${liText.trim()}`);
                }

            }
        } catch (error) { console.error('An error occurred:', error) }

    }
}