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
import BrandBuilderPage from "../../pages/system_settings/BrandBuilderPage";



function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// variable to hold data, initialized as 'any' type.
type TableRow = { [key: string]: any };

let brandBuilderPageData: TableRow[];
let brandBuilder: BrandBuilderPage;
let sysSettings: SystemSettingsPage;
// Use the saved state to load the authenticated session
test.use({ storageState: 'state.json' });

test.beforeAll(async () => {

    // loginData = await (ExcelUtils.readData('D:\\JobTrain Documents\\JobtrainData.xlsx', 'LoginData'));
    brandBuilderPageData = await (ExcelUtils.readData('D:\\JobtrainData.xlsx', 'SystemSettingsData'));


});
test.beforeEach(async ({ page }) => {


    await page.goto('Settings', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState('networkidle');
    sysSettings = new SystemSettingsPage(page);
    brandBuilder = new BrandBuilderPage(page);


});


test('Brand Builder settings verification', async ({ page }) => {
    // Alternative method: You can also select the item by its name using systemSettingsLeftMenuLinkByName().
    await (await sysSettings.systemSettingsLeftMenuLinkByIndex(10));

    await page.waitForLoadState('networkidle');
    await brandBuilder.verifyBrandBuilderScreen();
    console.log('all headings are intact');
    await Helpers.takeScreenshot(page, 'Brand Builder Settings');

});

test('System Settings system alert setup page verification',async({page})=>{
   
    await (await sysSettings.systemSettingsLeftMenuLinkByIndex(11));

    await page.waitForLoadState('networkidle');
    await sysSettings.verifyUnorderedListsAndItems('BrandBuilderPageData');
    console.log('all headings are intact');
   

});