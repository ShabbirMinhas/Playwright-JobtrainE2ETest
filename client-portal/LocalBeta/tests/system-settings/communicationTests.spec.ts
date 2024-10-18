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
import CommunicationPage from "../../pages/system_settings/CommunicationPage";
import { TIMEOUT } from "dns";

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// variable to hold data, initialized as 'any' type.
type TableRow = { [key: string]: any };

let communicationData: TableRow[];
let commPage: CommunicationPage;
let sysSettings: SystemSettingsPage;
// Use the saved state to load the authenticated session
test.use({ storageState: 'state.json' });

test.beforeAll(async () => {

    // loginData = await (ExcelUtils.readData('D:\\JobTrain Documents\\JobtrainData.xlsx', 'LoginData'));
    communicationData = await (ExcelUtils.readData('D:\\JobtrainData.xlsx', 'SystemSettingsData'));


});
test.beforeEach(async ({ page }) => {


    await page.goto('Settings', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState('networkidle');
    sysSettings = new SystemSettingsPage(page);
    commPage = new CommunicationPage(page);


});


test('communication page verification', async ({ page }) => {

    await (await sysSettings.systemSettingsLeftMenuLinkByIndex(1));

    await page.waitForLoadState('networkidle');
    await commPage.verifyCommunicationScreen();
    console.log('all headings are intact');
    await Helpers.takeScreenshot(page, 'settings communication page');

});

test('System Settings communication page verification', async ({ page }) => {

    await (await sysSettings.systemSettingsLeftMenuLinkByIndex(1));

    await page.waitForLoadState('networkidle');
    await sysSettings.verifyUnorderedListsAndItems('CommunicationPageData');
    console.log('all headings are intact');


});
test('communication: Email Inbox verification', async ({ page }) => {

    await (await sysSettings.systemSettingsLeftMenuLinkByIndex(1));

    await page.waitForLoadState('networkidle');
    await commPage.verifyUnorderedListsAndItems('CommunicationPageData');
    console.log('all headings are intact');


});

test('verify email template screen ', async ({ page }) => {

    await (await sysSettings.systemSettingsLeftMenuLinkByIndex(1));

    await page.waitForLoadState('networkidle');
    await sysSettings.verifyHeadingText('Communication');
    await sysSettings.verifyHeadingText('Email Options');
    
    await (await sysSettings.openLiItem('Email Templates')).click();
    await expect(page).toHaveURL('http://beta.jobtrain.com/Communications/EmailOptions/List');
    await commPage.openAndVerifyEmailTemplatesScreen(7);
    await expect(commPage.emailSearchInput()).toBeTruthy();
   // await Helpers.takeScreenshot(page, 'email template');
    
});
test('create email template ', async ({ page }) => {

    await (await sysSettings.systemSettingsLeftMenuLinkByIndex(1));

    await page.waitForLoadState('networkidle');
    await (await sysSettings.openLiItem('Email Templates')).click();
    await sysSettings.verifyHeadingText('Communication: Email Templates');
    await expect(page).toHaveTitle('Communication: Email Templates');
    await sysSettings.emailTemplateLeftMenuLinkByName('Create Email Template');
    await sysSettings.verifyHeadingText('Communication: Emails');
    await commPage.createCommunicationEmail();
    await commPage.emailBodyText('');
    await page.getByRole('button',{name:'Save'}).click();
    TIMEOUT:5000;
   
    
});


