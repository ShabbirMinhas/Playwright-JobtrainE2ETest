import { test, expect, Page, selectors } from "@playwright/test";
import ExcelUtils, { ExcelRow, WriteOptions } from "../../utils/excelUtils";
import CalenderEditAndUpdatePage from "../../pages/calender-page/CalenderEditAndUpdatePage";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// variable to hold data, initialized as 'any' type.
type TableRow = { [key: string]: any };

let assessementFormsData: TableRow[];
let calendarPage: CalenderEditAndUpdatePage;
// Use the saved state to load the authenticated session
test.use({ storageState: "state.json" });
test.beforeAll(async () => {
  // loginData = await (ExcelUtils.readData('D:\\JobTrain Documents\\JobtrainData.xlsx', 'LoginData'));
  assessementFormsData = await ExcelUtils.readData(
    "E:\\JobtrainData.xlsx",
    "SystemSettingsData"
  );
});
test.beforeEach(async ({ page }) => {
  await page.goto("Calendar/ListEvent", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("networkidle");
  calendarPage = new CalenderEditAndUpdatePage(page);
});

test("Edit and Update a random calendar event", async ({ page }) => {
  const selectors = await calendarPage.getSelectors();
  // Select a random row and get original data
  const { randomIndex, originalData } =
    await calendarPage.selectRandomRowAndGetData();
  // Edit the selected event
  await calendarPage.editEvent(selectors, randomIndex, originalData);
  // Verify changes in the table
  await calendarPage.verifyChanges(randomIndex, originalData);
});

// test("Edit a random calendar event", async ({ page }) => {
//   const selectors = await calendarPage.getSelectors();
//   const rows = await page.$$(".table_row");
//   // Select a random row (excluding header)
//   //Math.floor(Math.random() * (rows.length - 1)) + 1;
//   const randomIndex = 5;
//   const randomRow = rows[randomIndex];
//   // Save original data
//   let originalSubject = await page
//     .getByTestId(`div-tbl-row-data-cell-${randomIndex}-Subject`)
//     .textContent();
//   if (originalSubject) {
//     originalSubject = await calendarPage.trimTheWhiteSpace(originalSubject);
//   }
//   let originalStartDate = await page
//     .getByTestId(`div-tbl-row-data-cell-${randomIndex}-StartDate`)
//     .textContent();
//   if (originalStartDate) {
//     originalStartDate = await calendarPage.trimTheWhiteSpace(originalStartDate);
//   }

//   let originalSelfService = await page
//     .getByTestId(`div-tbl-row-data-cell-${randomIndex}-CandidateAction`)
//     .textContent();
//   if (originalSelfService) {
//     originalSelfService = await calendarPage.trimTheWhiteSpace(
//       originalSelfService
//     );
//   }

//   let originalLocation = await page
//     .getByTestId(`div-tbl-row-data-cell-${randomIndex}-LOCATIONNAME`)
//     .textContent();
//   if (originalLocation) {
//     originalLocation = await calendarPage.trimTheWhiteSpace(originalLocation);
//   }
//   // Click on the random row
//   await randomRow.click();
//   await page.waitForLoadState("networkidle");
//   // Wait for the edit form to appear
//   await page.getByTestId(selectors.event_name).waitFor({ state: "visible" });
//   // Verify that the form is populated with the correct data
//   const updatedvalue = await page
//     .getByTestId(selectors.event_name)
//     .inputValue();
//   await page.waitForLoadState("networkidle");
//   expect(updatedvalue.trim()).toBe(originalSubject);
//   // Make changes
//   const newEventName = "automation Updated Event Name";
//   await page.getByTestId(selectors.event_name).fill(newEventName);
//   // Toggle candidate self-service
//   await page.getByTestId(selectors.candidate_self_service).click();
//   // Save changes
//   await page.getByTestId(selectors.saveAndContinueButton).click();
//   await page.waitForLoadState("networkidle");
//   await page.locator("#nav-link-2").click();
//   await page.locator("#edit").nth(0).click();
//   await page
//     .getByTestId("select-interview-location")
//     .getByTestId("txt-value-")
//     .click();
//   const child = await calendarPage.selectRandomChild(
//     await page.getByTestId(selectors.ulContainer),
//     "li"
//   );
//   await page.waitForLoadState("networkidle");
//   child.click();
//   await page.waitForLoadState("networkidle");
//   const startDate = "19/9/2024";
//   await page.getByTestId("btn-start-date").getByTestId("txt-").fill(startDate);
//   const interviewLocation = await page
//     .getByTestId("select-interview-location")
//     .getByTestId("txt-value-")
//     .inputValue();
//   await page.waitForLoadState("networkidle");
//   await page.getByTestId(selectors.saveButton).click();
//   await page.waitForLoadState("networkidle");
//   await page.getByTestId(selectors.saveAndContinueButton).click();
//   await page.getByRole("button", { name: "Exit" }).click();
//   // Wait for the table to update
//   await page.waitForTimeout(1000); // Adjust as needed
//   // Verify changes in the table
//   let updatedSubject = await page
//     .getByTestId(`div-tbl-row-data-cell-${randomIndex}-Subject`)
//     .textContent();
//   if (updatedSubject) {
//     updatedSubject = await calendarPage.trimTheWhiteSpace(updatedSubject);
//   }
//   expect(updatedSubject).toBe(newEventName);
// });

// test('Verify "Exit" button functionality', async () => {
//   // Click on any row to open edit form
//   await page.click("table tr:nth-child(2)");

//   // Wait for the edit form to appear
//   await page.waitForSelector(
//     `[data-test-id="${calendarPage.selectors.event_name}"]`
//   );

//   // Click on Exit button
//   await page.click(`[data-test-id="${calendarPage.selectors.exit_button}"]`);

//   // Verify that we're back to the table view
//   await expect(
//     page.locator(`[data-test-id="${calendarPage.selectors.table_header}"]`)
//   ).toBeVisible();
// });
