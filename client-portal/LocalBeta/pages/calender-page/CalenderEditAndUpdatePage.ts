import { Browser, Locator, Page, chromium, expect } from "@playwright/test";
export default class CalenderEditAndUpdatePage {
  async getSelectors() {
    return this.selectors;
  }
  page: Page;
  selectors: {
    tableHeader: string;
    subjectHeader: string;
    startDateHeader: string;
    selfServiceHeader: string;
    appointmentTypeHeader: string;
    locationHeader: string;
    tableShowingResults: string;
    tableInputPageSize: string;
    firstPageButton: string;
    lastPageButton: string;
    previousButton: string;
    nextButton: string;
    eventCreator: string;
    eventName: string;
    eventType: string;
    candidatesPerAppointment: string;
    candidateSelfService: string;
    inviteEmailStatus: string;
    candidateStatusAfterBooking: string;
    bookingCutOffRestriction: string;
    assignToACampaign: string;
    isThisEventPrivate: string;
    exitButton: string;
    dateAndTimeTableRow: string;
    interviewLocation: string;
    startDate: string;
    saveButton: string;
    ulContainer: string;
    saveAndContinueButton: string;
  };

  constructor(page: Page) {
    this.page = page;
    this.selectors = {
      tableHeader: "div-theader-null",
      subjectHeader: "div-theader-name-Subject",
      startDateHeader: "div-theader-name-StartDate",
      selfServiceHeader: "div-theader-name-CandidateAction",
      appointmentTypeHeader: "div-theader-name-SYSTEMAPPOINTMENTTYPE",
      locationHeader: "div-theader-name-LOCATIONNAME",
      tableShowingResults: "div-showing-results-null",
      tableInputPageSize: "select-page-size-null",
      firstPageButton: "li-first-page-null",
      lastPageButton: "li-last-page-null",
      previousButton: "li-previous-pagenull",
      nextButton: "li-next-page-null",
      eventCreator: "txt-event-creator",
      eventName: "txt-event-name",
      eventType: "txt-value-select-event-type",
      candidatesPerAppointment: "txt-no-of-candidates-per-appointment",
      candidateSelfService: "span-toggle-candidate-self-service",
      inviteEmailStatus: "txt-value-select-which-status-should-prompt",
      candidateStatusAfterBooking:
        "txt-value-select-canidate-status-after-booking",
      bookingCutOffRestriction: "txt-value-select-booking-cut-off-restriction",
      assignToACampaign: "txt-value-select-assign-to-campaign",
      isThisEventPrivate: "span-toggle-is-event-private",
      exitButton: "btn-exit",
      dateAndTimeTableRow: "a-tab-title-tab-new-calendar-entry",
      interviewLocation: "txt-value-",
      startDate: "txt-btn-start-date",
      saveButton: "btn-save",
      ulContainer: "options-container-select-interview-location",
      saveAndContinueButton: "btn-save-and-continue",
    };
  }

  async trimTheWhiteSpace(text: string) {
    if (text) {
      const trimmedText = text.trim();
      const parts = trimmedText.split(/\s+/);
      text = parts.slice(1).join(" ");
      return text;
    } else {
      // throw an error
      throw new Error("Text is null or undefined");
    }
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

  async getTextContent(testId: string): Promise<string> {
    const element = this.page.getByTestId(testId);
    const text = await element.textContent();
    return text ? text.trim() : "";
  }

  async additionalEdits(selectors: any) {
    await this.page.locator("#nav-link-2").click();
    await this.page.locator("#edit").first().click();

    // Select random interview location
    await this.page.getByTestId("txt-value-select-interview-location").click();
    const child = await this.selectRandomChild(
      await this.page.getByTestId(selectors.ulContainer),
      "li"
    );
    await this.page.waitForLoadState("networkidle");
    child.click();
    await this.page.waitForLoadState("networkidle");

    // Set new start date
    const newStartDate = "19/9/2024";
    await this.page.getByTestId("txt-btn-start-date").fill(newStartDate);

    // Get selected interview location for later assertion
    const selectedLocation = this.page
      .getByTestId("txt-value-select-interview-location")
      .inputValue();

    await this.page.getByTestId(selectors.saveButton).click();
    await this.page.waitForLoadState("networkidle");

    // Return the new data for assertions
    return { newStartDate, selectedLocation };
  }

  async verifyChanges(randomIndex: number, originalData: any) {
    const updatedData = {
      subject: await this.getTrimmedTextContent(
        `div-tbl-row-data-cell-${randomIndex}-Subject`
      ),
      startDate: await this.getTrimmedTextContent(
        `div-tbl-row-data-cell-${randomIndex}-StartDate`
      ),
      selfService: await this.getTrimmedTextContent(
        `div-tbl-row-data-cell-${randomIndex}-CandidateAction`
      ),
      location: await this.getTrimmedTextContent(
        `div-tbl-row-data-cell-${randomIndex}-LOCATIONNAME`
      ),
    };

    expect(updatedData.subject).toBe("Automation Updated Event Name");
    expect(updatedData.startDate).toBe("19/09/2024");
    expect(updatedData.selfService).not.toBe(originalData.selfService);
    expect(updatedData.location).not.toBe(originalData.location);
  }

  async editEvent(selectors: any, randomIndex: number, originalData: any) {
    // Click on the random row
    await this.page.click(`.table_row >> nth=${randomIndex}`);
    await this.page.waitForLoadState("networkidle");

    // Wait for the edit form to appear and verify initial data
    await this.page
      .getByTestId(selectors.eventName)
      .waitFor({ state: "visible" });
    await this.page.waitForLoadState("networkidle");
    const initialEventName = await this.page
      .getByTestId(selectors.eventName)
      .inputValue();
    await this.page.waitForTimeout(2000);
    await this.page.waitForLoadState("networkidle");
    expect(initialEventName.trim()).toBe(originalData.subject);

    // Make changes
    const newEventName = "Automation Updated Event Name";
    await this.page.getByTestId(selectors.eventName).fill(newEventName);
    await this.page.getByTestId(selectors.candidateSelfService).click();

    // Save initial changes
    await this.page.getByTestId(selectors.saveAndContinueButton).click();
    await this.page.waitForLoadState("networkidle");

    // Additional edits
    await this.additionalEdits(selectors);

    // Final save and exit
    await this.page.getByTestId(selectors.saveAndContinueButton).click();
    await this.page.waitForLoadState("networkidle");
    await this.page.getByRole("button", { name: "Exit" }).click();
    await this.page.waitForTimeout(1000); // Wait for the table to update
  }
  async selectRandomRowAndGetData() {
    const rows = await this.page.$$(".table_row");
    // Math.floor(Math.random() * (rows.length - 1)) + 1;
    const randomIndex = 2;

    const originalData = {
      subject: await this.getTrimmedTextContent(
        `div-tbl-row-data-cell-${randomIndex}-Subject`
      ),
      startDate: await this.getTrimmedTextContent(
        `div-tbl-row-data-cell-${randomIndex}-StartDate`
      ),
      selfService: await this.getTrimmedTextContent(
        `div-tbl-row-data-cell-${randomIndex}-CandidateAction`
      ),
      location: await this.getTrimmedTextContent(
        `div-tbl-row-data-cell-${randomIndex}-LOCATIONNAME`
      ),
    };

    return { randomIndex, originalData };
  }

  private async getTrimmedTextContent(testId: string): Promise<string> {
    const content = await this.page.getByTestId(testId).textContent();
    return content ? await this.trimTheWhiteSpace(content) : " ";
  }
}
