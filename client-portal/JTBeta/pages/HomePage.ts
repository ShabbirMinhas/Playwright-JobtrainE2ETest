/**
 * File: HomePage.ts
 * Author: Shabbir Minhas
 * Date: May 28, 2024
 * 
 * Description:
 * This file defines the Home Page class, which implements the Page Object Model (POM) pattern.
 * The Home Page class encapsulates all interactions and elements related to the home/landing
 *  page functionality of the application.
 * 
 * Classes:
 *   HomePage:
 *     Description: Encapsulates interactions and elements related to the home page functionality.
 *     Author: Shabbir Minhas
 * 
 * Usage:
 * import HomePage from "../pages/HomePage";
 * const home = new HomePage(page);
 * ;
 */



import { Browser, Page, chromium, expect } from "@playwright/test";
import { TIMEOUT } from "dns";
//import { checkPrime } from "crypto";
//import { url } from "inspector";


// HomePage class
export default class HomePage {

    page: Page;
    // homeTab='Home'//getByID
    // Define the selectors object 
    selectors: {

        topNavBarMenu: string;
        homeTab: string;
        jobTab: string;
        quickLinkButton: string;
        quickLinkNavButton: string;
        quickLinkDiv: string;
        homeSearchDiv: string;
        homeSearchCandidate: string;
        homeSearchJobs: string;
        homeSearchButton: string;
        addNotes: string;
        addNewNotes: string;
        homePageBottomRow: string;
        homePageMainDiv: string;
        notesTitleInputField: string;
        notesContentTextArea: string;
        notesDatePicker: string;
        notesSaveButton: string;
        deleteNotesDiv: string;
        deleteNote: string;

        // Add more selectors as needed
    };
    // Class constructor 
    constructor(page: Page) {

        this.page = page;
        this.selectors = {

            homeTab: 'Home',// Use getByTestId
            topNavBarMenu: '.ng-tns-c52-0 collapse navbar-collapse',// Use getByClass
            jobTab: '', // Use getByRole(button)
            quickLinkButton: 'Quick Links',// Use getByTestId
            quickLinkNavButton: 'LeftSideMenu',// Use getByTestId
            homeSearchDiv: '.input-group.home_search',
            homeSearchCandidate: 'Search for Candidates',//Use getByPlaceholder 
            homeSearchJobs: '',//Use getByPlaceholder 
            homeSearchButton: 'Search',
            quickLinkDiv: 'quick-nav',// Use getByTestId
            homePageBottomRow: '.row.bottom-card-row', // Use getByClass'
            addNotes: ' New Task ',
            addNewNotes: '.btn.btn-outline-dark.btn-sm.pull-right.mr-3',//user getByClass
            homePageMainDiv: '#main div',
            // homeSearchInputBox: 'Search for Jobs',//Use getByRole(textbox)
            notesTitleInputField: 'Please enter the title here ...',//Use getByPlaceholder 
            notesContentTextArea: 'Please enter the content of the task here ...',//Use getByPlaceholder
            notesDatePicker: 'datepicker',// Use getByTestId
            notesSaveButton: 'Save',// Use getByRole(button)
            deleteNotesDiv: 'accordionExample',
            deleteNote: 'remove'
            // Use getByRole (Link)
            // Use getByText
        };
    }
    //Navigation to the login page
    async navigateToHomePage(url: string) {



        await this.page.goto(url);

    }
    async homeTab() {

        return await this.page.getByTestId(this.selectors.homeTab);
    }
    async jobTab() {

        return await this.page.getByTestId(this.selectors.jobTab);
    }

    async tilesLinksVerification() {

        return await this.page.getByPlaceholder(this.selectors.jobTab);
    }

    async jobSearchFormVerification() {

        const homeSearchForm = await (this.page.locator(this.selectors.homeSearchDiv).locator('>*'));
        await homeSearchForm.first().fill('A*');
        const homeSearchOptionss = await homeSearchForm.nth(2).locator('>*');
        await homeSearchOptionss.first().selectOption({ value: '0: ForJobs' });
        await homeSearchOptionss.nth(1).click();
        await expect(this.page).toHaveTitle('Job Search')
        const count = await (homeSearchForm.count());
        for (let i = 0; i < count; i++) {
            const element = await (homeSearchForm.nth(i));
            const tagName = await element.evaluate(node => node.tagName.toLowerCase());


            let innerText = '';
            try {
                innerText = await element.innerText();
            } catch (e) {
                console.log(`Error getting innerText for child ${i}:`, e);
            }

            console.log(`Child ${i} tag name: ${tagName}, innerText: ${innerText}`);
        }

        return homeSearchForm;

    }

    async searchTypeJobs() {

        await this.page.getByTestId('searchType').selectOption('0: ForJobs');
        //         await page.getByPlaceholder('Username').fill('jtadmin_new');

        //   await page.getByPlaceholder('Password').fill('21ClientT@');

        //   await page.goto('https://beta.jobtrain.co.uk/client/Home');
    }

    async searchTypeCondidates() {
        return await this.page.getByTestId('searchType').selectOption('1: ForCandidates');


    }
    async searchForCandiateInputBox() {

        return await this.page.getByPlaceholder('Search for Candidates');
    }

    async searchForJobsInputBox() {

        return await this.page.getByPlaceholder('Search for Jobs');
    }
    async clickSearchButton() {

        await (this.page.getByRole('button', { name: 'Search' })).click();
        
    }
    async addNewNotes() {


        const addNewNotesButton = await this.page.getByRole('button', { name: this.selectors.addNotes });
        // return  await this.page.locator('.btn.btn-outline-dark.btn-sm.pull-right.mr-3');
        return addNewNotesButton;
    }
    async clickTitleAtNotes() {

        return await this.page.getByPlaceholder(this.selectors.notesTitleInputField);

    }

    async fillNotesTitle() {

        return await this.page.getByRole('textbox', { name: this.selectors.notesTitleInputField })


    }
    async fillNotesContents() {

        return await this.page.getByRole('textbox', { name: this.selectors.notesContentTextArea })


    }
    async notesDatePicker() {

        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = today.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;
        console.log(formattedDate);
        this.page.getByTestId(this.selectors.notesDatePicker).dblclick();
        //await this.page.getByPlaceholder(this.selectors.notesDatePicker).click()
        await this.page.getByTestId(this.selectors.notesDatePicker).fill(formattedDate);

    }
    async notesSaveButton() {

        await this.page.getByRole('button', { name: this.selectors.notesSaveButton }).click();

    }
    async notesAlertVerification() {

        await this.page.getByRole('button', { name: this.selectors.notesSaveButton }).click();

    }

    async addNotesUsingIndexesOfTheControls() {

        //return  await this.page.getByRole('button',{name:this.selectors.addNotes});
        return await this.page.locator(this.selectors.homePageMainDiv);
    }

    async deleteNotes() {

        const allNotes = await (this.page.getByTestId(this.selectors.deleteNotesDiv)).locator('>*');
        const noOfNotesAdded = await (allNotes.count());
        console.log(noOfNotesAdded);
        for (let i = 0; i < noOfNotesAdded; i++) {
            const element = allNotes.nth(i);
            const tagName = await element.evaluate(node => node.tagName.toLowerCase());
            console.log(`Element ${i}: ${tagName}`);

            let innerText = '';
            try {
                innerText = await element.innerText();
            } catch (e) {
                console.log(`Error getting innerText for child ${i}:`, e);
            }

            console.log(`Child ${i} tag name: ${tagName}, innerText: ${innerText}`);
        }
        return allNotes;
    }

    async editNotes() {

        const allNotes = await (this.page.getByTestId(this.selectors.deleteNotesDiv)).locator('>*');
        const noOfNotesAdded = await (allNotes.count());
        console.log(noOfNotesAdded);
        for (let i = 0; i < noOfNotesAdded; i++) {
            const element = allNotes.nth(i);
            const tagName = await element.evaluate(node => node.tagName.toLowerCase());
            console.log(`Element ${i}: ${tagName}`);

            let innerText = '';
            try {
                innerText = await element.innerText();
            } catch (e) {
                console.log(`Error getting innerText for child ${i}:`, e);
            }

            console.log(`Child ${i} tag name: ${tagName}, innerText: ${innerText}`);
        }
        return allNotes;
    }

    async deleteNote() {

        return await (this.page.getByTestId(this.selectors.deleteNote));
    }

    async addNotesDialogVerification() {
        TIMEOUT: 3000;
        const homePageMainDiv = await this.page.locator(this.selectors.homePageMainDiv);
        TIMEOUT: 3000;
        const allChildren = await homePageMainDiv.locator('>*');
        const childCount = await allChildren.count();
        if (childCount < 361) {

            console.log(`Number of children: ${childCount}`);
            throw new Error(`Expected children: "${361}", but found: "${childCount}"`);
        } else {

            const getAddNotesDiv = await allChildren.nth(287);
            return getAddNotesDiv;
        }


    }
    async homePageMainScreenControlsVerification() {
        return await this.page.locator('#main div');


    }


    async quickLinksSectionVerification() {


        const quickLinkMainDiv = await this.page
            .getByTestId(this.selectors.quickLinkDiv)
            .locator('.scrollbar');
        const quickLinkDiv = await quickLinkMainDiv.locator('.force-overflow');
        const quickLinkAllElements = await quickLinkDiv.locator('>*');
        // Get the count of all direct children
        const elementCount = await quickLinkAllElements.count();
        for (let i = 0; i < elementCount; i++) {
            const element = quickLinkAllElements.nth(i);
            const tagName = await element.evaluate(node => node.tagName.toLowerCase());
            console.log(`Element ${i}: ${tagName}`);
        }

        return quickLinkAllElements;


    }


    async quickLinkButton() {


        const quickLinkMainDiv = await this.page
            .getByTestId(this.selectors.quickLinkDiv)
            .locator('.scrollbar');
        const quickLinkDiv = await quickLinkMainDiv.locator('.force-overflow')
        const quickLinkAllElements = await quickLinkDiv.locator('>*');
        return quickLinkAllElements;


    }

    async homePageBottomRow() {


        const landingPageBottomRow = await this.page
            .locator(this.selectors.homePageBottomRow)




    }

    async homePage() {


        const landingPageBottomRow = await this.page
            .locator(this.selectors.homePageBottomRow)




    }

}