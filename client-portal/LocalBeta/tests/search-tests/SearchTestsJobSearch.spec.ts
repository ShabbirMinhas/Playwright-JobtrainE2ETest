import { test, expect, Page } from "@playwright/test";
import { Helpers } from "../../utils/helpers";

// Import necessary modules
import { log } from "console";
import ExcelJS from "exceljs";
import LoginPage from "../../pages/LoginPage";

import path from "path";
import exp from "constants";
import ExcelUtils from "../../utils/excelUtils";
import SearchPageJobSearch from "../../pages/search-pages/SearchPageJobSearch";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// variable to hold data, initialized as 'any' type.
type TableRow = { [key: string]: any };

let systemSettingsData: TableRow[];

// Use the saved state to load the authenticated session
test.use({ storageState: "state.json" });

test.beforeAll(async () => {
  // loginData = await (ExcelUtils.readData('D:\\JobTrain Documents\\JobtrainData.xlsx', 'LoginData'));
  systemSettingsData = await ExcelUtils.readData(
    "utils/JobtrainData.xlsx",
    "SystemSettingsData"
  );
});
test.beforeEach(async ({ page }) => {
  await page.goto("Search/Jobs", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("networkidle");
});

test("Filter By tabs and Check the visibility of all the filters", async ({
  page,
}) => {
  const search = new SearchPageJobSearch(page);
  await page.waitForLoadState("networkidle");
  const filterSelectors = search.getFilterSelectors();
  // Test each filter
  for (const [filterName, selector] of Object.entries(filterSelectors)) {
    await search.testFilterToggle(filterName, selector);
  }
});

test("search with all empty fields", async ({ page }) => {
  const search = new SearchPageJobSearch(page);
  const selectors = search.getInputButtonSelectors();
  await page.getByTestId(selectors.searchButton).click();
  // here will handle the visibility of the table once the ids are updated
});
test("search by all matching jobs as per valid input criteria", async ({
  page,
}) => {
  const search = new SearchPageJobSearch(page);
  const selectors = search.getInputButtonSelectors();
  // Fill in the search fields with valid inputs
  await page.getByTestId(selectors.jobTitle).fill("Software Engineer");
  await page.getByTestId(selectors.jobReference).fill("REF12345");
  await page.getByTestId(selectors.jobStatus).click();
  await page.getByTestId(selectors.location).click();
  await page.getByTestId(selectors.dateFrom).fill("29/12/2023"); // Use a valid date format
  await page.getByTestId(selectors.dateTo).fill("1/01/2024"); // Use a valid date format
  await page.getByTestId(selectors.bulkRecruitmentJob).click();
  // Click the search button
  await page.getByTestId(selectors.searchButton).click();
});

test("search by invalid inputs verifications", async ({ page }) => {
  const search = new SearchPageJobSearch(page);
  const selectors = search.getInputButtonSelectors();

  await page.getByTestId(selectors.jobTitle).fill("sfghrtyacvbvbmj");
  await page.getByTestId(selectors.dateFrom).fill("invalid-date");
  await page.getByTestId(selectors.dateTo).fill("32/13/2050");

  await page.getByTestId(selectors.searchButton).click();
  // here i/we will Check/handling for appropriate error messages based on the search criteria
});

test("search by valid date range", async ({ page }) => {
  const search = new SearchPageJobSearch(page);
  const selectors = search.getInputButtonSelectors();

  await page.getByTestId(selectors.dateFrom).fill("23/06/2023");
  await page.getByTestId(selectors.dateTo).fill("1/01/2024");

  await page.getByTestId(selectors.searchButton).click();

  // Check for appropriate error message about invalid date range
  // expect(await page.getByTestId("date-range-error").isVisible()).toBeTruthy();
});

test("search by job status", async ({ page }) => {
  const search = new SearchPageJobSearch(page);
  const selectors = search.getInputButtonSelectors();

  await page.getByTestId(selectors.jobStatus).click();
  await page
    .getByTestId(selectors.JobStatusDropdown)
    .getByText("on Hold")
    .click();
  // Verify that all displayed jobs have "Open" status if needed will handle it properly
});

test("search by job location", async ({ page }) => {
  const search = new SearchPageJobSearch(page);
  const selectors = search.getInputButtonSelectors();
  await page.getByTestId(selectors.location).click();
  await page.getByTestId(selectors.locationDropdown).getByText("Adam").click();
});

test("From Filter Tab Select Random Filter", async ({ page }) => {
  const search = new SearchPageJobSearch(page);
  const filterSelectors = search.getFilterSelectors();
  const parentSelector = await page.getByTestId("div-left-nav");
  const child = await search.selectRandomChild(parentSelector, "a");
  const text = (await child.textContent()) || "";
  const key = search.convertKey(text.trim());
  const filterSelector = key
    ? filterSelectors[key as keyof typeof filterSelectors]
    : " ";
  await search.testFilterToggle(key, filterSelector);
});
