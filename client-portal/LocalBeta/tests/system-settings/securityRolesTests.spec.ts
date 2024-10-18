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
import SecurityRolesPage from "../../pages/system_settings/SecurityRolesPage";



function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// variable to hold data, initialized as 'any' type.
type TableRow = { [key: string]: any };

let SecurityRolesPageData: TableRow[];
let securityRolesPage: SecurityRolesPage;
let sysSettings: SystemSettingsPage;
// Use the saved state to load the authenticated session
test.use({ storageState: 'state.json' });

test.beforeAll(async () => {

    // loginData = await (ExcelUtils.readData('D:\\JobTrain Documents\\JobtrainData.xlsx', 'LoginData'));
    SecurityRolesPageData = await (ExcelUtils.readData('utils/JobtrainData.xlsx', 'SystemSettingsData'));


});
test.beforeEach(async ({ page }) => {


    await page.goto('Settings', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState('networkidle');
    sysSettings = new SystemSettingsPage(page);
    securityRolesPage = new SecurityRolesPage(page);


});

test('navigate to securityroles screen',async({page})=>{
    await(await securityRolesPage.navigateToSecurityRolesLink()).click();
    await expect(page).toHaveTitle('System Setup: Security Roles')
    await expect(page).toHaveURL('http://beta.jobtrain.com/Settings/SecurityRoles/List')
});

test('verify securityroles left menu',async({page})=>{
    await(await securityRolesPage.navigateToSecurityRolesLink()).click()
    await securityRolesPage.verifySecurityRolesLeftMenu('SecurityRolesPageData')
    
});
test('verify securityroles table',async({page})=>{
    await(await securityRolesPage.navigateToSecurityRolesLink()).click();
    await securityRolesPage.verifySecurityRolesTable('HR Super');
    await securityRolesPage.verifySecurityRolesRecordsText();
    (await securityRolesPage.openSuperUsersSecurityRoles());
    await securityRolesPage.navigateToMyWorkspaceTab();
    
});

test('select all the checkboxes as checked for my workspace tab',async({page})=>{
    await(await securityRolesPage.navigateToSecurityRolesLink()).click();
    await securityRolesPage.verifySecurityRolesTable('HR Super');
    await securityRolesPage.verifySecurityRolesRecordsText();
    (await securityRolesPage.openSuperUsersSecurityRoles());
    await securityRolesPage.navigateToSpecificSecurityRolesTabByIndex(0);
    await securityRolesPage.navigateToSpecificSecurityRolesTabByName(' My Workspace');
    await securityRolesPage.selectAllCheckboxesAsTrue('My Workspace','tab-my-workspace');
    await securityRolesPage.saveOrExit('Save');
   // await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState('networkidle');
   
    
});
test('select all the checkboxes as checked for job and talent pool',async({page})=>{
    test.setTimeout(230000);
    await(await securityRolesPage.navigateToSecurityRolesLink()).click();
    await securityRolesPage.verifySecurityRolesTable('HR Super');
    await securityRolesPage.verifySecurityRolesRecordsText();
    await securityRolesPage.openSuperUsersSecurityRoles();
    await securityRolesPage.navigateToSpecificSecurityRolesTabByIndex(1);
   // await securityRolesPage.navigateToSpecificSecurityRolesTabByName(' Jobs & Talent Pools');
    await securityRolesPage.selectAllCheckboxesAsTrue('Jobs & Talent Pools', 'tab-job-and-talents-pool');
    await securityRolesPage.saveOrExit('Save');
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState('networkidle');
   
    
});

test('select all the checkboxes as checked for Search ',async({page})=>{
    test.setTimeout(230000);
    await(await securityRolesPage.navigateToSecurityRolesLink()).click();
    await securityRolesPage.verifySecurityRolesTable('HR Super');
    await securityRolesPage.verifySecurityRolesRecordsText();
    await securityRolesPage.openSuperUsersSecurityRoles();
    await securityRolesPage.navigateToSpecificSecurityRolesTabByIndex(2);
   // await securityRolesPage.navigateToSpecificSecurityRolesTabByName(' Jobs & Talent Pools');
    await securityRolesPage.selectAllCheckboxesAsTrue('Search', 'tab-search');
    await securityRolesPage.saveOrExit('Save');
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState('networkidle');
});
test('select all the checkboxes as checked for Calander',async({page})=>{
    test.setTimeout(230000);
    await(await securityRolesPage.navigateToSecurityRolesLink()).click();
    await securityRolesPage.verifySecurityRolesTable('HR Super');
    await securityRolesPage.verifySecurityRolesRecordsText();
    await securityRolesPage.openSuperUsersSecurityRoles();
    await securityRolesPage.navigateToSpecificSecurityRolesTabByIndex(3);
   // await securityRolesPage.navigateToSpecificSecurityRolesTabByName(' Jobs & Talent Pools');
    await securityRolesPage.selectAllCheckboxesAsTrue('Calander', 'tab-calendar');
    await securityRolesPage.saveOrExit('Save');
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState('networkidle');
});
test('select all the checkboxes as checked for communications',async({page})=>{
    test.setTimeout(230000);
    await(await securityRolesPage.navigateToSecurityRolesLink()).click();
    await securityRolesPage.verifySecurityRolesTable('HR Super');
    await securityRolesPage.verifySecurityRolesRecordsText();
    await securityRolesPage.openSuperUsersSecurityRoles();
    await securityRolesPage.navigateToSpecificSecurityRolesTabByIndex(4);
   // await securityRolesPage.navigateToSpecificSecurityRolesTabByName(' Jobs & Talent Pools');
   await securityRolesPage.selectAllCheckboxesAsTrue('Emails', 'tab-emails');
   await securityRolesPage.selectAllCheckboxesAsTrue('Letters', 'tab-letters');
   await securityRolesPage.selectAllCheckboxesAsTrue('Letters', 'tab-sms');
    await securityRolesPage.saveOrExit('Save');
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState('networkidle');
});
test('select all the checkboxes as checked for reports',async({page})=>{
    test.setTimeout(230000);
    await(await securityRolesPage.navigateToSecurityRolesLink()).click();
    await securityRolesPage.verifySecurityRolesTable('HR Super');
    await securityRolesPage.verifySecurityRolesRecordsText();
    await securityRolesPage.openSuperUsersSecurityRoles();
    await securityRolesPage.navigateToSpecificSecurityRolesTabByIndex(5);
   // await securityRolesPage.navigateToSpecificSecurityRolesTabByName(' Jobs & Talent Pools');
   await securityRolesPage.selectAllCheckboxesAsTrue('reports', 'tab-reports');
   
    await securityRolesPage.saveOrExit('Save');
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState('networkidle');
});
test('select all the checkboxes as checked for settings',async({page})=>{
    test.setTimeout(230000);
    await(await securityRolesPage.navigateToSecurityRolesLink()).click();
    await securityRolesPage.verifySecurityRolesTable('HR Super');
    await securityRolesPage.verifySecurityRolesRecordsText();
    await securityRolesPage.openSuperUsersSecurityRoles();
    await securityRolesPage.navigateToSpecificSecurityRolesTabByIndex(6);
   // await securityRolesPage.navigateToSpecificSecurityRolesTabByName(' Jobs & Talent Pools');
   await securityRolesPage.selectAllCheckboxesAsTrue('settings', 'tab-system-setup');
   await securityRolesPage.deselectHideSettingsIcon();
   await securityRolesPage.selectAllCheckboxesAsTrue('settings', 'tab-forms');
   await securityRolesPage.selectAllCheckboxesAsTrue('settings', 'tab-templates');
  
   await securityRolesPage.selectAllCheckboxesAsTrue('settings', 'tab-general-setup');
   await securityRolesPage.selectAllCheckboxesAsTrue('settings', 'tab-alert-setup');
   await securityRolesPage.selectAllCheckboxesAsTrue('settings', 'tab-onboarding-setup');
   
   await securityRolesPage.selectAllCheckboxesAsTrue('settings', 'tab-compliance-setup');
   await securityRolesPage.selectAllCheckboxesAsTrue('settings', 'tab-onboarding-hub');
   await securityRolesPage.selectAllCheckboxesAsTrue('settings', 'tab-green-room');
   await securityRolesPage.selectAllCheckboxesAsTrue('settings', 'tab-media-library');
   await securityRolesPage.selectAllCheckboxesAsTrue('settings', 'tab-system-customisation');
   
    await securityRolesPage.saveOrExit('Save');
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState('networkidle');
});
test('candidate details' ,async({page})=>{
    test.setTimeout(230000);
    await(await securityRolesPage.navigateToSecurityRolesLink()).click();
    await securityRolesPage.verifySecurityRolesTable('HR Super');
    await securityRolesPage.verifySecurityRolesRecordsText();
    await securityRolesPage.openSuperUsersSecurityRoles();
    await securityRolesPage.navigateToSpecificSecurityRolesTabByIndex(7);
   // await securityRolesPage.navigateToSpecificSecurityRolesTabByName(' Jobs & Talent Pools');
  
  
    await securityRolesPage.saveOrExit('Save');
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState('networkidle');
});
test('create / update jobs' ,async({page})=>{
    test.setTimeout(230000);
    await(await securityRolesPage.navigateToSecurityRolesLink()).click();
    await securityRolesPage.verifySecurityRolesTable('HR Super');
    await securityRolesPage.verifySecurityRolesRecordsText();
    await securityRolesPage.openSuperUsersSecurityRoles();
    await securityRolesPage.navigateToSpecificSecurityRolesTabByIndex(8);
   // await securityRolesPage.navigateToSpecificSecurityRolesTabByName(' Jobs & Talent Pools');
  
  
    await securityRolesPage.saveOrExit('Save');
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState('networkidle');
});
test('job application statuses' ,async({page})=>{
    test.setTimeout(230000);
    await(await securityRolesPage.navigateToSecurityRolesLink()).click();
    await securityRolesPage.verifySecurityRolesTable('HR Super');
    await securityRolesPage.verifySecurityRolesRecordsText();
    await securityRolesPage.openSuperUsersSecurityRoles();
    await securityRolesPage.navigateToSpecificSecurityRolesTabByIndex(9);
   // await securityRolesPage.navigateToSpecificSecurityRolesTabByName(' Jobs & Talent Pools');
  
  
    await securityRolesPage.saveOrExit('Save');
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState('networkidle');
});
test('job statuses' ,async({page})=>{
    test.setTimeout(230000);
    await(await securityRolesPage.navigateToSecurityRolesLink()).click();
    await securityRolesPage.verifySecurityRolesTable('HR Super');
    await securityRolesPage.verifySecurityRolesRecordsText();
    await securityRolesPage.openSuperUsersSecurityRoles();
    await securityRolesPage.navigateToSpecificSecurityRolesTabByIndex(10);
   // await securityRolesPage.navigateToSpecificSecurityRolesTabByName(' Jobs & Talent Pools');
  
  
    await securityRolesPage.saveOrExit('Save');
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState('networkidle');
});
test('add system Pipelines' ,async({page})=>{
    test.setTimeout(230000);
    await(await securityRolesPage.navigateToSecurityRolesLink()).click();
    await securityRolesPage.verifySecurityRolesTable('HR Super');
    await securityRolesPage.verifySecurityRolesRecordsText();
    await securityRolesPage.openSuperUsersSecurityRoles();
    await securityRolesPage.navigateToSpecificSecurityRolesTabByIndex(11);
   // await securityRolesPage.navigateToSpecificSecurityRolesTabByName(' Jobs & Talent Pools');
  
  
    await securityRolesPage.saveOrExit('Save');
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState('networkidle');
});
test('add location ',async({page})=>{
    test.setTimeout(230000);
    await(await securityRolesPage.navigateToSecurityRolesLink()).click();
    await securityRolesPage.verifySecurityRolesTable('HR Super');
    await securityRolesPage.verifySecurityRolesRecordsText();
    await securityRolesPage.openSuperUsersSecurityRoles();
    await securityRolesPage.navigateToSpecificSecurityRolesTabByIndex(12);
   // await securityRolesPage.navigateToSpecificSecurityRolesTabByName(' Jobs & Talent Pools');
  
  
    await securityRolesPage.saveOrExit('Save');
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState('networkidle');
});
test('add division  ',async({page})=>{
    test.setTimeout(230000);
    await(await securityRolesPage.navigateToSecurityRolesLink()).click();
    await securityRolesPage.verifySecurityRolesTable('HR Super');
    await securityRolesPage.verifySecurityRolesRecordsText();
    await securityRolesPage.openSuperUsersSecurityRoles();
    await securityRolesPage.navigateToSpecificSecurityRolesTabByIndex(13);
   // await securityRolesPage.navigateToSpecificSecurityRolesTabByName(' Jobs & Talent Pools');
  
  
    await securityRolesPage.saveOrExit('Save');
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState('networkidle');
});