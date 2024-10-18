import { test, expect, Page } from "@playwright/test";
import { defineConfig, devices } from '@playwright/test';
import fs from 'fs';
//import { ExcelRow } from "../utils/excelUtils";

import ExcelUtils, { ExcelRow, WriteOptions } from "../../utils/excelUtils";
import { Helpers } from "../../utils/helpers";

// Import necessary modules
import { log } from "console";
import ExcelJS from 'exceljs';
import LoginPage from "../../pages/LoginPage";

import path from "path";
import exp from "constants";

import SystemSettingsPage from "../../pages/system_settings/SystemSettingsPage";
import ApplicationTemplatePage from "../../pages/system_settings/ApplicationTemplatesPage";



function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// variable to hold data, initialized as 'any' type.
type TableRow = { [key: string]: any };

let ApplicationTemplateData: TableRow[];
let applicationTemplatePage: ApplicationTemplatePage;
let sysSettings: SystemSettingsPage;
// Use the saved state to load the authenticated session
test.use({ storageState: 'state.json' });

test.beforeAll(async () => {

    // loginData = await (ExcelUtils.readData('D:\\JobTrain Documents\\JobtrainData.xlsx', 'LoginData'));
    ApplicationTemplateData = await (ExcelUtils.readData('D:\\JobtrainData.xlsx', 'SystemSettingsData'));


});
test.beforeEach(async ({ page }) => {


    await page.goto('Settings', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState('networkidle');
    sysSettings = new SystemSettingsPage(page);
    applicationTemplatePage = new ApplicationTemplatePage(page);


});


test(' Application Template verification ', async ({ page }) => {
    // Note: An overload of this function exists that allows selection by name.
    await (await sysSettings.systemSettingsLeftMenuLinkByName('Application Templates'));

    await page.waitForLoadState('networkidle');
    await applicationTemplatePage.verifyApplicationTemplateScreen();
    console.log('all headings are intact');
    await Helpers.takeScreenshot(page, 'Application Template');

});
test('System Settings application template page verification',async({page})=>{
   
    await (await sysSettings.systemSettingsLeftMenuLinkByIndex(4));

    await page.waitForLoadState('networkidle');
    await sysSettings.verifyUnorderedListsAndItems('ApplicationTemplatesPageData');
    console.log('all headings are intact');
   

});