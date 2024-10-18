import { Locator, Page } from "@playwright/test";
// System Settings class
export default class CalenderCreateEvent {
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
    const randomIndex = Math.floor(Math.random() * count);
    // Scroll to the random child and select it
    const randomChild = children.nth(randomIndex);
    await randomChild.scrollIntoViewIfNeeded();
    // this is returning a random child
    return randomChild;
  }

  page: Page;
  selectors: {
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
    saveAndContinueButton: string;
  };
  // Class constructor
  constructor(page: Page) {
    this.page = page;
    this.selectors = {
      eventCreator: "txt-event-creator",
      eventName: "txt-event-name",
      eventType: "txt-value-select-event-type",
      candidatesPerAppointment: "txt-no-of-candidates-per-appointment",
      candidateSelfService: "span-toggle-candidate-self-service",
      inviteEmailStatus: "txt-value-select-which-status-should-prompt",
      candidateStatusAfterBooking:
        "txt-value-select-canidate-status-after-booking",
      bookingCutOffRestriction:
        "txt-value-select-booking-cut-off-restriction",
      assignToACampaign: "txt-value-select-assign-to-campaign",
      isThisEventPrivate: "span-toggle-is-event-private",
      exitButton: "btn-exit",
      saveAndContinueButton: "btn-save-and-continue",
    };
  }

  async selectRandomFromInput(inputTestId: string, parentSelector: Locator) {
    await this.page.getByTestId(inputTestId).click();
    const randomChild = await this.selectRandomChild(parentSelector, "li");
    randomChild.click();
  }

  async toggle(toggle: string) {
    await this.page.getByTestId(toggle).click();
  }
}
