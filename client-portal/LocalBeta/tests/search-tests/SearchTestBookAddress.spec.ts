import { test, expect, Page } from "@playwright/test";
import ExcelUtils from "../../utils/excelUtils";
import SearchPageBookAddress from "../../pages/search-pages/SearchPageBookAddress";

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
  await page.goto("Search/AddressBook", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("networkidle");
});
test("search by all matching jobs as per valid input criteria", async ({
  page,
}) => {
  const search = new SearchPageBookAddress(page);
  const selectors = await search.getInputButtonSelectors();
  // Fill in the search fields with valid inputs and write individual test for the dropdowns
  await page.getByTestId(selectors.Name).fill("29/12/2023");
  await page.getByTestId(selectors.Email).fill("1/01/2024");
  await page.getByTestId(selectors.Job_Title).fill("Umar");
  await page.getByTestId(selectors.Location).fill("Mumtaz");
  // Click the search button
  await page.getByTestId(selectors.SearchButton).click();
});

test("search by all matching jobs as per Invalid input criteria", async ({
  page,
}) => {
  const search = new SearchPageBookAddress(page);
  const selectors = await search.getInputButtonSelectors();
  await page.getByTestId(selectors.Name).fill("29/12/20sdf23");
  await page.getByTestId(selectors.Email).fill("1/01/20sdf24");
  await page.getByTestId(selectors.Job_Title).fill("Umsdfar");
  await page.getByTestId(selectors.Location).fill("sdfasdf");
  await page.getByTestId(selectors.SearchButton).click();
});
