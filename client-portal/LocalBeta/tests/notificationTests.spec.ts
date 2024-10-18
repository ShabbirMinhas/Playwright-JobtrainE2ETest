
import { test, expect, Page } from "@playwright/test";
import { defineConfig, devices } from '@playwright/test';
import fs from 'fs';
//import { ExcelRow } from "../utils/excelUtils";
import ExcelUtils, { ExcelRow, WriteOptions } from "../utils/excelUtils";
import { Helpers } from "../utils/helpers";
import NotificationPage from "../pages/NotificationPage";

// Import necessary modules
import { log } from "console";
import ExcelJS from 'exceljs';
import LoginPage from "../pages/LoginPage";

import path from "path";
import exp from "constants";
import SearchPage from "../pages/SearchPage";


function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// variable to hold data, initialized as 'any' type.
type TableRow = { [key: string]: any };

let systemSettingsData: TableRow[];

// Use the saved state to load the authenticated session
test.use({ storageState: 'state.json' });

test.beforeAll(async () => {

    // loginData = await (ExcelUtils.readData('D:\\JobTrain Documents\\JobtrainData.xlsx', 'LoginData'));
    systemSettingsData = await (ExcelUtils.readData('D:\\JobTrain Documents\\JobtrainData.xlsx', 'SystemSettingsData'));

});
test.beforeEach(async ({ page }) => {


    await page.goto('Home', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState('networkidle');

});

test('verify the notification count', async ({ page }) => {
    const notification = new NotificationPage(page);
    const totalNotifications = await notification.totalNotificationCount();
    const notificationValues = await page.evaluate(() => {
        return localStorage.getItem('jt7_storage__jobtrainlocalNotificationCount');
    });
    // Check if storageValue is not null and parse it
    if (notificationValues) {
        try {
            const parsedValue = JSON.parse(notificationValues);
            // Calculate the total sum of all values in the object
            const totalSum = (Object.values(parsedValue) as number[]).reduce((accumulator, value) => accumulator + value, 0);
            await expect(totalSum).toBe(totalNotifications);
            await console.log(totalNotifications);
            await console.log(totalSum);

        } catch (e) {
            await console.error('Error parsing JSON: or notification count mismatch', e);
            // Explicitly fail the test
            expect(e).toBeNull(); // This will always fail and mark the test as failed
        }
    } else {
        await console.log('No data found for the specified key.');
    }



});

test(' notification tabs verification', async ({ page }) => {
    const notification = new NotificationPage(page);
    var totalTabs=0;
    const notificationValues = await page.evaluate(() => {
        return localStorage.getItem('jt7_storage__jobtrainlocalNotificationCount');
    });
    // Check if storageValue is not null and parse it
    if (notificationValues) {

        const parsedValue = JSON.parse(notificationValues);
        // Extract the value of obTotal
        totalTabs = parsedValue.obTotal;
    }
    await (await notification.navigateToNotificationLink()).click();
    const ulElements = (await notification.notificationTabsVerification());
    await expect(totalTabs).toBe(ulElements);
    await page.waitForLoadState('networkidle');
    await Helpers.takeScreenshot(page, 'notification tabs ');

});
test(' navigation to notification link', async ({ page }) => {
    const notification = new NotificationPage(page);
    await page.waitForLoadState('networkidle');
    await (await notification.navigateToNotificationLink()).click();
    await page.waitForLoadState('networkidle');

    await Helpers.takeScreenshot(page, 'notification page home ');

});
test(' notification tabs data verification', async ({ page }) => {
    const notification = new NotificationPage(page);
    var totalTabs=0;
    const notificationValues = await page.evaluate(() => {
        return localStorage.getItem('jt7_storage__jobtrainlocalNotificationCount');
    });
    // Check if storageValue is not null and parse it
    if (notificationValues) {

        const parsedValue = JSON.parse(notificationValues);
        // Extract the value of obTotal
        totalTabs = parsedValue.obTotal;
    }
    await (await notification.navigateToNotificationLink()).click();
    const ulElements = (await notification.notificationTabsVerification());
    await expect(totalTabs).toBe(ulElements);
    await page.waitForLoadState('networkidle');
    

});

