/**
 * File: systemSettingsTests.spec.ts
 * Author: Shabbir Minhas
 * Date: July 29, 2024
 * 
 * Description:
 * This file contains test cases for the system settings tests page functionality of the application.
 * It includes tests to verify the system settings screen controls,
 * and validate successful operation of settings related functionality.
 * 
 * Classes:
 *   None
 * 
 * Functions:
 *   Verify system settings Screen Controls: Test case to verify the system settings screen controls.
 *   Job Train system settings Test :Test case to perform the system settings process.
 *   All other Tests related to system settings Page are implemented in this File.
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
import SystemSettingsPage from "../pages/SystemSettingsPage";

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// variable to hold data, initialized as 'any' type.
type TableRow = { [key: string]: any };
let loginData: TableRow[];
let systemSettingsData: TableRow[];

// Use the saved state to load the authenticated session
test.use({ storageState: 'state.json' });

test.beforeAll(async () => {

    // loginData = await (ExcelUtils.readData('D:\\JobTrain Documents\\JobtrainData.xlsx', 'LoginData'));
     systemSettingsData = await (ExcelUtils.readData('D:\\JobTrain Documents\\JobtrainData.xlsx', 'SystemSettingsData'));

 });
 test.beforeEach(async ({ page }) => {


     await page.goto('Settings', { waitUntil: 'domcontentloaded', timeout: 60000 });
     await page.waitForLoadState("domcontentloaded");
     await page.waitForLoadState('networkidle');

 });

 test('navigate to system settings ', async ({ page }) => {
    const sysSettings = new SystemSettingsPage(page);
    await page.waitForLoadState('networkidle');
    await (await sysSettings.navigateToSystemSettingsLink()).click();
    await page.waitForLoadState('networkidle');
    await Helpers.takeScreenshot(page, 'system settings home ')
    


});
test('navigate to System Customisation ', async ({ page }) => {
    const sysSettings = new SystemSettingsPage(page);
    await page.waitForLoadState('networkidle');
    const response =await (await sysSettings.openSystemCustomisation()).click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('http://beta.jobtrain.com/Settings/SystemCustomisation/Create');
    await Helpers.takeScreenshot(page, 'System Customisation ')
    


});

test('navigate to system users ', async ({ page }) => {
    const sysSettings = new SystemSettingsPage(page);
   
    await (await sysSettings.openSystemUsers()).click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('http://beta.jobtrain.com/Settings/UserSetting/List');
    await Helpers.takeScreenshot(page, 'system users ');

});
test('navigate to security roles ', async ({ page }) => {
    const sysSettings = new SystemSettingsPage(page);
   
    await (await sysSettings.openSecurityRoles()).click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('http://beta.jobtrain.com/Settings/SecurityRoles/List');
    await Helpers.takeScreenshot(page, 'security roles ');
    
});
test('navigate to Multiple Document Upload ', async ({ page }) => {
    const sysSettings = new SystemSettingsPage(page);
   
    await (await sysSettings.openMultipleDocumentUpload()).click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('http://beta.jobtrain.com/Settings/MultipleDocumentsUploads/List');
    await Helpers.takeScreenshot(page, 'Multiple Document Upload');
    
});
test('navigate to System Pipelines ', async ({ page }) => {
    const sysSettings = new SystemSettingsPage(page);
   
    await (await sysSettings.openSystemPipelines()).click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('http://beta.jobtrain.com/Settings/SystemPipeline/List');
    await Helpers.takeScreenshot(page, 'System Pipelines');
    
});
test('navigate to welcome email ', async ({ page }) => {
    const sysSettings = new SystemSettingsPage(page);
   
    await (await sysSettings.openWelcomeEmail()).click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('http://beta.jobtrain.com/Settings/UserSetting/WelcomeEmails');
    await Helpers.takeScreenshot(page, 'welcome email');
    
});
test('navigate to Public Report Library', async ({ page }) => {
    const sysSettings = new SystemSettingsPage(page);
   
    await (await sysSettings.openPublicReportLibrary()).click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('http://beta.jobtrain.com/ReportBuilder/public-report-library');
    await Helpers.takeScreenshot(page, 'Public Report Library');
    
});
test(' verification of quick links', async ({ page }) => {
    const sysSettings = new SystemSettingsPage(page);
    await sysSettings.systemSettingsQuickLinks();
   
   
});