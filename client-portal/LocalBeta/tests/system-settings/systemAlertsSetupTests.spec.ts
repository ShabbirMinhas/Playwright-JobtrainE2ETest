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
import SystemAlertsSetupPage from "../../pages/system_settings/SystemAlertsSetupPage";



function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// variable to hold data, initialized as 'any' type.
type TableRow = { [key: string]: any };

let SystemSettingsPageData: TableRow[];
let systemAlertsSetup: SystemAlertsSetupPage;
let sysSettings: SystemSettingsPage;
// Use the saved state to load the authenticated session
test.use({ storageState: 'state.json' });

test.beforeAll(async () => {

    // loginData = await (ExcelUtils.readData('D:\\JobTrain Documents\\JobtrainData.xlsx', 'LoginData'));
    SystemSettingsPageData = await (ExcelUtils.readData('D:\\JobtrainData.xlsx', 'SystemSettingsData'));


});
test.beforeEach(async ({ page }) => {


    await page.goto('Settings', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState('networkidle');
    sysSettings = new SystemSettingsPage(page);
    systemAlertsSetup = new SystemAlertsSetupPage(page);


});


test('System Alerts Setup settings verification', async ({ page }) => {
    // Alternative method: You can also select the item by its name using systemSettingsLeftMenuLinkByName().
    await (await sysSettings.systemSettingsLeftMenuLinkByIndex(8));

    await page.waitForLoadState('networkidle');
    await systemAlertsSetup.verifySystemAlertsSetupScreen();
    console.log('all headings are intact');
    await Helpers.takeScreenshot(page, 'System Alerts Setup');

});

test('System Settings system alert setup page verification',async({page})=>{
   
    await (await sysSettings.systemSettingsLeftMenuLinkByIndex(8));

    await page.waitForLoadState('networkidle');
    await sysSettings.verifyUnorderedListsAndItems('SystemAlertsSetupPageData');
    console.log('all headings are intact');
   

});