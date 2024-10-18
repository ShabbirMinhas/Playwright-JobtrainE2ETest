import { Browser, Page, chromium, expect } from "@playwright/test";
import { Helpers } from "../../utils/helpers";
import { error, timeLog } from "console";
import exp from "constants";
import SystemSettingsPage from "./SystemSettingsPage";
import { TIMEOUT } from "dns";
import path from "path";

// System Settings communication class
export default class MediaLibraryPage extends SystemSettingsPage {

    page: Page;

    selectors = {

        ...super.getSelectors(),
        //Welcome Hub
        // pageHeading:'div-page-title',//getByTestId

        imageLibrary: 'Image Library',
        videoLibrary: 'Video Library',
        textLibrary: 'Text Library',
        ul: 'data-testid-ul-tiles-container',
        mediaLibrarySearchInput: 'txt-search-listing-media-library',
        selectFirstRecord: 'div-tbl-row-data-cell-checkbox-0-MediaLibraryID',
        description: 'txt-description',
        forCandidates: 'txt-for-candidates',
        browseImageButton: 'btn-browse',
        videoFile: 'txt-file-name',
        textEditor: 'cke_1_contents'//by id 

        // imageSearch:'txt-search-listing-media-library',
        // videoSearch:'txt-search-listing-media-library'


        // Add more selectors as needed
    };

    // Class constructor 
    constructor(page: Page) {
        super(page);
        this.page = page;


    }
    async selectFirstRecord() {

        return await this.page.getByTestId(this.selectors.selectFirstRecord).click();

    }
    async uploadNewText(text: string) {
        await this.page.getByTestId(this.selectors.description)
            .fill('automation text');
        await this.page.frameLocator('iframe[title="Rich Text Editor\\, editor1"]').locator('html').click();
        await this.page.frameLocator('iframe[title="Rich Text Editor\\, editor1"]').locator('body').fill('text uploaded by Automation script');

    }
    async uploadImageDetails(text: string) {
        await this.page.getByTestId(this.selectors.description)
            .fill('automation image');
        await this.page.getByTestId(this.selectors.forCandidates)
            .fill('automation candidate');
    }
    async uploadVideo(text: string) {
        await this.page.getByTestId(this.selectors.description)
            .fill('automation video');
        await this.page.getByTestId(this.selectors.forCandidates)
            .fill('automation candidate');
        await this.page.getByTestId(this.selectors.videoFile)
            .fill('xl9RnZ9lCEY');
    }


    async uploadImage(imageFileName: string) {

        const filePath = path.resolve(process.cwd(), 'utils', 'images', 'image.png');
        // Locate the hidden file input element by its ID or data-testid
        const fileInput = await this.page.locator('input#custom-input');  // Or use: await this.page.locator('[data-testid="txt-custom-input"]');
        // Upload the file directly
        await fileInput.setInputFiles(filePath);
        // Optionally: Verify or proceed with further actions after file upload
        console.log('File uploaded successfully.');
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
    async verifyMediaLibraryScreen() {

        await expect(this.page.getByTestId(this.selectors.pageHeading)).toBeVisible();
        console.log("System settings media library page heading is visible.");
        await expect(this.page.getByRole('heading', { name: this.selectors.imageLibrary, exact: true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.videoLibrary, exact: true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.textLibrary, exact: true })).toBeVisible();

        console.log("All elements on Media Library screen are visible.");
    }

    async openAndVerifyMediaLibraryScreen(numberOfListItems: number) {
        try {

            const ulElements = await this.page.getByTestId(this.selectors.ul);
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