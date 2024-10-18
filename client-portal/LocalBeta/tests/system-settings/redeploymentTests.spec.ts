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
import BrandBuilderPage from "../../pages/system_settings/RedeploymentPage";
import RedeploymentPage from "../../pages/system_settings/RedeploymentPage";



function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// variable to hold data, initialized as 'any' type.
type TableRow = { [key: string]: any };

let RedeploymentPageData: TableRow[];
let redeploymentObj: RedeploymentPage;
let sysSettings: SystemSettingsPage;
// Use the saved state to load the authenticated session
test.use({ storageState: 'state.json' });

test.beforeAll(async () => {

    // loginData = await (ExcelUtils.readData('D:\\JobTrain Documents\\JobtrainData.xlsx', 'LoginData'));
let RedeploymentPageData: TableRow[];
RedeploymentPageData= await (ExcelUtils.readData('D:\\JobtrainData.xlsx', 'SystemSettingsData'));


});
test.beforeEach(async ({ page }) => {


    await page.goto('Settings', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState('networkidle');
    sysSettings = new SystemSettingsPage(page);
    redeploymentObj = new BrandBuilderPage(page);


});


test('Redeployment settings verification', async ({ page }) => {

    await (await sysSettings.systemSettingsLeftMenuLinkByName('Redeployment'));

    await page.waitForLoadState('networkidle');
    await redeploymentObj.verifyRedeploymentScreen();
    console.log('all headings are intact');
    await Helpers.takeScreenshot(page, 'Redeployment Settings');

});

test('System Settings redeployment page verification',async({page})=>{
   
    await (await sysSettings.systemSettingsLeftMenuLinkByIndex(11));

    await page.waitForLoadState('networkidle');
    await sysSettings.verifyUnorderedListsAndItems('RedeploymentSettingsPageData');
    console.log('all headings are intact');
   

});