import { test, expect, Page } from "@playwright/test";
import ExcelUtils from "../../utils/excelUtils";
import SearchPageCTAlerts from "../../pages/search-pages/SearchPageCTAlerts";

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
  await page.goto("Search/JobAlerts", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("networkidle");
});
test("Filter By tabs and Check the visibility of all the filters", async ({
  page,
}) => {
  const search = new SearchPageCTAlerts(page);
  await page.waitForLoadState("networkidle");
  const filterSelectors = search.getFilterSelectors();
  for (const [filterName, selector] of Object.entries(filterSelectors)) {
    await search.testFilterToggle(filterName, selector);
  }
});
test("search by all matching jobs as per valid input criteria", async ({
  page,
}) => {
  const search = new SearchPageCTAlerts(page);
  const selectors = search.getInputButtonSelectors();
  await page.getByTestId(selectors.CreateDateFrom).fill("29/12/2023");
  await page.getByTestId(selectors.CreateDateTo).fill("1/01/2024");
  await page.getByTestId(selectors.FirstName).fill("Umar");
  await page.getByTestId(selectors.LastName).fill("Mumtaz");
  await page.getByTestId(selectors.Email).fill("me@gmail.com");
  await page.getByTestId(selectors.SearchButton).click();
});

test("search by valid date range", async ({ page }) => {
  const search = new SearchPageCTAlerts(page);
  const selectors = search.getInputButtonSelectors();
  await page.getByTestId(selectors.CreateDateFrom).fill("23/06/2023");
  await page.getByTestId(selectors.CreateDateTo).fill("1/01/2024");
  await page.getByTestId(selectors.SearchButton).click();
});

test("From Filter Tab Select Random Filter", async ({ page }) => {
  const search = new SearchPageCTAlerts(page);
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
