import { test, expect, Page, selectors } from "@playwright/test";
import ExcelUtils, { ExcelRow, WriteOptions } from "../../utils/excelUtils";
import SearchReportPages from "../../pages/reports/SearchReportPages";
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// variable to hold data, initialized as 'any' type.
type TableRow = { [key: string]: any };
let assessementFormsData: TableRow[];
let searchReports: SearchReportPages;
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
  await page.goto("ReportBuilder/MyReports", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("networkidle");
  searchReports = new SearchReportPages(page);
});

test("search filter button opens search tab", async ({ page }) => {
  await searchReports.openSearchTab();
  await expect(page.locator("form").nth(1)).toBeVisible();
});

test("enter search criteria and submit", async ({ page }) => {
  const selectors = await searchReports.getSelectors();
  await searchReports.openSearchTab();
  await searchReports.selectRandomCreatedByValue();
  page.waitForLoadState("networkidle");
  await searchReports.selectRandomReportTypeValue();
  page.waitForLoadState("networkidle");
  await searchReports.selectRandomDatasourceValue();
  page.waitForLoadState("networkidle");
  await page.getByTestId(selectors.createdFromInput).fill("2023-01-01");
  await page.getByTestId(selectors.createdToInput).fill("2023-12-31");
  await page.getByTestId(selectors.searchButton).click();
  // Add an assertion here to check if search results are displayed
  // For example:
  // await expect(page.locator('data-testid=search-results')).toBeVisible();
});

test("date inputs accept valid date formats", async ({ page }) => {
  const selectors = await searchReports.getSelectors();
  await searchReports.openSearchTab();
  await page.getByTestId(selectors.createdFromInput).fill("2023-01-01");
  await page.getByTestId(selectors.createdToInput).fill("2023-12-31");
  await expect(page.getByTestId(selectors.createdFromInput)).toHaveValue(
    "2023-01-01"
  );
  await expect(page.getByTestId(selectors.createdToInput)).toHaveValue(
    "2023-12-31"
  );
});

test.skip("search results update when criteria changes", async ({ page }) => {
  const selectors = await searchReports.getSelectors();
  await searchReports.openSearchTab();
  await searchReports.selectRandomCreatedByValue();
  page.waitForLoadState("networkidle");
  await page.getByTestId(selectors.searchButton).click();
  page.waitForLoadState("networkidle");
  page.waitForTimeout(3000);
  // here i will expect the result with example like below
  // await expect(page.locator('data-testid=search-results')).toContainText('saleem khan d');
  await searchReports.selectRandomCreatedByValue();
  page.waitForLoadState("networkidle");
  await page.getByTestId(selectors.searchButton).click();
  // here i will also expect the result with example like below
  // await expect(page.locator('data-testid=search-results')).toContainText('saleem khan d');
});
