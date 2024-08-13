//@ts-check
//const { test, expect } = require('@playwright/test');
import { test, expect } from "@playwright/test";

test('has title', async ({ page }) => {
 
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

test('Jobtrain Login Test', async({page})=>{

 // const browser = await chromium.launch();
  //const page = await browser.newPage();
  await page.goto('https://test.jobtrain.co.uk/ybscareers/client/Login');
  
  //await expect(page).toHaveTitle('/Jobtrain/');

  
  await page.locator('#inputEmail').fill('ybs');
  
  await page.getByPlaceholder('Username').fill('ybs');
  await page.getByPlaceholder('Password').fill('21ClientT@');

  await page.getByRole('button',{name:'Login'}).click();
  await page.close();
  
});

test ('jobtrain Invalid Login Test', async ({page})=> {

    await page.goto('https://test.jobtrain.co.uk/ybscareers/client/Login');
    await  expect(page).toHaveTitle('Jobtrain');

    await page.getByTestId('inputEmail').fill('ybs'); 
    await page.getByTestId('inputPassword').fill('invalid');
    
    await page.getByRole('button',{name:'Login'}).click();

    // verify the message of invalid login username or password

    await page.getByText('Invalid Username or Password');


});

test ('Verify Login Screen', async ({page})=> {

  await page.goto('https://test.jobtrain.co.uk/ybscareers/client/Login');
  await  expect(page).toHaveTitle('Jobtrain');

  await page.getByTestId('inputEmail').isVisible(); 
  await page.getByTestId('inputPassword').isVisible();;
  
  await page.getByRole('button',{name:'Login'}).isVisible;

  // Verify the forget password link

  await expect(page.getByRole('link')).toHaveText('Forgotten your password?');

  await page.getByText('© 1998 - 2024 Jobtrain Ltd. All rights reserved.');

  await page.close();


});