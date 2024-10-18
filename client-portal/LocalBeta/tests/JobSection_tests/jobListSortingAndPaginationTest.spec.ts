import { test, expect, Page, selectors } from "@playwright/test";
import ExcelUtils, { ExcelRow, WriteOptions } from "../../utils/excelUtils";
import JobTableSortingAndPagination from "../../pages/job-section-pages/JobListSortingAndPaginations";
import { Helpers as jobTable } from "../../utils/helpers";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// variable to hold data, initialized as 'any' type.
type TableRow = { [key: string]: any };

let assessementFormsData: TableRow[];
let TableSrtPagination: JobTableSortingAndPagination;
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
  await page.goto("JobsAndTalents/Jobs/List", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("networkidle");
  TableSrtPagination = new JobTableSortingAndPagination(page);
  // initalize the page in the helpers class
  jobTable.intializePage(page);
});

test("Verify Add a Job link visibilty and navigation", async () => {
  await TableSrtPagination.addAJob();
});

test("Verify Add to My Jobs link visibilty and navigation", async () => {
  const selectors = await TableSrtPagination.getSelectors();
  const totalEntries = await jobTable.getPageSize(selectors.tableInputPageSize);
  await TableSrtPagination.addToMyJobs(+totalEntries);
});

test("Verify Edit Job link visibilty and navigation", async () => {
  await TableSrtPagination.editJob();
});

test("Verify Print link visibilty and navigation", async ({ page }) => {
  const selectors = await TableSrtPagination.getSelectors();
  await TableSrtPagination.print();
  await page.waitForLoadState("networkidle");
  await expect(page.getByTestId(selectors.exportToWord)).toBeVisible();
  await expect(page.getByTestId(selectors.print)).toBeVisible();
  await expect(page.getByTestId(selectors.printExit)).toBeVisible();
  await expect(page.locator("#print-section")).toBeVisible();
});

test("Verify Export to Excel link visibilty and navigation", async () => {
  await TableSrtPagination.exportToExcel();
});
test("Verify the visibility of table and rows", async ({ page }) => {
  const selectors = await TableSrtPagination.getSelectors();
  await page.waitForLoadState("networkidle");
  const table = await page.getByTestId(selectors.mainTable);
  await expect(table).toBeVisible();
  console.log("table is visible ");
  const rows = await page.locator(".table_row").count();
  console.log(`Total visible rows of the table is : ${rows}`);
  await expect(rows).toBeGreaterThanOrEqual(1);
});

test("verification of more section visibility", async ({ page }) => {
  // wait for network idale
  const selectors = await TableSrtPagination.getSelectors();
  const moreButton = await page.locator("#moreId").nth(1);
  await moreButton.click();
  await page.waitForLoadState("networkidle");
  // verifying that more section is visible
  const moreSection = await page.getByTestId(selectors.moreSection);
  await expect(moreSection).toBeVisible();
});
test("Verify table header text", async ({ page }) => {
  // wait for network idale
  const tableheadings: string[] = [
    "Job Reference",
    "Job Title",
    "Job Status",
    "Location",
    "Hiring Manager",
    "Closing Date",
    "Is Live",
    "Total",
    "New",
    "Recruiter",
    "Edit",
    "More",
  ];
  // netwrok wait for 1 second
  await delay(1000);
  // getting the header spans and comparing with expected header text
  await page.waitForLoadState("networkidle");
  const tblHeaderArray = await TableSrtPagination.cleanArray(
    await TableSrtPagination.getHeaderSpans()
  );
  await expect(tblHeaderArray).toEqual(tableheadings);
});

test("sorting by jobReference", async ({ page }) => {
  // gettting all the selectors
  const selectors = await TableSrtPagination.getSelectors();
  // verifying that the data is in ascending order
  await jobTable.verifySorting(
    selectors.jobReferenceHeader,
    "div-tbl-row-data-cell",
    "string",
    "JOBREFERENCE",
    true
  );
  await page.waitForLoadState("networkidle");
  // verifying that the data is in descending order
  await jobTable.verifySorting(
    selectors.jobReferenceHeader,
    "div-tbl-row-data-cell",
    "string",
    "JOBREFERENCE",
    false
  );
});
test("sorting by job title", async ({ page }) => {
  // gettting all the selectors
  const selectors = await TableSrtPagination.getSelectors();
  // verifying that the data is in  descending order
  await jobTable.verifySorting(
    selectors.jobTitleHeader,
    "div-tbl-row-data-cell",
    "string",
    "JOBTITLE",
    false
  );
  await page.waitForLoadState("networkidle");
  // verifying that the data is in ascending order
  await jobTable.verifySorting(
    selectors.jobTitleHeader,
    "div-tbl-row-data-cell",
    "string",
    "JOBTITLE",
    true
  );
});

test("sorting by job Status", async ({ page }) => {
  // gettting all the selectors
  const selectors = await TableSrtPagination.getSelectors();
  // verifying that the data is in ascending  order
  await jobTable.verifySorting(
    selectors.jobStatusHeader,
    "div-tbl-row-data-cell",
    "string",
    "JOBSTATUSDESCRIPT",
    true
  );
  await page.waitForLoadState("networkidle");
  // verifying that the data is in descending order
  await jobTable.verifySorting(
    selectors.jobStatusHeader,
    "div-tbl-row-data-cell",
    "string",
    "JOBSTATUSDESCRIPT",
    false
  );
});

test("sorting by location", async ({ page }) => {
  // gettting all the selectors
  const selectors = await TableSrtPagination.getSelectors();
  // verifying that the data is in ascending  order
  await jobTable.verifySorting(
    selectors.locationHeader,
    "div-tbl-row-data-cell",
    "string",
    "LOCATIONNAME",
    true
  );
  await page.waitForLoadState("networkidle");
  // verifying that the data is in descending order
  await jobTable.verifySorting(
    selectors.locationHeader,
    "div-tbl-row-data-cell",
    "string",
    "LOCATIONNAME",
    false
  );
});
test("sorting by closing Date", async ({ page }) => {
  // gettting all the selectors
  const selectors = await TableSrtPagination.getSelectors();
  // verifying that the data is in ascending  order
  await jobTable.verifySorting(
    selectors.closingDateHeader,
    "div-tbl-row-data-cell",
    "date",
    "CLOSINGDATE",
    true
  );
  await page.waitForLoadState("networkidle");
  // verifying that the data is in descending order
  await jobTable.verifySorting(
    selectors.closingDateHeader,
    "div-tbl-row-data-cell",
    "date",
    "CLOSINGDATE",
    false
  );
});

test("sorting by is Live", async ({ page }) => {
  // gettting all the selectors
  const selectors = await TableSrtPagination.getSelectors();
  // verifying that the data is in ascending  order
  await jobTable.verifySorting(
    selectors.isLiveHeader,
    "div-tbl-row-data-cell",
    "string",
    "ISLIVE",
    true
  );
  await page.waitForLoadState("networkidle");
  // verifying that the data is in descending order
  await jobTable.verifySorting(
    selectors.isLiveHeader,
    "div-tbl-row-data-cell",
    "string",
    "ISLIVE",
    false
  );
});

test("sorting by total", async ({ page }) => {
  // gettting all the selectors
  const selectors = await TableSrtPagination.getSelectors();
  // verifying that the data is in ascending  order
  await jobTable.verifySorting(
    selectors.totalHeader,
    "div-tbl-row-data-cell",
    "number",
    "TotalApps",
    true
  );
  await page.waitForLoadState("networkidle");
  // verifying that the data is in descending order
  await jobTable.verifySorting(
    selectors.totalHeader,
    "div-tbl-row-data-cell",
    "number",
    "TotalApps",
    false
  );
});
test("sorting by new", async ({ page }) => {
  // gettting all the selectors
  const selectors = await TableSrtPagination.getSelectors();
  // verifying that the data is in ascending  order
  await jobTable.verifySorting(
    selectors.newHeader,
    "div-tbl-row-data-cell",
    "number",
    "COL1",
    true
  );
  await page.waitForLoadState("networkidle");
  // verifying that the data is in descending order
  await jobTable.verifySorting(
    selectors.newHeader,
    "div-tbl-row-data-cell",
    "number",
    "COL1",
    false
  );
});
test("sorting by recuiter", async ({ page }) => {
  // gettting all the selectors
  const selectors = await TableSrtPagination.getSelectors();
  // verifying that the data is in ascending  order
  await jobTable.verifySorting(
    selectors.recruiterHeader,
    "div-tbl-row-data-cell",
    "string",
    "RecruiterName",
    true
  );
  await page.waitForLoadState("networkidle");
  // verifying that the data is in descending order
  await jobTable.verifySorting(
    selectors.recruiterHeader,
    "div-tbl-row-data-cell",
    "string",
    "RecruiterName",
    false
  );
});
test("Verify default page size ", async ({ page }) => {
  const selectors = await TableSrtPagination.getSelectors();
  const pageSize = await jobTable.getPageSize(selectors.tableInputPageSize);
  await expect(pageSize).toBe(20);
});

test("verify row count and page size change", async ({ page }) => {
  const selectors = await TableSrtPagination.getSelectors();
  await jobTable.setPageSize(10, selectors.tableInputPageSize);
  await page.waitForTimeout(3000);
  await page.waitForLoadState("networkidle");
  const newPageSize = await jobTable.getPageSize(selectors.tableInputPageSize);
  console.log("New page size : ", newPageSize);
  await expect(newPageSize).toBe(10);
  await page.waitForLoadState("networkidle", { timeout: 2000 });
  const rowCount = await jobTable.getTableRowCount();
  await page.waitForTimeout(3000);
  console.log("visible Row count : ", rowCount);
  await expect(rowCount).toBeLessThanOrEqual(10);
});

test(" verify pagination", async ({ page }) => {
  const selectors = await TableSrtPagination.getSelectors();
  await jobTable.goToFirstPage(selectors.firstPageButton);
  await page.waitForTimeout(1000);
  await expect(
    await jobTable.isFirstPageButtonDisabled(selectors.firstPageButton)
  ).toBe(true);

  const initialInfo = await jobTable.getCurrentPageInfo(
    selectors.tableShowingResults
  );
  await expect(initialInfo.start).toBe(1);

  await jobTable.goToNextPage(selectors.nextButton);
  await page.waitForTimeout(1000);
  const nextPageInfo = await jobTable.getCurrentPageInfo(
    selectors.tableShowingResults
  );
  await expect(nextPageInfo.start).toBeGreaterThan(initialInfo.start);

  await jobTable.goToPreviousPage(selectors.previousButton);
  await page.waitForTimeout(1000);
  const prevPageInfo = await jobTable.getCurrentPageInfo(
    selectors.tableShowingResults
  );
  await expect(prevPageInfo.start).toBe(initialInfo.start);

  await jobTable.goToLastPage(selectors.lastPageButton);
  await page.waitForTimeout(1000);
  await expect(
    await jobTable.isLastPageButtonDisabled(selectors.lastPageButton)
  ).toBe(true);

  const lastPageInfo = await jobTable.getCurrentPageInfo(
    selectors.tableShowingResults
  );
  await expect(lastPageInfo.end).toBe(lastPageInfo.total);
});

test("Total entries matches page size and navigation", async ({ page }) => {
  const selectors = await TableSrtPagination.getSelectors();
  const totalEntries = await jobTable.getTotalEntries(
    selectors.tableShowingResults
  );
  await expect(totalEntries).toBeGreaterThan(0);
  await jobTable.setPageSize(10, selectors.tableInputPageSize);
  // we have to wait for short time after changing the page size
  await page.waitForTimeout(1000);
  const pageInfo = await jobTable.getCurrentPageInfo(
    selectors.tableShowingResults
  );
  await expect(pageInfo.end - pageInfo.start + 1).toBeLessThanOrEqual(10);
  const pageCount = Math.ceil(totalEntries / 10);
  for (let i = 1; i < pageCount; i++) {
    await jobTable.goToNextPage(selectors.nextButton);
    await page.waitForTimeout(1000);
    const currentInfo = await jobTable.getCurrentPageInfo(
      selectors.tableShowingResults
    );
    await expect(currentInfo.start).toBe(i * 10 + 1);
  }
});
