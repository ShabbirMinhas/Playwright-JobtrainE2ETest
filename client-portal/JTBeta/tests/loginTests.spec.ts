/**
 * File: loginTest.spec.ts
 * Author: Shabbir Minhas
 * Date: May 1, 2024
 * 
 * Description:
 * This file contains test cases for the login functionality of the application.
 * It includes tests to verify the login screen controls, perform the login process,
 * and validate successful login.
 * 
 * Classes:
 *   None
 * 
 * Functions:
 *   Verify Login Screen Controls: Test case to verify the login screen controls.
 *   Job Train Login Test :Test case to perform the login process.
 *   All other Tests related to Login Page are implemented in this File.
 * Usage:
 * Run the tests using a test runner or test framework such as Jest or Mocha.
 
 */

import { test, defineConfig, expect, Page } from "@playwright/test";
import LoginPage from "../pages/LoginPage";
import { Helpers } from "../utils/helpers";
import fs from 'fs';

//import { ExcelRow } from "../utils/excelUtils";
import ExcelUtils, { ExcelRow, WriteOptions } from "../utils/excelUtils";

// Import necessary modules
import { log } from "console";
import ExcelJS from 'exceljs';
import { TIMEOUT } from "dns";
import exp from "constants";

//const (test,expect)= require('playwright')
function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// Define TableRow type
type TableRow = { [key: string]: any };
let loginData: TableRow[];

test.beforeEach(async ({ page }) => {
    loginData = await ExcelUtils.readData('D:\\JobTrain Documents\\JobtrainData.xlsx', 'LoginData');
    // await page.context().clearCookies();
    // const cookies = await page.context().cookies();
    await page.goto('', { waitUntil: 'domcontentloaded', timeout: 60000 });
    // Add detailed logging or assertions
   // page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    //Initialize LoginPage object
    const loginPage = new LoginPage(page);
    await loginPage.loginAndSaveState(loginData[0].Username, loginData[0]['Password']);
});

// Configure test mode
test.describe.configure({ mode: 'parallel' });
// Define the type for the data object
interface LoginData {
    username: string;
    password: string;
}
test('Login saving the state', async ({ page }) => {


    console.log('user logged in saving the state of the application')

});

// Test case to verify login screen elements are displayed correctly
test('Verify Login Screen Controls', async ({ page }) => {

    const login = new LoginPage(page);// Initialize LoginPage object
    await login.navigateToJobtrain('Login');  // Navigate to the login page
    const isLoginScreenCorrect = await login.loginScreenVerification();  // Verify login screen elements
    // Assertion
    await expect(isLoginScreenCorrect).toBeTruthy();
    await login.verifyForgetPasswordLink(); // Verify forget password link
    await login.tradeMarkTextVerification(); // Verify trademark text

});


// Test case to verify user can login to job train portal providing correct credentials
test('Job Train Login Test for user', async ({ page }) => {


    const login = new LoginPage(page); // Initialize LoginPage object
    await login.navigateToJobtrain('Login');// Navigate to the login page
    await login.enterUserName(loginData[0].Username); // Enter username
    await login.enterPassword(loginData[0].Password);// Enter password
    await (await login.clickOnLoginButton());   // Click on login button
    await page.waitForLoadState('networkidle');   // Wait for the page to load completely
    await Helpers.takeScreenshot(page, 'Login');//Take the screenshots of Login 
    await page.screenshot({ path: 'Login.png', fullPage: true });

});



test('Job Train Login Test example', async ({ page }) => {
    const login = new LoginPage(page);// Initialize LoginPage object
    await login.navigateToJobtrain('Login');  // Navigate to the login page
    await login.enterUserName(loginData[9].Username);  // Enter username
    await login.enterPassword(loginData[9]['Password']); // Enter password
    await login.clickOnLoginButton(); // Click on login button
    await delay(5000);
    await Helpers.takeScreenshot(page, 'Login');//Take the screenshots of Login 
    //await page.screenshot({ path: 'Screenshots/Login.png', fullPage: true }

});

test('failed login with incorrect password ', async ({ page }) => {
    const login = new LoginPage(page);
    // Navigate to the login page
    await login.navigateToJobtrain('Login');
    // Enter username
    await login.enterUserName(loginData[9]['Username']);
    // Enter password
    await login.enterPassword(loginData[9].Password);
    // Click on login button
    await login.clickOnLoginButton();
    await page.waitForLoadState("domcontentloaded");
    try {
        const invalidUserAndPassword = await (await login.invalidUserOrPasswordText()).innerText();
        if (invalidUserAndPassword == 'Invalid Username or Password') {
            console.log('invalid text message appears to the user');

        }
    } catch (error) {
        console.log('invalid text not matched:', error);

    }
    //Take the screenshots of Login 
    await Helpers.takeScreenshot(page, 'Login');


});

test.skip('Job Train Write Data to Excel ', async ({ page }) => {

    // Initialize LoginPage object
    const usrname: string = 'ybs';
    const pass: string = '21ClientT@';

    const data: ExcelRow[] = [

        { id: 7, 'Username': usrname, 'Password': pass, },
        { 'Username': usrname, pass: 'def', name: 'Alice', age: 40 },
        { id: 2, name: 'Mnhas', age: 60 },

        // More rows..
    ]
    // Writing only specific columns with custom values
    await ExcelUtils.writeData('D:\\JobTrain Documents\\JobtrainData.xlsx', 'LoginData', data, {
        columns: ['Username', 'Password', 'name', 'age', 'NA'], // Specify columns to write
        values: [// Specify custom values for the specified columns
            { id: 5, 'Username': usrname, 'Password': pass, },
            { 'Username': usrname, 'Password': pass, name: 'Alice', age: 50 },
            { id: 2, name: 'Minhas', age: 45 },

        ]
    })

});

test.skip('Job Train Write Data to Excel with columsn only ', async ({ page }) => {

    // Initialize LoginPage object
    const usrname: string = 'ybs1';
    const pass: string = 'ClienT@1';
    // Writing only specific columns with custom values
    await ExcelUtils.writeDataWithColumns('D:\\JobTrain Documents\\JobtrainData.xlsx', 'Sheet1', [], {
        columns: ['id', 'url'], // Specify columns to write
        values: [// Specify custom values for the specified columns

            { id: 3, url: 'https://test.jobtrain.co.uk/ybscareers/client/Login' },
            { id: 4, url: 'https://test.jobtrain.co.uk/ybscareers/client/Login' },
            { id: 6, url: 'https://test.jobtrain.co.uk/ybscareers/client/Login' },
            { id: 7, url: 'https://test.jobtrain.co.uk/ybscareers/client/Login' },

        ]
    }).then(() => {
        console.log('Data written successfully');
    }).catch((error) => {
        console.error('Error writing data:', error);

    })
});
test('logout test ', async ({ page }) => {
    const login = new LoginPage(page);
    await (await login.LoggedInUserLink()).click();
    await (await login.clickOnLogOutButton()).click();
    console.log('user logged out successfully')

});













