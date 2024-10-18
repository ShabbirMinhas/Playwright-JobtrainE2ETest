import { Browser, Page, chromium, expect } from "@playwright/test";
import { Helpers } from "../../utils/helpers";
import { error, timeLog } from "console";
import exp from "constants";
import SystemSettingsPage from "./SystemSettingsPage";


// System Settings communication class
export default class CommunicationPage  extends SystemSettingsPage{

    page: Page;

   selectors = {
   
        ...super.getSelectors(),
        
        pageHeading:'Communication',//getByRole
        emailOptions:' Email Options ',
        letterOptions:' Letter Options ',
        contractOptions:' Contract Options ',
        smsOptions:' SMS Options ',  
        selectFirstRecord:'div-tbl-row-data-cell-checkbox-0-EMAILINBOXID',
        emailTemplateUl:'ul-conatiner-listing-email-templates-leftmenu',
        emailSearchInputBox:'txt-search-listing-email-templates',
        emailSearchButton:'btn-search-listing-email-templates',
        emailNameInput:'txt-email-name',
        emailSubjectInput:'txt-email-subject',
        emailLocationInput:'txt-value-select-location',
        description: 'txt-description',
              // Add more selectors as needed
    };

     // Class constructor 
     constructor(page: Page) {
        super(page);
        this.page = page;
        
    }

   
    async verifyCommunicationScreen() {

        await expect(this.page.getByRole('heading', { name: this.selectors.pageHeading })).toBeVisible();
        console.log("Communication main page heading is visible.");
        await expect(this.page.getByRole('heading', { name: this.selectors.emailOptions })).toBeVisible();
        console.log("Email options heading is visible.");
        await expect(this.page.getByRole('heading', { name: this.selectors.letterOptions })).toBeVisible();
        console.log("Letter options heading is visible.");
        await expect(this.page.getByRole('heading', { name: this.selectors.letterOptions })).toBeVisible();
        console.log("SMS options heading is visible.");
        await expect(this.page.getByRole('heading', { name: this.selectors.smsOptions })).toBeVisible();
        console.log("All elements on the Communication Screen are verified successfully.");
    }
   
    async selectFirstRecord() {

        return await this.page.getByTestId(this.selectors.selectFirstRecord).click();

    }
    async navigateToEmailOptions(emailHeadings:string) {

        await this.page.getByRole('heading', { name: emailHeadings }).click();

    }
    async navigateToLetterOptions(letterHeadings:string) {

        await this.page.getByRole('heading', { name: letterHeadings }).click();

    }
    async navigateToContractOptions(contractHeadings:string) {

        await this.page.getByRole('heading', { name: contractHeadings }).click();

    }
    async navigateToSMSOptions(smsHeadings:string) {

        await this.page.getByRole('heading', { name: smsHeadings }).click();

    }
   
    async emailSearchInput() {

        return await this.page.getByTestId(this.selectors.emailSearchInputBox);

    }
    async emailSearchButton() {

        return await this.page.getByTestId(this.selectors.emailSearchButton).click();

    }
    async emailBodyText(text: string) {
       // await this.page.getByTestId(this.selectors.description)
        //    .fill('automation text');
        await this.page.frameLocator('iframe[title="Rich Text Editor\\, editor1"]').locator('html').click();
        await this.page.frameLocator('iframe[title="Rich Text Editor\\, editor1"]').locator('body').fill('this body is generated automatically');

    }
    async createCommunicationEmail() {

       await this.page.getByTestId(this.selectors.emailNameInput)
       .fill('automation');
       await this.page.getByTestId(this.selectors.emailSubjectInput)
       .fill('auto subject');
       await this.page.getByTestId(this.selectors.emailLocationInput)
       .fill('auto subject');

    }


    async openAndVerifyEmailTemplatesScreen(numberOfListItems: number) {
        try {

            const ulElements = await this.page.getByTestId(this.selectors.emailTemplateUl);
            await ulElements.first().waitFor();
            const liElements = await ulElements.locator('li');

            await expect(liElements).toHaveCount(numberOfListItems)
            const totalListItems = await (liElements.count());



            console.log(`Total List Items: ${totalListItems}`);
            if (totalListItems >= numberOfListItems && totalListItems < numberOfListItems) {
                const liHandles = await liElements.elementHandles();
                console.log(`Found ${liHandles.length} li elements.`);
            } else {
                console.error('No li elements found.');
            }
            // Iterate over li elements and log their content
            for (let i = 0; i < totalListItems; i++) {
                const liText = await liElements.nth(i).innerText();
                console.log(`LI ${i + 1}: ${liText}`);
            }

        } catch (error) {
            console.error('An error occurred:', error);

        }
    }

}