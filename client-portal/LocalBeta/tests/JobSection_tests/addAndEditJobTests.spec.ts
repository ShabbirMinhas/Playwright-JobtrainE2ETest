import { test, expect, Page, selectors } from "@playwright/test";
import ExcelUtils, { ExcelRow, WriteOptions } from "../../utils/excelUtils";
import AddJobPage from "../../pages/job-section-pages/AddAndEditJobPage";
import { Helpers as jobTable } from "../../utils/helpers";
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// variable to hold data, initialized as 'any' type.
type TableRow = { [key: string]: any };
let assessementFormsData: TableRow[];
let addJobForm: AddJobPage;
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
  await page.goto("JobsAndTalents/AddJob/JobDetails", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("networkidle");
  addJobForm = new AddJobPage(page);
  jobTable.intializePage(page);
});
test("verify and add a new job", async ({ page }) => {
  const selectors = await addJobForm.getSelectors();
  const jobDetails = await addJobForm.fillBasicDetails(false, [
    "Automation for candidates",
    "automationEmail@gmail.com",
  ]);
  await addJobForm.selectJobTypes(["External", "Internal", "Agency"]);
  await page.waitForLoadState("networkidle");
  const visibleTabs = await addJobForm.checkTabsVisibility();
  await addJobForm.fillApplicationForms(visibleTabs, false);
  await page.getByTestId(selectors.saveAndContinueButton).click();
  await addJobForm.approvalForm();
  await addJobForm.jobAccess();
  await addJobForm.searchAndAlerts();
  await addJobForm.jobNotes();
  const jobRef = await addJobForm.publishJob();
  await addJobForm.exitJobCreation();
  const searchResults = await addJobForm.searchForJob(jobRef);
  await expect(searchResults.referenceNumber).toEqual(jobRef);
  await expect(searchResults.jobTitle).toEqual(jobDetails.title);
});

test("edit a job", async ({ page }) => {
  const selectors = await addJobForm.getSelectors();
  await page.goto("http://beta.jobtrain.com/JobsAndTalents/Jobs/List");
  await page
    .getByTestId("div-tbl-data-row-0-listing-jobs")
    .locator("label")
    .check();
  await page.getByTestId(selectors.editbutton).click();
  const currentTime = await addJobForm.getCurrentHoursAMinutes();
  const jobDetails = await addJobForm.fillBasicDetails(true, [
    currentTime,
    "automationEidted@gmail.com",
  ]);
  await addJobForm.selectJobTypes(["External", "Internal", "Agency"]);
  const visibleTabs = await addJobForm.checkTabsVisibility();
  await addJobForm.fillApplicationForms(visibleTabs, true);
  await page.getByTestId(selectors.saveAndContinueButton).click();
  await addJobForm.approvalForm(true);
  await addJobForm.jobAccess();
  await addJobForm.searchAndAlerts();
  await addJobForm.jobNotes(true);
  const referenceText = await (
    await page.getByText("Job Ref : NDD-").innerText()
  )
    .split(":")[1]
    .trim();
  await page.getByRole("button", { name: "Exit" });
  await addJobForm.exitJobCreation();
  const searchResults = await addJobForm.searchForJob(referenceText);
});

test("verify all tabs are present and clickable", async ({ page }) => {
  const tabs = [
    "Details",
    "Adverts",
    "Assessment",
    "Approval Form",
    "Job Access",
    "Search and Alerts",
    "Job Notes",
    "Post The Job",
  ];
  const selectors = await addJobForm.getSelectors();
  await page.goto("http://beta.jobtrain.com/JobsAndTalents/Jobs/List");
  const totalEntries = await jobTable.getPageSize(selectors.tableInputPageSize);
  const count = await Math.floor(Math.random() * totalEntries);
  await page
    .getByTestId(`div-tbl-data-row-${count}-listing-jobs`)
    .locator("label")
    .check();
  await page.getByTestId(selectors.editbutton).click();
  for (const tab of tabs) {
    const tabElement = page.locator(`text=${tab}`);
    await expect(tabElement).toBeVisible();
    await expect(tabElement).toBeEnabled();
    console.log(`tab: ${tab}`);
    await tabElement.click();
    await addJobForm.verifyButtonVisibleAndEnables(selectors.exit);
    await addJobForm.verifyButtonVisibleAndEnables(selectors.save);
    await addJobForm.verifyButtonVisibleAndEnables(selectors.previous);
    await addJobForm.verifyButtonVisibleAndEnables(selectors.continue);
    await addJobForm.verifyButtonVisibleAndEnables(selectors.saveAndClose);
    await addJobForm.verifyButtonVisibleAndEnables(selectors.saveAndContinue);
    await addJobForm.verifyButtonVisibleAndEnables(
      selectors.saveAndStartApproval
    );
  }
});
