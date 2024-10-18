import test, { expect, Locator, Page, Selectors } from "@playwright/test";
// System Settings class
export default class AddJobPage {
  page: Page;
  selectors: {
    jobReference: string;
    jobTitle: string;
    jobTitleForCandidates: string;
    employmentType: string;
    employmentTypeContainer: string;
    recruiter: string;
    reasonForVacancy: string;
    location: string;
    hoursPerWeek: string;
    department: string;
    reportsTo: string;
    division: string;
    fundingSource: string;
    schoolLocation: string;
    costCentre: string;
    salaryBenefits: string;
    emailForCandidatesToReplyTo: string;
    jobCategories: string;
    jobRegion: string;
    advertClosingDate: string;
    bulkRecruitmentToggle: string;
    chooseAppButton: string;
    jobStatus: string;
    externalTab: string;
    internalTab: string;
    agencyTab: string;
    searchJobInput: string;
    searchJobButton: string;
    tableRowRefereceNum: string;
    tableRowJobTitle: string;
    assessmentForm: string;
    assessmentFormA: string;
    assessmentFormAULContainter: string;
    approvalFormHManagerInput: string;
    jobAccess: string;
    jobAccessOptions: string;
    searchAndAlertCategores: string;
    searchAndAlertCategoresOptions: string;
    searchAndAlertJobRegions: string;
    searchAndAlertJobRegionsOptions: string;
    jobNoteSubject: string;
    jobNoteDescription: string;
    editbutton: string;
    exitButton: string;
    advertToggle: string;
    continueButton: string;
    saveButton: string;
    saveAndContinueButton: string;
    saveAndCloseButton: string;
    previousButton: string;
    tableInputPageSize: string;
    exit: string;
    saveAndContinue: string;
    saveAndClose: string;
    previous: string;
    saveAndStartApproval: string;
    continue: string;
    save: string;
  };

  constructor(page: Page) {
    this.page = page;
    this.selectors = {
      save: " Save ",
      exit: "Exit ",
      saveAndContinue: "Save & Continue ",
      saveAndClose: "Save & Close ",
      previous: "Previous ",
      saveAndStartApproval: "Save and Start Approval ",
      continue: "Continue ",
      tableInputPageSize: "select-page-size-listing-jobs",
      jobNoteSubject: "txt-note-subject",
      jobNoteDescription: "txt-area-description",
      searchAndAlertJobRegions: "txt-value-select-job-region",
      searchAndAlertJobRegionsOptions: "options-container-select-job-region",
      searchAndAlertCategores: "txt-value-select-categories",
      searchAndAlertCategoresOptions: "options-container-select-categories",
      jobReference: "txt-txtReference",
      jobStatus: "txt-value-select-job-status",
      jobTitle: "select-job-title",
      jobTitleForCandidates: "txt-txtTitleForCandidate",
      employmentType: "txt-value-select-cmbEmploymentType",
      employmentTypeContainer: "options-container-select-cmbEmploymentType",
      recruiter: "txt-value-select-divRecruiterID",
      reasonForVacancy: "txt-value-select-cmbReasonforVacancy",
      location: "txt-value-select-divLocationID",
      hoursPerWeek: "txt-txtHours",
      department: "txt-value-select-txtDepartment",
      reportsTo: "txt-txtReportsTo",
      division: "txt-value-select-divDivisionID",
      fundingSource: "txt-value-select-FundingSource",
      schoolLocation: "txt-value-select-divSchoolLocationID",
      costCentre: "txt-value-select-COSTCENTREID",
      salaryBenefits: "txt-value-select-txtPointSalary",
      emailForCandidatesToReplyTo: "txt-txtReplyTo",
      jobCategories: "txt-value-select-MUJobCategoryID",
      jobRegion: "txt-value-select-RegionID",
      advertClosingDate: "txt-closing-date",
      bulkRecruitmentToggle: "span-toggle-bulk-recruitment-job",
      externalTab: "a-tab-title-External-tab-assessment",
      internalTab: "a-tab-title-Internal-tab-assessment",
      agencyTab: "a-tab-title-Agency-tab-assessment",
      searchJobInput: "txt-search-by-job-and-candidate",
      searchJobButton: "btn-search-by-job-and-candidate",
      chooseAppButton: "txt-value-null",
      tableRowRefereceNum: "div-tbl-row-data-cell-0-JOBREFERENCE",
      tableRowJobTitle: "div-tbl-row-data-cell-0-JOBTITLE",
      assessmentForm: "span-toggle-add-assessment-form",
      assessmentFormA: "select-assessment-formA",
      assessmentFormAULContainter: "options-container-select-assessment-formA",
      approvalFormHManagerInput: "txt-Hiring Manager",
      jobAccess: "txt-value-select-job-access",
      jobAccessOptions: "options-container-select-job-access",
      editbutton: "btn-edit",
      saveButton: "btn-save",
      exitButton: "btn-close",
      advertToggle: "span-toggle-advert-job",
      continueButton: "btn-continue",
      saveAndContinueButton: "btn-save-and-continue",
      saveAndCloseButton: "btn-save-and-close",
      previousButton: "btn-previous",
    };
  }
  async getSelectors() {
    return this.selectors;
  }

  async selectRandomChild(
    parentSelector: Locator,
    childType: string
  ): Promise<Locator> {
    // Ensure the parent container is visible
    await parentSelector.waitFor({ state: "visible" });
    // Get all children elements of specified type
    const children = parentSelector.locator(childType);
    // Ensure that at least a child element is  visible
    await children.first().waitFor({ state: "visible" });
    //const children = await this.page.$$(childrenSelector);
    const count = await children.count();
    if (count === 0) {
      throw new Error(
        `No children of type '${childType}' found in the parent element`
      );
    }
    // Generate a random index
    const randomIndex = Math.floor(Math.random() * count);
    // Scroll to the random child and select it
    const randomChild = children.nth(randomIndex);
    await randomChild.scrollIntoViewIfNeeded();
    return randomChild;
  }
  async verifyButtonVisibleAndEnables(bottomDivButton: string) {
    const isVisible = await await this.page
      .getByRole("button", { name: bottomDivButton, exact: true })
      .isVisible();
    if (isVisible) {
      await expect(
        await this.page.getByRole("button", { name: bottomDivButton })
      ).toBeEnabled();
      console.log(`The button ${bottomDivButton} is visible and enabled`);
    }
  }
  async fillBasicDetails(edit: boolean = false, arr: string[]) {
    let jobTitle;
    if (!edit) {
      jobTitle = await this.selectRandomOption(this.selectors.jobTitle);
      await this.page.getByTestId(this.selectors.employmentType).click();
      const liParent = await this.page.getByTestId(
        this.selectors.employmentTypeContainer
      );
      await liParent
        .locator("li")
        .nth(Math.floor(Math.random() * (await liParent.locator("li").count())))
        .click();
      await this.page.waitForLoadState("networkidle", { timeout: 3000 });
      await this.fillInput(
        this.selectors.jobTitleForCandidates,
        `${jobTitle} for ${arr[0]} add by automation `
      );
    } else {
      await this.fillInput(
        this.selectors.jobTitleForCandidates,
        `Title  for Candidates edit by automation On ${arr[0]} `
      );
    }
    await this.fillInput(this.selectors.emailForCandidatesToReplyTo, arr[1]);
    await this.clickButton(this.selectors.saveAndContinueButton);
    return { title: jobTitle };
  }

  async selectJobTypes(types: string[]) {
    for (const type of types) {
      await this.page
        .locator("li")
        .filter({ hasText: type })
        .locator("span")
        .first()
        .click();
    }

    await this.clickButton(this.selectors.saveAndContinueButton);
  }
  async fillApplicationForms(tabs: string[], edit: boolean = false) {
    for (const tab of tabs) {
      await this.page.getByTestId(tab).click();
      if (!edit) {
        await this.page
          .getByRole("tabpanel")
          .getByTestId("txt-value-select-choose-application-form")
          .click();
        await this.page.waitForTimeout(1000);
        await this.page.waitForLoadState("networkidle");
        const appForm = await this.selectRandomChild(
          this.page.getByTestId(
            "options-container-select-choose-application-form"
          ),
          "li"
        );
        appForm.click();
        await this.page.waitForTimeout(1000);
        await this.page
          .getByRole("tabpanel")
          .getByTestId("txt-value-select-acknowledgment-email")
          .click();
        await this.page.waitForTimeout(1000);
        const ackForm = await this.selectRandomChild(
          this.page.getByTestId(
            "options-container-select-acknowledgment-email"
          ),
          "li"
        );
        ackForm.click();
        await this.page.waitForTimeout(1000);
        await this.page
          .getByRole("tabpanel")
          .getByTestId(
            "txt-value-span-toggle-second-stage-acknowledgment-email"
          )
          .click();
        await this.page.waitForTimeout(1000);
        const twoackForm = await this.selectRandomChild(
          this.page.getByTestId(
            "options-container-span-toggle-second-stage-acknowledgment-email"
          ),
          "li"
        );
        twoackForm.click();
        await this.page.waitForTimeout(1000);
      } else {
        await this.page
          .getByRole("heading", { name: "Do you want to add Assessment" })
          .getByTestId("span-toggle-add-assessment-form")
          .check();
        const xclose = await this.page
          .getByRole("tabpanel")
          .getByTestId("txt-value-select-assessment-formA")
          .isVisible();
        if (!xclose) {
          this.page
            .getByRole("heading", { name: "Do you want to add Assessment" })
            .getByTestId("span-toggle-add-assessment-form")
            .check();
        }
        await this.page
          .getByRole("tabpanel")
          .getByTestId("txt-value-select-assessment-formA")
          .click();
        await this.page.waitForTimeout(1000);
        const assessment = await this.selectRandomChild(
          this.page.getByTestId(this.selectors.assessmentFormAULContainter),
          "li"
        );
        assessment.click();
        await this.page.waitForTimeout(1000);
      }
    }
  }
  async publishJob() {
    test.setTimeout(99000);
    await this.selectOption(this.selectors.jobStatus, "Live");
    await this.page.getByTestId(this.selectors.advertToggle).click();
    await this.page.getByRole("button", { name: "save" }).click();
    await this.page.waitForLoadState("networkidle");
    try {
      await this.page.getByText("×Successfully Saved").waitFor({
        state: "visible",
        timeout: 90000,
      });
    } catch (error) {
      console.error("Success message did not appear within the expected time.");
      throw error;
    }
    let referenceText = "";
    if (await this.page.getByText("×Successfully Saved").isVisible()) {
      referenceText = await this.page.getByText("Job Ref : NDD-").innerText();
      return referenceText.split(":")[1].trim();
    }
    return referenceText.split(":")[1].trim();
  }
  async exitJobCreation() {
    await expect(this.page.getByRole("button", { name: "Exit" })).toBeVisible();
    await this.page.getByRole("button", { name: "Exit" }).click();
  }
  async searchForJob(jobRef: string) {
    await this.fillInput(this.selectors.searchJobInput, jobRef);
    await this.clickButton(this.selectors.searchJobButton);
    await this.page.waitForTimeout(2000);
    return {
      referenceNumber: await this.page
        .getByTestId(this.selectors.tableRowRefereceNum)
        .innerText(),
      jobTitle: await this.page
        .getByTestId(this.selectors.tableRowJobTitle)
        .innerText(),
    };
  }
  private async selectRandomOption(selector: string) {
    const element = this.page.getByTestId(selector);
    await element.click();
    const child = await this.selectRandomChild(element, "li");
    const childInnerText = await child.innerText();
    await child.click();
    return childInnerText;
  }
  private async fillInput(selector: string, value: string) {
    await this.page.getByTestId(selector).fill(value);
  }
  private async clickButton(selector: string) {
    await this.page.getByTestId(selector).click();
  }
  private async selectOption(selector: string, option: string) {
    await this.page.getByTestId(selector).click();
    await this.page
      .getByTestId("available-options-container-select-job-status")
      .getByText(option)
      .click();
  }
  async getCurrentHoursAMinutes(): Promise<string> {
    const currentTime = new Date();

    let hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert 24-hour format to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12;

    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    //const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;

    const timeString = `${hours}:${formattedMinutes}`;
    return timeString;
  }
  async approvalForm(edit: boolean = false) {
    if (!edit) {
      await this.page
        .getByTestId(this.selectors.approvalFormHManagerInput)
        .fill("automation test Manager");
      await this.page.getByTestId(this.selectors.saveAndContinueButton).click();
    } else {
      const time = await this.getCurrentHoursAMinutes();
      await this.page
        .getByTestId(this.selectors.approvalFormHManagerInput)
        .fill(`automation test Managger edited on ${time}`);
      await this.page.getByTestId(this.selectors.saveAndContinueButton).click();
    }
  }
  async jobAccess() {
    await this.page.getByTestId(this.selectors.jobAccess).click();
    const child = await this.selectRandomChild(
      this.page.getByTestId(this.selectors.jobAccessOptions),
      "li"
    );
    const childInnerText = await child.innerText();
    console.log(`${childInnerText} is added to the job Access `);
    await child.click();
    await this.page.getByTestId(this.selectors.saveAndContinueButton).click();
  }

  async jobNotes(edit: boolean = false) {
    if (!edit) {
      await this.page
        .getByTestId(this.selectors.jobNoteSubject)
        .fill("this subject is added when the job is Created");
      await this.page
        .getByTestId(this.selectors.jobNoteDescription)
        .fill("this description is added when the job is Created");
      await this.page.getByTestId(this.selectors.saveButton).click();
    } else {
      const time = await this.getCurrentHoursAMinutes();
      await this.page
        .getByTestId(this.selectors.jobNoteSubject)
        .fill(`this subject is added when the job is Edited on ${time}`);
      await this.page
        .getByTestId(this.selectors.jobNoteDescription)
        .fill(`this description is added when the job is Edited on ${time}`);
      await this.page.getByTestId(this.selectors.saveButton).click();
    }
    await this.page.getByTestId(this.selectors.continueButton).click();
  }
  async searchAndAlerts() {
    await this.page.getByTestId(this.selectors.searchAndAlertCategores).click();
    const Category = await this.selectRandomChild(
      this.page.getByTestId(this.selectors.searchAndAlertCategoresOptions),
      "li"
    );
    const CategoryInnerText = await Category.innerText();
    console.log(`${CategoryInnerText} is added to the Categories`);
    await Category.click();
    await this.page
      .getByTestId(this.selectors.searchAndAlertJobRegions)
      .click();
    const regions = await this.selectRandomChild(
      this.page.getByTestId(this.selectors.searchAndAlertJobRegionsOptions),
      "li"
    );
    const RegionsInnerText = await regions.innerText();
    console.log(`${RegionsInnerText} is added to the Job Regions`);
    await regions.click();
    await this.page.getByTestId(this.selectors.saveAndContinueButton).click();
  }
  async checkTabsVisibility() {
    const visibleTabs: string[] = [];
    await this.page.waitForTimeout(3000);
    // Check if the External tab is visible
    if (await this.page.getByTestId(this.selectors.externalTab).isVisible()) {
      visibleTabs.push(this.selectors.externalTab);
    }

    // Check if the Internal tab is visible
    if (await this.page.getByTestId(this.selectors.internalTab).isVisible()) {
      visibleTabs.push(this.selectors.internalTab);
    }

    // Check if the Agency tab is visible
    if (await this.page.getByTestId(this.selectors.agencyTab).isVisible()) {
      visibleTabs.push(this.selectors.agencyTab);
    }
    return visibleTabs;
  }
}
