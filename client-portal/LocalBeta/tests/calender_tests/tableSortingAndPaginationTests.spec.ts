import { test, expect, Page } from "@playwright/test";
import ExcelUtils, { ExcelRow, WriteOptions } from "../../utils/excelUtils";
import TableSortingAndPagination from "../../pages/calender-page/TableSortingAndPagination";
import { TIMEOUT } from "dns";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// variable to hold data, initialized as 'any' type.
type TableRow = { [key: string]: any };

let assessementFormsData: TableRow[];
let TableSrtPagination: TableSortingAndPagination;
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
  TableSrtPagination = new TableSortingAndPagination(page);
});

test("Verify table header text", async ({ page }) => {
  // wait for network idale
  const tableheadings: string[] = [
    "Subject",
    "StartDate",
    "Self Service",
    "Appointment Type",
    "Created By",
    "Location",
    "Total Available",
    "Total Booked",
  ];
  await page.waitForLoadState("networkidle");
  const tblHeaderArray = await TableSrtPagination.cleanArray(
    await TableSrtPagination.GetHeaderSpans()
  );
  await expect(tblHeaderArray).toEqual(tableheadings);
});

test("sorting by subject", async ({ page }) => {
  // gettting all the selectors
  const selectors = await TableSrtPagination.getSelectors();
  // verifying that the data is in ascending order
  await TableSrtPagination.verifySorting(
    selectors.subjectHeader,
    "div-tbl-row-data-cell",
    "string",
    "Subject",
    true
  );
  await page.waitForLoadState("networkidle");
  // verifying that the data is in descending order
  await TableSrtPagination.verifySorting(
    selectors.subjectHeader,
    "div-tbl-row-data-cell",
    "string",
    "Subject",
    false
  );
});
test("sorting by startDate", async ({ page }) => {
  // gettting all the selectors
  const selectors = await TableSrtPagination.getSelectors();
  // verifying that the data is in ascending order
  await TableSrtPagination.verifySorting(
    selectors.startDateHeader,
    "div-tbl-row-data-cell",
    "date",
    "StartDate",
    true
  );
  await page.waitForLoadState("networkidle");
  // verifying that the data is in descending order
  await TableSrtPagination.verifySorting(
    selectors.startDateHeader,
    "div-tbl-row-data-cell",
    "date",
    "StartDate",
    false
  );
});

test("sorting by selfService", async ({ page }) => {
  // gettting all the selectors
  const selectors = await TableSrtPagination.getSelectors();
  // verifying that the data is in ascending order
  await TableSrtPagination.verifySorting(
    selectors.selfServiceHeader,
    "div-tbl-row-data-cell",
    "string",
    "CandidateAction",
    true
  );
  await page.waitForLoadState("networkidle");
  // verifying that the data is in descending order
  await TableSrtPagination.verifySorting(
    selectors.selfServiceHeader,
    "div-tbl-row-data-cell",
    "string",
    "CandidateAction",
    false
  );
});

test("sorting by appointment Type", async ({ page }) => {
  // gettting all the selectors
  const selectors = await TableSrtPagination.getSelectors();
  // verifying that the data is in ascending order
  await TableSrtPagination.verifySorting(
    selectors.appointmentTypeHeader,
    "div-tbl-row-data-cell",
    "string",
    "SYSTEMAPPOINTMENTTYPE",
    true
  );
  await page.waitForLoadState("networkidle");
  // verifying that the data is in descending order
  await TableSrtPagination.verifySorting(
    selectors.appointmentTypeHeader,
    "div-tbl-row-data-cell",
    "string",
    "SYSTEMAPPOINTMENTTYPE",
    false
  );
});

test("sorting by location", async ({ page }) => {
  // gettting all the selectors
  const selectors = await TableSrtPagination.getSelectors();
  // verifying that the data is in ascending order
  await TableSrtPagination.verifySorting(
    selectors.location_header,
    "div-tbl-row-data-cell",
    "string",
    "LOCATIONNAME",
    true
  );
  // verifying that the data is in descending order
  await TableSrtPagination.verifySorting(
    selectors.location_header,
    "div-tbl-row-data-cell",
    "string",
    "LOCATIONNAME",
    false
  );
});

test("Verify default page size ", async () => {
  const pageSize = await TableSrtPagination.getPageSize();
  expect(pageSize).toBe(20);
});

test("verify row count and page size change", async ({ page }) => {
  await TableSrtPagination.setPageSize(10);
  await page.waitForLoadState("networkidle", { timeout: 2000 });
  const newPageSize = await TableSrtPagination.getPageSize();
  console.log("New page size : ", newPageSize);
  await expect(newPageSize).toBe(10);
  await page.waitForLoadState("networkidle", { timeout: 2000 });
  const rowCount = await TableSrtPagination.getTableRowCount();
  await page.waitForTimeout(2000);
  console.log("visible Row count : ", rowCount);
  await expect(rowCount).toBeLessThanOrEqual(10);
});

test(" verify pagination", async ({ page }) => {
  await TableSrtPagination.goToFirstPage();
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(2000);
  await expect(await TableSrtPagination.isFirstPageButtonDisabled()).toBe(true);

  const initialInfo = await TableSrtPagination.getCurrentPageInfo();
  await expect(initialInfo.start).toBe(1);

  await TableSrtPagination.goToNextPage();
  await page.waitForTimeout(2000);
  await page.waitForLoadState("networkidle");
  const nextPageInfo = await TableSrtPagination.getCurrentPageInfo();
  await page.waitForTimeout(2000);
  await page.waitForLoadState("networkidle");
  await expect(nextPageInfo.start).toBeGreaterThan(initialInfo.start);

  await TableSrtPagination.goToPreviousPage();
  await page.waitForTimeout(2000);
  await page.waitForLoadState("networkidle");
  const prevPageInfo = await TableSrtPagination.getCurrentPageInfo();
  await expect(prevPageInfo.start).toBe(initialInfo.start);
  await TableSrtPagination.goToLastPage();
  await page.waitForLoadState("networkidle");
  await expect(await TableSrtPagination.isLastPageButtonDisabled()).toBe(true);

  const lastPageInfo = await TableSrtPagination.getCurrentPageInfo();
  await expect(lastPageInfo.end).toBe(lastPageInfo.total);
});

test(" Verify total entries matches page size and navigation", async ({
  page,
}) => {
  const totalEntries = await TableSrtPagination.getTotalEntries();
  await expect(totalEntries).toBeGreaterThan(0);
  await TableSrtPagination.setPageSize(10);
  await page.waitForTimeout(2000);
  const pageInfo = await TableSrtPagination.getCurrentPageInfo();
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(2000);
  await expect(pageInfo.end - pageInfo.start + 1).toBeLessThanOrEqual(10);
  const pageCount = Math.ceil(totalEntries / 10);
  for (let i = 1; i < pageCount; i++) {
    await TableSrtPagination.goToNextPage();
    await page.waitForTimeout(2000);
    const currentInfo = await TableSrtPagination.getCurrentPageInfo();
    // await page.waitForLoadState("networkidle", { timeout: 6000 });
    await expect(currentInfo.start).toBe(i * 10 + 1);
  }
});
