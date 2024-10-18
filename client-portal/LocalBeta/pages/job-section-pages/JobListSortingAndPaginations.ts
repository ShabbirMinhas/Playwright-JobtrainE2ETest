import { Browser, Locator, Page, chromium, expect } from "@playwright/test";
// System Settings class
export default class JobTableSortingAndPagination {
  async getSelectors() {
    return this.selectors;
  }

  cleanArray = (array: string[]): string[] => {
    return array.map((item) => item.trim()).filter((item) => item !== "");
  };
  page: Page;
  selectors: {
    mainTable: string;
    tableHeader: string;
    jobReferenceHeader: string;
    jobTitleHeader: string;
    jobStatusHeader: string;
    locationHeader: string;
    closingDateHeader: string;
    isLiveHeader: string;
    totalHeader: string;
    newHeader: string;
    recruiterHeader: string;
    tableShowingResults: string;
    tableInputPageSize: string;
    firstPageButton: string;
    lastPageButton: string;
    previousButton: string;
    nextButton: string;
    moreSection: string;
    addAJob: string;
    addToMyJobs: string;
    editJob: string;
    print: string;
    exportToExcel: string;
    exportToWord: string;
    printExit: string;
  };

  constructor(page: Page) {
    this.page = page;
    this.selectors = {
      mainTable: "div-main-table-listing-jobs",
      tableHeader: "div-theader-listing-jobs",
      jobReferenceHeader: "div-theader-name-JOBREFERENCE",
      jobTitleHeader: "div-theader-name-JOBTITLE",
      jobStatusHeader: "div-theader-name-JOBSTATUSDESCRIPT",
      locationHeader: "div-theader-name-LOCATIONNAME",
      closingDateHeader: "div-theader-name-CLOSINGDATE",
      isLiveHeader: "div-theader-name-ISLIVE",
      totalHeader: "div-theader-name-TotalApps",
      newHeader: "div-theader-name-COL1",
      recruiterHeader: "div-theader-name-RecruiterName",
      tableShowingResults: "div-showing-results-listing-jobs",
      tableInputPageSize: "select-page-size-listing-jobs",
      firstPageButton: "li-first-page-listing-jobs",
      lastPageButton: "li-last-page-listing-jobs",
      previousButton: "li-previous-pagelisting-jobs",
      nextButton: "li-next-page-listing-jobs",
      moreSection: "main-container-null",
      addAJob: "btn-create-new-job",
      addToMyJobs: "btn-create-new",
      editJob: "btn-edit",
      print: "btn-print",
      exportToExcel: "btn-export",
      exportToWord: "btn-export-to-word",
      printExit: "btn-exit",
    };
  }
  async getHeaderSpans() {
    const tableHeader = await this.page.getByTestId(this.selectors.tableHeader);
    const spans = await tableHeader.locator("div").allTextContents();
    return spans;
  }

  async addAJob() {
    await expect(this.page.getByTestId(this.selectors.addAJob)).toBeVisible();
    await this.page.getByTestId(this.selectors.addAJob).click();
    await expect(this.page).toHaveURL(/\/JobDetailChoice$/);
    await expect(this.page.getByTestId("form-create-new-job")).toBeVisible();
  }

  async addToMyJobs(pageSize: number) {
    await expect(
      this.page.getByTestId(this.selectors.addToMyJobs)
    ).toBeVisible();
    await this.page.getByTestId(this.selectors.addToMyJobs).click();
    await expect(this.page.getByText("× Please select a job.")).toBeVisible();
    await this.page.getByText("× Please select a job.").click();
    const randomIndex = Math.floor(Math.random() * pageSize);
    await this.page
      .getByTestId(`div-tbl-data-row-${randomIndex}-listing-jobs`)
      .locator("label")
      .check();
    await this.page.getByTestId(this.selectors.addToMyJobs).click();
  }
  async editJob() {
    await expect(this.page.getByTestId(this.selectors.editJob)).toBeVisible();
    await this.page.getByTestId(this.selectors.editJob).click();
    await expect(this.page).toHaveURL(/\/Myjobs$/);
  }

  async print() {
    // their is error with this test id it resolves to two different elements
    // that,s why using indexing
    await expect(
      this.page.getByTestId(this.selectors.print).nth(0)
    ).toBeVisible();
    await this.page.getByTestId(this.selectors.print).nth(0).click();
    await expect(this.page).toHaveURL(/\/PrintPreview$/);
  }

  async exportToExcel() {
    await expect(
      this.page.getByTestId(this.selectors.exportToExcel)
    ).toBeVisible();
    await this.page.getByTestId(this.selectors.exportToExcel).click();
    const downloadPromise = await this.page.waitForEvent("download");
    const download = await downloadPromise;
    expect(download).toBeTruthy();
    expect(download.suggestedFilename()).toContain(".xls");
    await expect(this.page).toHaveURL(
      "http://beta.jobtrain.com/JobsAndTalents/Jobs/List"
    );
  }
}
