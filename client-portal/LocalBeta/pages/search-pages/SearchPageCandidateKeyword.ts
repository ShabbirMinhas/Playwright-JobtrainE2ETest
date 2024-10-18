import { Browser, Page, chromium, expect } from "@playwright/test";
import { error, timeLog } from "console";
import exp from "constants";
import SearchPage from "./SearchPage";

// System Settings class
export default class SearchPageCandidateKeyword extends SearchPage {
  page: Page;
  filterSelectors: {
    Location: string;
    Regions: string;
    Categories: string;
    Employment_Types: string;
    Salaries: string;
  };
  inputButtonSelectors: {
    Keywords: string;
    Enter_postCode: string;
    SearchButton: string;
  };
  // Class constructor
  constructor(page: Page) {
    super(page);
    this.page = page;
    this.filterSelectors = {
      Location: "a-filter-by-location",
      Regions: "a-filter-by-regions",
      Categories: "a-filter-by-categories",
      Employment_Types: "a-filter-by-employment-types",
      Salaries: "a-filter-by-salaries",
    };

    this.inputButtonSelectors = {
      Keywords: "txt-keywords",
      Enter_postCode: "txt-enter-post-code",
      SearchButton: "btn-search",
    };
  }
  // Function to test expanding and collapsing of filters
  testFilterToggle = async (
    filterName: string,
    selector: string,
    filterSearchName: string = "txt-value-filter-by-"
  ) => {
    // Click to expand
    await this.page.getByTestId(selector).click();
    const output = this.replaceUnderscoreWithHyphen(filterName);
    // await delay here if needed
    let expanded = await this.page
      .getByTestId("txt-value-filter-by-" + output.toLowerCase())
      .isVisible();
    // if false it means that after the click its not expanded thats why once again click and check visibility again
    if (!expanded) {
      await this.page.getByTestId(selector).click();
      expanded = await this.page
        .getByTestId("txt-value-filter-by-" + output.toLowerCase())
        .isVisible();
    }
    expect(expanded).toBeTruthy();
    // after verification of the visibility we click the element
    await this.page
      .getByTestId(filterSearchName + output.toLowerCase())
      .click();
    const parentSelector = this.page.getByTestId(
      "options-container-filter-by-" + output.toLowerCase()
    );
    const andomChildClick = await this.selectRandomChild(parentSelector, "li");
    await andomChildClick.click();
  };

  getFilterSelectors() {
    return this.filterSelectors;
  }

  getInputButtonSelectors() {
    return this.inputButtonSelectors;
  }
  replaceUnderscoreWithHyphen(input: string): string {
    return input.replace(/_/g, "-");
  }

  convertKey(key: string): keyof typeof this.filterSelectors {
    return key.replace(/ /g, "_") as keyof typeof this.filterSelectors;
  }
}
