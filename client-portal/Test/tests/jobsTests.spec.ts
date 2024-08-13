/**
 * File: jobsTest.spec.ts
 * Author: Shabbir Minhas
 * Date: July 16, 2024
 * 
 * Description:
 * This file contains test cases for the jobs page functionality of the application.
 * It includes tests to verify the jobs screen controls,
 * and validate successful operation of Job related functionality.
 * 
 * Classes:
 *   None
 * 
 * Functions:
 *   Verify Login Screen Controls: Test case to verify the login screen controls.
 *   Job Train Login Test :Test case to perform the login process.
 *   All other Tests related to Login Page are implemented in this File.
 * Usage:
 * Run the tests using a test runner or test framework such as Jest or Mocha.
 
 */

import { test, expect, Page } from "@playwright/test";
import LoginPage from "../pages/LoginPage";
import { Helpers } from "../utils/helpers";
import fs from 'fs';
//import { ExcelRow } from "../utils/excelUtils";
import ExcelUtils, { ExcelRow, WriteOptions } from "../utils/excelUtils";
// Import necessary modules
import { log } from "console";
import ExcelJS from 'exceljs';
import JobPage from "../pages/JobsPage";

type TableRow = { [key: string]: any };
let loginData: TableRow[];
let JobData: TableRow[];

test.beforeAll(async () => {
    loginData = await (ExcelUtils.readData('D:\\JobTrain Documents\\JobtrainData.xlsx', 'LoginData'));
    JobData = await ExcelUtils.readData('D:\\JobTrain Documents\\JobtrainData.xlsx', 'JobsData');
});
// Configure test mode
test.describe.configure({ mode: 'parallel' });

test.beforeEach(async ({ page }) => {

    await page.goto('JobsAndTalents/Jobs/List', { waitUntil: 'domcontentloaded', timeout: 65000 });//['load'][domcontentloaded][networkidle]
    //Initialize LoginPage object
    const loginPage = new LoginPage(page);
    await loginPage.loginJobPortal(loginData[8].Username, loginData[8]['Password']);
    await page.waitForLoadState('domcontentloaded');
    const jobsPage = new JobPage(page);
    await jobsPage.navigateToJobsList();

});


test('Jobs link is navigating to Job list page', async ({ page }) => {
    const jobsPage = new JobPage(page);
    //(await jobsPage.navigateToJobsPage()).click();
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveTitle('List of Jobs');
    const listOfJobsHeading = await jobsPage.listOfJobsHeading();
    await expect(listOfJobsHeading).toBeTruthy()


});
// Test case to verify login screen elements are displayed correctly
test('Verify Jobs page quick link section', async ({ page }) => {
    const jobsPage = new JobPage(page);
    await jobsPage.verifySideBarQuickLinkSection();
});