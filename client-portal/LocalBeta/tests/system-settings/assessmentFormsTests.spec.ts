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


import AssessmentFormsPage from "../../pages/system_settings/AssessmentFormsPage";

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// variable to hold data, initialized as 'any' type.
type TableRow = { [key: string]: any };

let assessementFormsData: TableRow[];
let assessmentFormsPage: AssessmentFormsPage;
let sysSettings: SystemSettingsPage;
// Use the saved state to load the authenticated session
test.use({ storageState: 'state.json' });

test.beforeAll(async () => {

    // loginData = await (ExcelUtils.readData('D:\\JobTrain Documents\\JobtrainData.xlsx', 'LoginData'));
    assessementFormsData = await (ExcelUtils.readData('D:\\JobtrainData.xlsx', 'SystemSettingsData'));


});
test.beforeEach(async ({ page }) => {


    await page.goto('Settings', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState('networkidle');
    sysSettings = new SystemSettingsPage(page);
    assessmentFormsPage = new AssessmentFormsPage(page);


});


test(' Assesement Forms verification ', async ({ page }) => {
    // Alternative method: You can also select the item by its name using systemSettingsLeftMenuLinkByName().
    await (await sysSettings.systemSettingsLeftMenuLinkByIndex(3));

    await page.waitForLoadState('networkidle');
    await assessmentFormsPage.verifyAssessmentFormsScreen();
    console.log('all headings are intact');
    await Helpers.takeScreenshot(page, 'Assessment Forms');

});

test('System Settings Assessment Forms page verification',async({page})=>{
   
    await (await sysSettings.systemSettingsLeftMenuLinkByIndex(3));

    await page.waitForLoadState('networkidle');
    await sysSettings.verifyUnorderedListsAndItems('AssessmentFormsPageData');
    console.log('all headings are intact');
   

});