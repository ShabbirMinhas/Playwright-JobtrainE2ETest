import { Browser, Locator, Page, chromium, expect } from "@playwright/test";
// System Settings class
export default class CalenderEventSearch {
  getSelectors() {
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
    //await randomChild.click();
    return randomChild;
  }

  page: Page;
  selectors: {
    eventName: string;
    eventLocation: string;
    startDate: string;
    archived: string;
    jobTitle: string;
    jobReference: string;
    eventCreater: string;
    eventInterviewer: string;
    eventUser: string;
    candidateName: string;
    searchButton: string;
    searchSection: string;
    searchArrowButton: string;
    eventLocationDropdown: string;
    eventUserDropdown: string;
    eventCreaterDropdown: string;
    eventInterviewerDropdown: string;
  };
  // Class constructor
  constructor(page: Page) {
    this.page = page;
    this.selectors = {
      eventName: "txt-event-name",
      eventLocation: "txt-value-location",
      startDate: "txt-start-date",
      archived: "select-archieved",
      jobTitle: "txt-job-title",
      jobReference: "txt-job-reference",
      eventCreater: "txt-value-creator",
      eventInterviewer: "txt-value-interviewer",
      eventUser: "txt-value-user",
      candidateName: "txt-candidate-name",
      searchButton: "btn-search",
      searchSection: "div-form-search",
      searchArrowButton: "div-collapse-arrow-up-arrow-down",
      eventLocationDropdown: "available-options-container-location",
      eventUserDropdown: "options-container-user",
      eventCreaterDropdown: "options-container-creator",
      eventInterviewerDropdown: "options-container-interviewer",
    };
  }

  async verifySearchExpandAndCollapse() {
    const searchSection = this.page.getByTestId(this.selectors.searchSection);
    const collapseArrow = this.page.getByTestId(
      this.selectors.searchArrowButton
    );
    const inputSection = this.page.getByText(
      "Event NameEvent Location Start Date ArchivedYesNoJob TitleJob ReferenceEvent"
    );
    await expect(inputSection).not.toBeVisible();
    await expect(searchSection).toBeVisible();
    await collapseArrow.click();
    await expect(inputSection).toBeVisible();
    await collapseArrow.click();
    await expect(searchSection).toBeVisible();
    await collapseArrow.click();
  }

  async searchByEventName(eventName: string) {
    await this.page.getByTestId(this.selectors.eventName).fill(eventName);
    await this.page.getByTestId(this.selectors.searchButton).click();
  }

  async VerifyAndsearchByEventLocation(eventLocation: string) {
    await this.page.getByTestId(this.selectors.eventLocation).click();
    const parent = await this.page.getByTestId(
      this.selectors.eventLocationDropdown
    );
    // this parent is ul know click on its child based on event location
    await parent.locator(`li:has-text("${eventLocation}")`).click();
    await expect(
      this.page.getByTestId(this.selectors.eventLocation)
    ).toHaveValue(eventLocation);
    await this.page.getByTestId(this.selectors.searchButton).click();
  }

  async SearchByStartDate(startDate: string) {
    await this.page.getByTestId(this.selectors.startDate).fill(startDate);
    await this.page.getByTestId(this.selectors.searchButton).click();
  }
  async searchByArchivedFilter() {
    await this.page.getByTestId(this.selectors.archived).selectOption("1"); // select yes
    await this.page.getByTestId(this.selectors.searchButton).click();
  }

  async searchByJobTitleAndReference(jobTitle: string, reference: string) {
    await this.page.getByTestId(this.selectors.searchArrowButton).click();
    await this.page.getByTestId(this.selectors.jobTitle).fill(jobTitle);
    await this.page.getByTestId(this.selectors.jobReference).fill(reference);
    await this.page.getByTestId(this.selectors.searchButton).click();
  }

  async verifyAndSearchByEventUser(eventUser: string) {
    await this.page.getByTestId(this.selectors.eventUser).click();
    const parent = await this.page.getByTestId(
      this.selectors.eventUserDropdown
    );
    // this parent is ul know click on its child based on event location
    await parent.locator(`li:has-text("${eventUser}")`).click();
    await expect(this.page.getByTestId(this.selectors.eventUser)).toHaveValue(
      eventUser
    );
    await this.page.getByTestId(this.selectors.searchButton).click();
  }

  async searchByEventCreaterAndInterviewer(
    eventCreater: string,
    eventInterviewer: string
  ) {
    await this.page.getByTestId(this.selectors.searchArrowButton).click();
    await this.page.waitForTimeout(1000);
    await this.page.waitForLoadState("networkidle");
    await this.page.getByTestId(this.selectors.eventCreater).click();
    await this.page.waitForTimeout(1000);
    await this.page.waitForLoadState("networkidle");
    const parent = await this.page.getByTestId(
      this.selectors.eventCreaterDropdown
    );
    // this parent is ul know click on its child based on event location
    await parent.locator(`li:has-text("${eventCreater}")`).click();
    await this.page.waitForTimeout(1000);
    await this.page.waitForLoadState("networkidle");
    await expect(
      this.page.getByTestId(this.selectors.eventCreater)
    ).toHaveValue(eventCreater);
    await this.page.getByTestId(this.selectors.eventInterviewer).click();
    await this.page.waitForTimeout(1000);
    await this.page.waitForLoadState("networkidle");
    const eventInterviewerparent = await this.page.getByTestId(
      this.selectors.eventInterviewerDropdown
    );
    // this parent is ul know click on its child based on event location
    await eventInterviewerparent
      .locator(`li:has-text("${eventInterviewer}")`)
      .click();
    // wait for network ideal
    await this.page.waitForLoadState("networkidle");
    await expect(
      this.page.getByTestId(this.selectors.eventInterviewer)
    ).toHaveValue(eventInterviewer);
    await this.page.getByTestId(this.selectors.searchButton).click();
    await this.page.waitForTimeout(1000);
    await this.page.waitForLoadState("networkidle");
  }

  async searchCandidateName(candidateName: string) {
    await this.page.getByTestId(this.selectors.searchArrowButton).click();
    await this.page
      .getByTestId(this.selectors.candidateName)
      .fill(candidateName);
    await this.page.getByTestId(this.selectors.searchButton).click();
  }
}
