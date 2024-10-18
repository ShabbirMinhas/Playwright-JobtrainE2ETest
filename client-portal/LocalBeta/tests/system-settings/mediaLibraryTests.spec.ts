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
import SystemAlertsSetupPage from "../../pages/system_settings/MediaLibraryPage";
import MediaLibraryPage from "../../pages/system_settings/MediaLibraryPage";
import { TIMEOUT } from "dns";



function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// variable to hold data, initialized as 'any' type.
type TableRow = { [key: string]: any };

let mediaLibraryPageData: TableRow[];
let mediaLibraryPage: MediaLibraryPage;
let sysSettings: SystemSettingsPage;
// Use the saved state to load the authenticated session
test.use({ storageState: 'state.json' });

test.beforeAll(async () => {

    // loginData = await (ExcelUtils.readData('D:\\JobTrain Documents\\JobtrainData.xlsx', 'LoginData'));
    mediaLibraryPageData = await (ExcelUtils.readData('utils/JobtrainData.xlsx', 'SystemSettingsData'));


});
test.beforeEach(async ({ page }) => {

    await page.goto('Settings', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState('networkidle');
    sysSettings = new SystemSettingsPage(page);
    mediaLibraryPage = new MediaLibraryPage(page);

});


test('Media Library settings verification', async ({ page }) => {

    await (await sysSettings.systemSettingsLeftMenuLinkByIndex(9));

    await page.waitForLoadState('networkidle');
    await mediaLibraryPage.verifyMediaLibraryScreen();
    console.log('all headings are intact');
    await Helpers.takeScreenshot(page, 'System Alerts Setup');

});
test('verify media library settings main page', async ({ page }) => {
    await (await sysSettings.systemSettingsLeftMenuLinkByIndex(9));
    await mediaLibraryPage.openAndVerifyMediaLibraryScreen(3);

});
test('System Settings Media Library page verification', async ({ page }) => {

    await (await sysSettings.systemSettingsLeftMenuLinkByIndex(9));

    await page.waitForLoadState('networkidle');
    await sysSettings.verifyUnorderedListsAndItems('MediaLibraryPageData');
    console.log('all headings are intact');


});


test('navigate to Media Library: Images', async ({ page }) => {
    //const sysSettings = new SystemSettingsPage(page);
    await (await sysSettings.systemSettingsLeftMenuLinkByIndex(9));
    await (await sysSettings.openLiItem('Image Library')).click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('http://beta.jobtrain.com/Settings/MediaLibrary/ListImage?type=IMAGES');
    await expect(page).toHaveTitle('Media Library: Images');
    await Helpers.takeScreenshot(page, 'Media Library: images');


});

test('navigate to Media Library: Videos', async ({ page }) => {
    //const sysSettings = new SystemSettingsPage(page);
    await (await sysSettings.systemSettingsLeftMenuLinkByIndex(9));
    await (await sysSettings.openLiItem('Video Library')).click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('http://beta.jobtrain.com/Settings/MediaLibrary/ListVideo?type=VIDEO');
    await expect(page).toHaveTitle('Media Library: Videos');
    await Helpers.takeScreenshot(page, 'media library videos');
});
test('navigate to Media Library: Text Contents ', async ({ page }) => {
    //const sysSettings = new SystemSettingsPage(page);
    await (await sysSettings.systemSettingsLeftMenuLinkByIndex(9));
    await (await sysSettings.openLiItem('Text Library')).click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('http://beta.jobtrain.com/Settings/MediaLibrary/ListText?type=TEXT');
    await expect(page).toHaveTitle('Media Library: Text Contents');
    await Helpers.takeScreenshot(page, 'media library text contents');
});

test(' media library upload image', async ({ page }) => {
    //const sysSettings = new SystemSettingsPage(page);
    await (await sysSettings.systemSettingsLeftMenuLinkByIndex(9));
    await (await sysSettings.openLiItem('Image Library')).click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('http://beta.jobtrain.com/Settings/MediaLibrary/ListImage?type=IMAGES');
    await expect(page).toHaveTitle('Media Library: Images');
    await Helpers.takeScreenshot(page, 'media library images');
    await sysSettings.verifyHeadingText('Media Library: Images');
    await sysSettings.mediaLibraryLeftMenuLinkByName('Upload New Image');
    await mediaLibraryPage.uploadImageDetails('text');
    await sysSettings.clickButtonByText('Save');
    await mediaLibraryPage.uploadImage('text');
    TIMEOUT: 5000;
    await sysSettings.clickButtonByText('Save');
    TIMEOUT: 4000;
    await sysSettings.clickButtonByText('Save');
    await sysSettings.clickButtonByText('Exit');


});

test(' media library search image and remove', async ({ page }) => {
    //const sysSettings = new SystemSettingsPage(page);
    await (await sysSettings.systemSettingsLeftMenuLinkByIndex(9));
    await (await sysSettings.openLiItem('Image Library')).click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('http://beta.jobtrain.com/Settings/MediaLibrary/ListImage?type=IMAGES');
    await expect(page).toHaveTitle('Media Library: Images');
    await Helpers.takeScreenshot(page, 'media library images');
    await ((await sysSettings.mediaLibraySearchInput()).fill('automation'));
    await (await sysSettings.mediaLibraySearchButton());
    await mediaLibraryPage.selectFirstRecord();
    await sysSettings.mediaLibraryLeftMenuLinkByName('Remove');
    await mediaLibraryPage.handleModalDialog("Delete Confirmation", "Yes", "Do you want to Delete?");

});
test(' media library upload video', async ({ page }) => {
    //const sysSettings = new SystemSettingsPage(page);
    await (await sysSettings.systemSettingsLeftMenuLinkByIndex(9));
    await (await sysSettings.openLiItem('Video Library')).click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('http://beta.jobtrain.com/Settings/MediaLibrary/ListVideo?type=VIDEO');
    await expect(page).toHaveTitle('Media Library: Videos');
    await Helpers.takeScreenshot(page, 'media library videos');
    await sysSettings.mediaLibraryLeftMenuLinkByName('Upload New Video');
    await mediaLibraryPage.uploadVideo('text');
    await sysSettings.clickButtonByText('Save');
    TIMEOUT:50000

});
test('media video library search video record and remove ', async ({ page }) => {
    //const sysSettings = new SystemSettingsPage(page);
    await (await sysSettings.systemSettingsLeftMenuLinkByIndex(9));
    await (await sysSettings.openLiItem('Video Library')).click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('http://beta.jobtrain.com/Settings/MediaLibrary/ListVideo?type=VIDEO');
    await expect(page).toHaveTitle('Media Library: Videos');
    await Helpers.takeScreenshot(page, 'media library videos');
    await ((await sysSettings.mediaLibraySearchInput()).fill('automation'));
    await (await sysSettings.mediaLibraySearchButton());
    await mediaLibraryPage.selectFirstRecord();
    await sysSettings.mediaLibraryLeftMenuLinkByName('Remove');
    await mediaLibraryPage.handleModalDialog("Delete Confirmation", "Yes", "Do you want to Delete?");

});



test('media library upload text ', async ({ page }) => {
    //const sysSettings = new SystemSettingsPage(page);
    await (await sysSettings.systemSettingsLeftMenuLinkByIndex(9));
    await (await sysSettings.openLiItem('Text Library')).click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('http://beta.jobtrain.com/Settings/MediaLibrary/ListText?type=TEXT');
    await expect(page).toHaveTitle('Media Library: Text Contents');
    await sysSettings.mediaLibraryLeftMenuLinkByName('Upload Text');
    //await sysSettings.mediaLibraryLeftMenuLinkByIndex(2);
    await sysSettings.verifyHeadingText('Upload new text');
    await mediaLibraryPage.uploadNewText('text');
    await sysSettings.clickButtonByText('Save')
});
test('media library remove text ', async ({ page }) => {
    //const sysSettings = new SystemSettingsPage(page);
    await (await sysSettings.systemSettingsLeftMenuLinkByIndex(9));
    await (await sysSettings.openLiItem('Text Library')).click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('http://beta.jobtrain.com/Settings/MediaLibrary/ListText?type=TEXT');
    await expect(page).toHaveTitle('Media Library: Text Contents');
    await ((await sysSettings.mediaLibraySearchInput()).fill('automation'));
    await (await sysSettings.mediaLibraySearchButton());
    await mediaLibraryPage.selectFirstRecord();
    await sysSettings.mediaLibraryLeftMenuLinkByName('Remove');
    await mediaLibraryPage.handleModalDialog("Delete Confirmation", "Yes", "Do you want to Delete?");
});


