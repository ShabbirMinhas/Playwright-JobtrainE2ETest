
/**
* File: homeTests.spec.ts
* Author: Shabbir Minhas
* Date: May 28, 2024
* 
* Description:
* This file contains test cases for the home page functionality of the application.
* It includes tests to verify the home page controls, perform the home process,
* and validate home page functionality.
* 
* Classes:
*   None
* 
* Functions:
*   Verify home Screen Controls: Test case to verify the home screen controls, links and functionality.
*   Job Train .... :Test case to perform the Home Page functionality.
*   All other Tests related to Home Page are implemented in this File.
* Usage:
* Run the tests using a test runner or test framework such as Jest or Mocha.
 
*/

import { test, expect, Page } from "@playwright/test";
import { defineConfig, devices } from '@playwright/test';
import fs from 'fs';
//import { ExcelRow } from "../utils/excelUtils";
import ExcelUtils, { ExcelRow, WriteOptions } from "../utils/excelUtils";
import { Helpers } from "../utils/helpers";
import HomePage from "../pages/HomePage";
// Import necessary modules
import { log } from "console";
import ExcelJS from 'exceljs';
import LoginPage from "../pages/LoginPage";
import { TIMEOUT } from "dns";
import path from "path";
import exp from "constants";
import { json } from "stream/consumers";
//const (test,expect)= require('playwright')
function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// variable to hold data, initialized as 'any' type.
let loginData: any;
let homePageData: any;


// Configure test mode
test.describe.configure({ mode: 'parallel' });
// Define the type for the data object
interface LoginData {
    username: string;
    password: string;
}
test.beforeEach(async ({ page }) => {
    // Runs before each test and signs in each page.
    loginData = await (ExcelUtils.readData('D:\\JobTrain Documents\\JobtrainData.xlsx', 'LoginData'));
    homePageData = await (ExcelUtils.readData('D:\\JobTrain Documents\\JobtrainData.xlsx', 'HomePageData'));
    // Clear cookies and cache before navigating
    await page.context().clearCookies();

    await page.goto('Home', { waitUntil: 'domcontentloaded', timeout: 60000 });//['load'][domcontentloaded][networkidle]
    //Initialize LoginPage object
    const loginPage = new LoginPage(page);
    await loginPage.loginJobPortal(loginData[0].Username, loginData[0]['Password']);
    await page.waitForLoadState("networkidle");

});
test('Tiles Links Verification', async ({ page }) => {


});

test('Home page top navigation menu verification', async ({ page }) => {

    const homePage = new HomePage(page);

    /*await loginPage.enterUserName('ybs');
    await loginPage.enterPassword('21ClientT@');
    await loginPage.clickOnLoginButton();*/
    (await homePage.homeTab()).click();
    page.waitForLoadState('domcontentloaded');
    await delay(5000);
    
    const navBarMenu = await page.locator('[class*="navbar-nav"][class*="ml-auto"][class*="ng-tns-c"]');
    //const navBarMenu = await page.waitForSelector('[class*="ng-tns-c53-"][class*="collapse"][class*="navbar-collapse"]');
    const ulElements = await navBarMenu.locator('>*').all();




    if (ulElements) {
        // Locate the child elements within the parent

        // Get the count of li elements
        const liCount = ulElements.length;
        if (liCount == 10) {
            console.log(`Number of child li elements: ${liCount}`);

            // Iterate through li elements and perform actions
            for (let i = 0; i < liCount; i++) {
                const liText = await ulElements[i].innerText();
                console.log(`Text of li ${i + 1}: ${liText}`);

            }

        }

    } else {
        console.log('ul element not found within the parent div.');
    }



});
test('quick links menu verification.', async ({ page }) => {
    const homePage = new HomePage(page);
    // Read specific data from localStorage
    const storageValue = await page.evaluate(() => {
        return localStorage.getItem('jt7_storage_client_jobtrainlocalNotificationCount');
    });
    // Check if storageValue is not null and parse it
    if (storageValue) {
        try {
            const deskTopItems = JSON.parse(storageValue);
            console.log(deskTopItems);
        } catch (e) {
            console.error('Error parsing JSON:', e);
        }
    } else {
        console.log('No data found for the specified key.');
    }
  
    console.log(storageValue);
    const quickLinkElements = (await homePage.quickLinksSectionVerification());
    // const ul = await (await quickLinkElements.nth(3).getByRole('link'));
    const ul = (await quickLinkElements.nth(3).locator('>*'));
    // const ul = await (await quickLinkElements.nth(3).locator('>*'));

    // Get the count of all direct children
    const ulCount = await ul.count();
    console.log(`Number of children: ${ulCount}`);


    // Loop through all children and log their tag names
    for (let i = 0; i < ulCount; i++) {
        if (i == 2) {

            continue;
        }

        const child = ul.nth(i);
        const tagName = await child.evaluate(node => node.tagName.toLowerCase());

        let innerText: string = '';
        let classAttribute: string = '';
        try {
            classAttribute = await child.getAttribute('class') || '';
            innerText = await child.innerText();
            await (ul.nth(i).click());
            page.waitForLoadState('networkidle');
            await (Helpers.takeScreenshot(page, `${innerText}`));
            page.goBack();
            page.waitForLoadState('load');

        } catch (e) {
            console.log(`Error getting attributes for child ${i}:`, e);
        }

        //console.log(`Child ${i} tag name: ${tagName}, innerText: ${innerText}`);
        console.log(`Child ${i} tag name: ${tagName}, class: ${await child.getAttribute('class')}, innerText: ${await innerText}`);

    }





    // await (await ul.getByRole('link', { name: 'My Jobs' }).click());
    // await delay(3000);
    // await Helpers.takeScreenshot(page, `My Jobs.png`);
    // await (page.goBack());
    // await delay(3000);
    // await ul.getByRole('link', { name: 'Onboarding Hub' }).click();
    // await delay(3000);
    // await (Helpers.takeScreenshot(page, `Onboarding Hub.png`));
    // page.goBack();



});
test('verify all links on the home page', async ({ page }) => {


    // Collect all the links on the page
    const links = await page.$$eval('a', elements => elements.map(el => el.href));
    // const elements = await page.$$eval('a', elements => elements.map(el => ({ href: el.href, html: el.outerHTML })));
    // Iterate over each link and verify its status
    for (const link of links) {
        if (link && link !== 'javascript:void(0);' && link !== 'javascript:void(0)' && link! !== '') {
            if (link === 'https://test.jobtrain.co.uk/ybscareers/client/Home') {
                console.warn(`Skipping navigation to ${link} to prevent sign out.`);
                await Helpers.takeScreenshot(page, `Home.png`);
                continue; // Skip to the next iteration
            }
            // Link is defined and not an empty string
            console.log("Link is valid:", link);

            const response = await page.goto(link, { waitUntil: 'domcontentloaded', timeout: 35000 });// networkidle
            // await delay(3000);
            // Log the status code
            console.log(`Status code for ${link}: ${response?.status()}`);
            expect(response?.ok()).toBeTruthy(); // Check that the link responds with a successful status code
            // Extract the last part of the URL
            const urlParts = link.split('/');
            //const lastPart = urlParts[urlParts.length - 1];
            const lastPart = urlParts.slice(-2).join('/');

            // Use the last part in the screenshot name
            await Helpers.takeScreenshot(page, `${lastPart}.png`)

            // Go back to the previous page

            await page.goBack();
            // await page.waitForTimeout(4000);  // Wait for 2 seconds
            // await delay(3000);

        } else {
            // Link is either undefined or an empty string
            console.log("Link is invalid");
        }


    }
});

test('verify the links on the tiles', async ({ page }) => {


    // Easy way to triple the default timeout

    const expectedTexts = [
        '50\n\nJobs Awaiting Approval',
        '46\n\nJobs Advertised',
        '151\n\nLive Jobs',
        '83\n\nNew Applications',
        '0\n\nInterviews w/Calendar',
        '0\n\nInterviews w/out Calendar'
        // Add more expected values as needed
    ];
    const tilesMenuSection = await page.waitForSelector('[class*="home-statistics"][class*="dashboard-statistics"][class*="job-stats"]');
    const tilesMenuul = await page.$('[class*="home-statistics"][class*="dashboard-statistics"][class*="job-stats"]');


    if (tilesMenuul) {
        // Locate the child elements within the parent
        const liElements = await tilesMenuul.$$('li');
        // Get the count of li elements
        const liCount = liElements.length;
        // Add the check on liCount
        if (liCount !== 6) {
            throw new Error(`Expected 6 <li> elements, but found ${liCount}`);
        }
        console.log(`Number of tiles li elements: ${liCount}`);

        // Iterate through li elements and perform actions
        for (let i = 0; i < liCount; i++) {
            const liText = await liElements[i].innerText();
            console.log(`Text of li ${i + 1}: ${liText}`);
            if (liText !== expectedTexts[i]) {
                throw new Error(`Expected text: "${expectedTexts[i]}", but found: "${liText}"`);
            }

        }
    } else {
        console.log('ul element not found within the parent div.');
    }


});

test('Job search working', async ({ page }) => {

    const homeOjb = new HomePage(page);
    await homeOjb.searchTypeJobs();
    await (await homeOjb.searchForJobsInputBox()).fill('test');

    await homeOjb.clickSearchButton();
    await expect(page).toHaveTitle('Job Search');
    console.log('Job search working.');



});
test('Candidate search working', async ({ page }) => {

    const homeOjb = new HomePage(page);
    await homeOjb.searchTypeCondidates();
    await (await homeOjb.searchForCandiateInputBox()).fill('Acc*');

    await homeOjb.clickSearchButton();
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveTitle('Candidate Search');
    await expect(page).toHaveURL(new RegExp('^https://beta.jobtrain.co.uk/client/Search/Candidates?'))
    console.log('Candidate search working.');


});

test('verify add notes screen before adding notes', async ({ page }) => {

    const homePage = new HomePage(page);
    const getAddNotesDiv = (await homePage.addNotesDialogVerification()).click();
    const notesDialogElements = await page.locator('>*');
    const childCount = await notesDialogElements.count();
    // Loop through all children and log their tag names
    for (let i = 0; i < childCount; i++) {
        const child = notesDialogElements.nth(i);
        const tagName = await child.evaluate(node => node.tagName.toLowerCase());
        //delay(1000);
        let innerText = '';
        try {
            innerText = await child.innerText();
        } catch (e) {
            console.log(`Error getting innerText for child ${i}:`, e);
        }

        console.log(`Child ${i} tag name: ${tagName}, innerText: ${innerText}`);

    }
    // Get the innerText of the notes dialog element
    const innerText = await notesDialogElements.innerText();
    // Assert the innerText value
    expect(innerText).toBe('Add New To-Do Task ×TitleContentCount:500 Date       CloseSave');

    await page.getByLabel('Title');
    await page.getByPlaceholder('Please enter the title here ...');
    await page.getByLabel('Content');
    await page.getByPlaceholder('Please enter the content of the task here ...')
    // Locate the element containing "Count"
    const countLabel = await page.locator('span:has-text("Count:")');

    // Assert the "Count" text is present
    await expect(countLabel).toHaveText('Count: 500');

});


test('verify user can add notes', async ({ page }) => {

    const homePage = new HomePage(page);
    // Wait for a specific selector to appear

    await (await homePage.addNewNotes()).click();
    await (await homePage.fillNotesTitle()).fill('Notes title added through atuomation scripts');
    await (await homePage.fillNotesContents()).fill('Notes contents added through automation scripts');
    await page.waitForTimeout(1000);

    // Get the current date in the required format (DD/MM/YYYY)
    // await page.getByTestId('datepicker').dblclick();
    // (await homePage.notesDatePicker()).dblclick();
    await homePage.notesDatePicker();
    await (await homePage.notesSaveButton());
    await page.waitForTimeout(3000);

});

test('verify user can add notes directly by new button', async ({ page }) => {
    const homePage = new HomePage(page);
    const addNotesButton = (await homePage.addNewNotes())

    addNotesButton.click();
});
test('verify user can delete notes', async ({ page }) => {
    const homePage = new HomePage(page);
    const noOfNotesAdded = await (homePage.deleteNotes());
    const allNotesAdded = await (noOfNotesAdded.count());
    for (let i = 0; i < allNotesAdded; i++) {
        const element = await (noOfNotesAdded.nth(i));
        const notesTitle = await (element.innerText());
        if (notesTitle.includes('Notes title added through atuomation scripts')) {

            console.log(noOfNotesAdded.nth(i))

            await ((noOfNotesAdded.nth(i)).click())
            const children = await ((noOfNotesAdded.nth(i)).locator('>*').nth(1).locator('>*').nth(0).locator('>*').last().locator('#remove').click());
            break;
        }
    }

    console.log('Notes deleted.');



});

test('verify user can edit notes', async ({ page }) => {

    const homePage = new HomePage(page);
    const noOfNotesAdded = await (homePage.deleteNotes());
    const allNotesAdded = await (noOfNotesAdded.count());

    if (allNotesAdded !== 0) {

        await ((noOfNotesAdded.nth(0)).click())
        const children = await ((noOfNotesAdded.nth(0)).locator('#edit').click());
        await (await homePage.fillNotesTitle()).fill('Notes title edited through atuomation scripts');
        await (await homePage.fillNotesContents()).fill('Notes contents edited through automation scripts');
        await page.waitForTimeout(1000);
        await (await homePage.notesDatePicker());
        await (await homePage.notesSaveButton());
        await page.waitForTimeout(3000);

    } else {
        console.log('No Notes exist to edit');

    }



});


test('verify home page all controls count', async ({ page }) => {
    // set timeout to 50 seconds
    test.setTimeout(50 * 1000);
    const homePage = new HomePage(page);
    const numberOfControls = (await homePage.homePageMainScreenControlsVerification())
    const allChildren = numberOfControls.locator('>*');

    // Get the count of all direct children
    const childCount = await allChildren.count();
    console.log(`Number of children: ${childCount}`);


    // Loop through all children and log their tag names
    for (let i = 0; i < childCount; i++) {
        const child = allChildren.nth(i);
        const tagName = await child.evaluate(node => node.tagName.toLowerCase());

        let innerText: string = '';
        let classAttribute: string = '';
        try {
            classAttribute = await child.getAttribute('class') || '';
            innerText = await child.innerText();

        } catch (e) {
            console.log(`Error getting attributes for child ${i}:`, e);
        }

        //console.log(`Child ${i} tag name: ${tagName}, innerText: ${innerText}`);
        console.log(`Child ${i} tag name: ${tagName}, class: ${await child.getAttribute('class')}, innerText: ${await innerText}`);

    }
});