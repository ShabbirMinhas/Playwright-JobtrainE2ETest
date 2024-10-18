import { test, expect, Page } from "@playwright/test";
import { defineConfig, devices } from '@playwright/test';
import fs from 'fs';
//import { ExcelRow } from "../utils/excelUtils";

import ExcelUtils, { ExcelRow, WriteOptions } from "../../utils/excelUtils";
import { Helpers } from "../../utils/helpers";

// Import necessary modules
import { log } from "console";
import ExcelJS from 'exceljs';


import path from "path";
import exp from "constants";

import SystemSettingsPage from "../../pages/system_settings/SystemSettingsPage";
import OnboardingPage from "../../pages/system_settings/WelcomeHubPage";
import WelcomeHub from "../../pages/system_settings/WelcomeHubPage";
import WelcomeHubPage from "../../pages/system_settings/WelcomeHubPage";



function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// variable to hold data, initialized as 'any' type.
type TableRow = { [key: string]: any };

let welcomeHubPageData: TableRow[];
let welcomeHub: WelcomeHubPage;
let sysSettings: SystemSettingsPage;
// Use the saved state to load the authenticated session
test.use({ storageState: 'state.json' });

test.beforeAll(async () => {

    // loginData = await (ExcelUtils.readData('D:\\JobTrain Documents\\JobtrainData.xlsx', 'LoginData'));
    welcomeHubPageData = await (ExcelUtils.readData('D:\\JobtrainData.xlsx', 'SystemSettingsData'));


});
test.beforeEach(async ({ page }) => {


    await page.goto('Settings', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState('networkidle');
    sysSettings = new SystemSettingsPage(page);
    welcomeHub = new WelcomeHubPage(page);


});


test('Welcome Hub settings verification', async ({ page }) => {

    await (await sysSettings.systemSettingsLeftMenuLinkByIndex(7));

    await page.waitForLoadState('networkidle');
    await welcomeHub.verifyWelcomeHubScreen();
    console.log('all headings are intact');
    await Helpers.takeScreenshot(page, 'welcome Hub Settings');

});
test('System Settings welcome hub setup page verification',async({page})=>{
   
    await (await sysSettings.systemSettingsLeftMenuLinkByIndex(7));

    await page.waitForLoadState('networkidle');
    await sysSettings.verifyUnorderedListsAndItems('WelcomeHubSetupPageData');
    console.log('all headings are intact');
   

});