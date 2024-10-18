import test, { expect, Locator, Page, Selectors } from "@playwright/test";
// System Settings class
export default class SearchReportPages {
  page: Page;
  selectors: {
    searchFilterButton: string;
    createdbyInput: string;
    createdbyContainer: string;
    reportTypeInput: string;
    reportTypeContainer: string;
    dataSourceInput: string;
    dataSourceContainer: string;
    createdFromInput: string;
    createdToInput: string;
    searchButton: string;
  };
  constructor(page: Page) {
    this.page = page;
    this.selectors = {
      searchFilterButton: "btn-search-filter",
      createdbyInput: "txt-value-select-created-by",
      createdbyContainer: "options-container-select-created-by",
      reportTypeInput: "txt-value-select-report-type",
      reportTypeContainer: "available-options-container-select-report-type",
      dataSourceInput: "txt-value-select-data-source",
      dataSourceContainer: "available-options-container-select-data-source",
      createdFromInput: "txt-created-from",
      createdToInput: "txt-created-to",
      searchButton: "btn-search",
    };
  }
  async openSearchTab() {
    await this.page.getByTestId(this.selectors.searchFilterButton).click();
    // when parent data-testid is given then we will test the visibility
    await this.page.waitForSelector("form", { state: "visible" });
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
  async getSelectors() {
    return this.selectors;
  }
  async selectRandomCreatedByValue() {
    await this.page.getByTestId(this.selectors.createdbyInput).click();
    (
      await this.selectRandomChild(
        this.page.getByTestId(this.selectors.createdbyContainer),
        "li"
      )
    ).click();
    await this.page.waitForTimeout(2000);
  }

  async selectRandomReportTypeValue() {
    await this.page.getByTestId(this.selectors.reportTypeInput).click();
    (
      await this.selectRandomChild(
        this.page.getByTestId(this.selectors.reportTypeContainer),
        "li"
      )
    ).click();
    await this.page.waitForTimeout(2000);
  }
  async selectRandomDatasourceValue() {
    await this.page.getByTestId(this.selectors.dataSourceInput).click();
    (
      await this.selectRandomChild(
        this.page.getByTestId(this.selectors.dataSourceContainer),
        "li"
      )
    ).click();
    await this.page.waitForTimeout(2000);
  }
}
