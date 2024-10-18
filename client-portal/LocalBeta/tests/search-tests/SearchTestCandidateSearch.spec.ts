import { test, expect, Page } from "@playwright/test";
import ExcelUtils from "../../utils/excelUtils";
import SearchPageCandidateSearch from "../../pages/search-pages/SearchPageCandidateSearch";

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
  await page.goto("Search/Candidates", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("networkidle");
});
test("Filter By tabs and Check the visibility of all the filters", async ({
  page,
}) => {
  const search = new SearchPageCandidateSearch(page);
  await page.waitForLoadState("networkidle");
  const filterSelectors = search.getFilterSelectors();
  // Test each filter
  for (const [filterName, selector] of Object.entries(filterSelectors)) {
    await search.testFilterToggle(filterName, selector);
  }
});
test("search by all matching jobs as per valid input criteria", async ({
  page,
}) => {
  const search = new SearchPageCandidateSearch(page);
  const selectors = search.getInputButtonSelectors();
  await page.getByTestId(selectors.Applicationfrom).fill("29/12/2023");
  await page.getByTestId(selectors.Applicationto).fill("1/01/2024");
  await page.getByTestId(selectors.FirstName).fill("Umar");
  await page.getByTestId(selectors.LastName).fill("Mumtaz");
  await page.getByTestId(selectors.Phone).fill("564567845");
  await page.getByTestId(selectors.Mobile).fill("1245645678");
  await page.getByTestId(selectors.Email).fill("me@gmail.com");
  await page.getByTestId(selectors.ApplicationNo).fill("134");
  await page.getByTestId(selectors.CandidateNo).fill("12345");
  await page.getByTestId(selectors.Enterpostcode).fill("SW11AA");
  await page.getByTestId(selectors.SearchButton).click();
});

test("search by valid date range", async ({ page }) => {
  const search = new SearchPageCandidateSearch(page);
  const selectors = search.getInputButtonSelectors();
  await page.getByTestId(selectors.Applicationfrom).fill("23/06/2023");
  await page.getByTestId(selectors.Applicationto).fill("1/01/2024");
  await page.getByTestId(selectors.SearchButton).click();
});

test("search by Application Status", async ({ page }) => {
  const search = new SearchPageCandidateSearch(page);
  const selectors = search.getInputButtonSelectors();
  await page.getByTestId(selectors.ApplicationStatuses).click();
  const parentlocator = await page.getByTestId(selectors.AppStatusDropdown);
  const RandomChild = await search.selectRandomChild(parentlocator, "li");
  await RandomChild.click();
});

test("search by Job Location", async ({ page }) => {
  const search = new SearchPageCandidateSearch(page);
  const selectors = search.getInputButtonSelectors();
  await page.getByTestId(selectors.Joblocation).click();
  const parentlocator = await page.getByTestId(selectors.JobLocationDropdown);
  const RandomChild = await search.selectRandomChild(parentlocator, "li");
  await RandomChild.click();
});

test("search by Candidate Type", async ({ page }) => {
  const search = new SearchPageCandidateSearch(page);
  const selectors = search.getInputButtonSelectors();
  await page.getByTestId(selectors.CandidateType).click();
  const parentlocator = await page.getByTestId(selectors.CandidateTypeDropdown);
  const RandomChild = await search.selectRandomChild(parentlocator, "li");
  await RandomChild.click();
  await page.getByTestId(selectors.SearchButton).click();
});

test("From Filter Tab Select Random Filter", async ({ page }) => {
  const search = new SearchPageCandidateSearch(page);
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
