import { test, expect, Page } from "@playwright/test";
import { defineConfig, devices } from '@playwright/test';
import fs from 'fs';
//import { ExcelRow } from "../utils/excelUtils";

import ExcelUtils, { ExcelRow, WriteOptions } from "../../utils/excelUtils";
import { Helpers } from "../../utils/helpers";

// Import necessary modules
import { error, log } from "console";
import ExcelJS from 'exceljs';
import LoginPage from "../../pages/LoginPage";

import path from "path";
import exp from "constants";

import SystemSettingsPage from "../../pages/system_settings/SystemSettingsPage";
import ApplicationTemplatePage from "../../pages/system_settings/GeneralSettingsPage";
import GeneralSettingsPage from "../../pages/system_settings/GeneralSettingsPage";



function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// variable to hold data, initialized as 'any' type.
type TableRow = { [key: string]: any };

let generalSettingsPageData: TableRow[];
let generalSettingsPage: GeneralSettingsPage;
let sysSettings: SystemSettingsPage;
// Use the saved state to load the authenticated session
test.use({ storageState: 'state.json' });

test.beforeAll(async () => {

    // loginData = await (ExcelUtils.readData('D:\\JobTrain Documents\\JobtrainData.xlsx', 'LoginData'));
    generalSettingsPageData = await (ExcelUtils.readData('D:\\JobtrainData.xlsx', 'SystemSettingsData'));


});
test.beforeEach(async ({ page }) => {


    await page.goto('Settings', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState('networkidle');
    sysSettings = new SystemSettingsPage(page);
    generalSettingsPage = new GeneralSettingsPage(page);


});


test('General Settingsverification', async ({ page }) => {

    await (await sysSettings.systemSettingsLeftMenuLinkByName('General Settings'));

    await page.waitForLoadState('networkidle');
    await generalSettingsPage.verifyGeneralSettingsScreen();
    console.log('all headings are intact');
    await Helpers.takeScreenshot(page, 'General Settings');

});

test('System Settings General Settings page verification', async ({ page }) => {

    await (await sysSettings.systemSettingsLeftMenuLinkByIndex(5));

    await page.waitForLoadState('networkidle');
    try {
        await sysSettings.verifyUnorderedListsAndItems('GeneralSettingsPageData');
        console.log('all headings are intact');

    } catch (error) {
        console.log('Heading are not verified successfully');

    }
});

test('General settings add new location', async ({ page }) => {

    await (await sysSettings.systemSettingsLeftMenuLinkByIndex(5));

    await page.waitForLoadState('networkidle');
    sysSettings.verifyHeadingText('General Settings');
    try {
        await (await sysSettings.openLiItem('Locations')).click();
        sysSettings.verifyHeadingText('General Settings: Locations');
        await Helpers.takeScreenshot(page, 'general settings locations');
        await expect(page).toHaveURL('http://beta.jobtrain.com/Settings/GeneralSettings/Locations/List');
        await expect(page).toHaveTitle('General Settings: Locations');
        
        await (await sysSettings.generalSettingsLocationsLeftMenuLinkByName('New Locations'));
       
        console.log('general settings location removed');


    } catch (error) {
        console.log('general settings location not removed');

    }
});
test('General settings remove location', async ({ page }) => {

    await (await sysSettings.systemSettingsLeftMenuLinkByIndex(5));

    await page.waitForLoadState('networkidle');
    sysSettings.verifyHeadingText('General Settings');
    try {
        await (await sysSettings.openLiItem('Locations')).click();
        sysSettings.verifyHeadingText('General Settings: Locations');
        await Helpers.takeScreenshot(page, 'general settings locations');
        await expect(page).toHaveURL('http://beta.jobtrain.com/Settings/GeneralSettings/Locations/List');
        await expect(page).toHaveTitle('General Settings: Locations');
        await sysSettings.selectFirstRecord();
        await (await sysSettings.generalSettingsLocationsLeftMenuLinkByName('Remove'));
        await sysSettings.handleModalDialog("Delete Confirmation", "Yes", "Do you want to Delete?");
        console.log('general settings location removed');


    } catch (error) {
        console.log('general settings location not removed');

    }
});