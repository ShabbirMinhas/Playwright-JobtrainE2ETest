/**
 * File: userSettingsTests.spec.ts
 * Author: Shabbir Minhas
 * Date: July 18, 2024
 * 
 * Description:
 * This file contains test cases for the User SettingsTests page functionality of the application.
 * It includes tests to verify the user settings screen controls,
 * and validate successful operation of settings related functionality.
 * 
 * Classes:
 *   None
 * 
 * Functions:
 *   Verify user settings Screen Controls: Test case to verify the user settings screen controls.
 *   Job Train user settings Test :Test case to perform the user settings process.
 *   All other Tests related to user settings Page are implemented in this File.
 * Usage:
 * Run the tests using a test runner or test framework such as Jest or Mocha.
 
 */


import { test, expect, Page } from "@playwright/test";
import { defineConfig, devices } from '@playwright/test';
import fs from 'fs';
//import { ExcelRow } from "../utils/excelUtils";
import ExcelUtils, { ExcelRow, WriteOptions } from "../utils/excelUtils";
import { Helpers } from "../utils/helpers";

// Import necessary modules
import { log } from "console";
import ExcelJS from 'exceljs';
import LoginPage from "../pages/LoginPage";

import path from "path";
import exp from "constants";
import UserSettingsPage from "../pages/UserSettingsPage";
//const (test,expect)= require('playwright')
function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// variable to hold data, initialized as 'any' type.
type TableRow = { [key: string]: any };
let loginData: TableRow[];
let userSettingsData: TableRow[];



// Configure test mode
test.describe.configure({ mode: 'parallel' });
// Define the type for the data object
interface LoginData {
    username: string;
    password: string;
}
// Use the saved state to load the authenticated session
test.use({ storageState: 'state.json' });
test.describe('User Settings Tests', () => {
    // This hook runs once before all tests in this suite
    test.beforeAll(async () => {

       // loginData = await (ExcelUtils.readData('D:\\JobTrain Documents\\JobtrainData.xlsx', 'LoginData'));
        userSettingsData = await (ExcelUtils.readData('D:\\JobTrain Documents\\JobtrainData.xlsx', 'UserSettingsData'));

    });
    test.beforeEach(async ({ page }) => {


        await page.goto('Settings/UserSetting/Detail', { waitUntil: 'domcontentloaded', timeout: 60000 });
        await page.waitForLoadState("domcontentloaded");
        await page.waitForLoadState('networkidle');

    });
    test('navigate to User settings ', async ({ page }) => {
        const userSettings = new UserSettingsPage(page);
        await page.waitForLoadState('networkidle');
        await (await userSettings.navigateToUserProfileLink()).click();
        await Helpers.takeScreenshot(page, 'user Profile')
        await (await userSettings.navigateToUserSettingsLink()).click();


    });
    test('verify user settings page title and url', async ({ page }) => {
        const userSettings = new UserSettingsPage(page);
        // await (await userSettings.navigateToUserProfileLink()).click();
        // await (await userSettings.navigateToUserSettingsLink()).click();
        
        await userSettings.verifyUserSettingsPageTitle(userSettingsData[0].title, userSettingsData[0].url);


    });

    test('verify main buttons on User settings', async ({ page }) => {
        const userSettings = new UserSettingsPage(page);
        // await (await userSettings.navigateToUserProfileLink()).click();
        // await (await userSettings.navigateToUserSettingsLink()).click();
        await page.waitForLoadState('networkidle');
        await userSettings.verifyMainButtonsOnUserSettings();
        await Helpers.takeScreenshot(page, 'user settings');
    });

    test('verify personal information of the user', async ({ page }) => {
        const userSettings = new UserSettingsPage(page);
        // await (await userSettings.navigateToUserProfileLink()).click();
        // await (await userSettings.navigateToUserSettingsLink()).click();
        await page.waitForLoadState('networkidle');
        const [firstName, lastName, email] = await userSettings.verifyPersonalInfo();
        const { firstName: expectedFirstName, lastName: expectedLastName, email: expectedEmail } = userSettingsData[0];
        // Validation
        if (firstName !== expectedFirstName) {
            throw new Error(`Validation failed: Expected first name to be ${userSettingsData[0].firstName}, but got ${firstName}`);
        }
        if (lastName !== expectedLastName) {
            throw new Error(`Validation failed: Expected last name to be ${userSettingsData[0].lastName}, but got ${lastName}`);
        }
        if (email !== expectedEmail) {
            throw new Error(`Validation failed: Expected email to be ${userSettingsData[0].email}, but got ${email}`);
        }
        // If all validations pass
        console.log('first name , last name and email verification passed.');
        await Helpers.takeScreenshot(page, 'user settings');
    });

    test('verify themes details and settings ', async ({ page }) => {
         const userSettings = new UserSettingsPage(page);
        // await (await userSettings.navigateToUserProfileLink()).click();
        // await (await userSettings.navigateToUserSettingsLink()).click();
         await page.waitForLoadState('networkidle');
        await userSettings.clickOnThemeDetailButton();
        await userSettings.verifyThemeDetail();
        await Helpers.takeScreenshot(page, 'user themes');
    });


    test('verify all controls with their children at user settings screen', async ({ page }) => {
        const userSettings = new UserSettingsPage(page);
        // await (await userSettings.navigateToUserProfileLink()).click();
        // await (await userSettings.navigateToUserSettingsLink()).click();
        await page.waitForLoadState('networkidle');
        const controlsWithChildren = await userSettings.getAllDivControlsWithChildren();

        // Log the result
        console.log(controlsWithChildren);

        // You can add assertions here to verify the controls
        // Example: expect(controlsWithChildren.length).toBeGreaterThan(0);
    });




});