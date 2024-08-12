/**
 * File: PasswordResetPage.spec.ts
 * Author: Shabbir Minhas
 * Date: May 20, 2024
 * 
 * Description:
 * This file contains test cases for the Password Reset functionality of the application.
 * It includes tests to verify the Password Reset screen controls, perform the Password Reset process,
 * and validate successful Password Reset.
 * 
 * Classes:
 *   None
 * 
 * Functions:
 *   Verify Password Reest Screen Controls: Test case to verify the Password Reset screen controls.
 *   .
 *   All other Tests related to Password Reset Page are implemented in this File.
 * 
 * Usage:
 * Run the tests using a test runner or test framework such as Jest or Mocha.
 
 */
//@ts-check

import { Page, test, expect } from '@playwright/test';
import PasswordResetPage from "../pages/PasswordResetPage";
import LoginPage from '../pages/LoginPage';
// Import necessary modules
import { log } from "console";
import ExcelUtils, { ExcelRow, WriteOptions } from '../utils/excelUtils';
import { TIMEOUT } from 'dns';
import { Helpers } from '../utils/helpers';



// Configure test mode
test.describe.configure({ mode: 'parallel' });
/**
 * Pauses the execution for a specified amount of time.
 * @param {number} ms - The number of milliseconds to pause.
 * @returns {Promise<void>}
 */
/**
 * Returns a promise that resolves after a specified number of milliseconds.
 * This can be used to introduce a delay in asynchronous code.
 *
 * @param ms - The number of milliseconds to delay.
 * @returns A promise that resolves after the specified delay.
 */
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

type TableRow = { [key: string]: any };
let mydata: TableRow[];;

test.beforeAll(async () => {
  mydata = await ExcelUtils.readData('D:\\JobTrain Documents\\JobtrainData.xlsx', 'ResetPassword');
});

test('Verify Password Reset Screen Controls', async ({ browser }) => {


  const context = await browser.newContext();
  const page = await context.newPage();
  //const passwordReset = new PasswordResetPage(page);
  // Navigate to the initial page
  await page.goto('Login');


  const page2Promise = page.waitForEvent('popup');
  
  page.getByRole('link', { name: 'Forgotten your Password?' }).click()
  // passwordReset.openPasswordResetScreen();
  const page2 = await page2Promise;
  await page2.waitForLoadState('load');
  // Instantiate the PasswordResetPage with the new page
  const passwordResetPage = new PasswordResetPage(page2);

  //await newPage.waitForLoadState('load');

  // Now you can interact with the new page
  console.log('Switched to new page:', await page2.url());

  // Now you can interact with the new page
  //await expect(page2).toHaveURL('https://test.jobtrain.co.uk/ybscareers/client/ForgotPassword');
  // Wait for the new page to be fully loaded
  await delay(5000);
  await page2.screenshot({ path: 'Screenshots/PasswordReset.png', fullPage: true });

});

test('Password Reset Page verification', async ({ page }) => {

  mydata = await ExcelUtils.readData('D:\\JobTrain Documents\\JobtrainData.xlsx', 'ResetPassword');
  const resetPasswordPageObj = new PasswordResetPage(page);

  await page.goto(mydata[0].url);
  (await resetPasswordPageObj.getJobTrainLogo()).isVisible();
  (await resetPasswordPageObj.passwordResetHeading()).isVisible();
  (await page.waitForSelector('#inputEmail', { state: 'visible' }));
  const placeholder = await page.getAttribute('#inputEmail', 'placeholder');
  console.assert(placeholder === 'Enter email address', 'Placeholder text does not match');
  const isRequired = await page.getAttribute('#inputEmail', 'required') !== null;
  console.assert(isRequired, 'The input element is not required');
  const type = await page.getAttribute('#inputEmail', 'type');
  console.assert(type === 'text', 'Input type is not text');
  //(await resetPasswordPageObj.getEmailInput()).isEditable();
  (await resetPasswordPageObj.clickResetPasswordButton()).isEnabled();
  (await resetPasswordPageObj.resetPasswordInstructionsText()).isVisible();
  (await resetPasswordPageObj.verifyCopyrightText()).isVisible();

  //await delay(5000);
  TIMEOUT: 5000;

  await Helpers.takeScreenshot(page, 'PasswordReset2.png');


});

test('Password Reset Process Testing', async ({ page }) => {

  mydata = await ExcelUtils.readData('D:\\JobTrain Documents\\JobtrainData.xlsx', 'ResetPassword');
  const resetPasswordPageObj = new PasswordResetPage(page);

  await page.goto(mydata[0].url);
  const email = mydata[0]['email'];
  await resetPasswordPageObj.fillEmail(email);
  (await resetPasswordPageObj.clickResetPasswordButton()).click();



  await expect(page.locator('#MainContent_diverror')).toContainText('We have emailed you the link to update your password. Please check your email');
  //await expect(emailSentMessageText).toContainEqual('We have emailed you the link to update your password. Please check your email');


});