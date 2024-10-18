import { Browser, Page, chromium, expect } from "@playwright/test";
import { error, timeLog } from "console";
import exp from "constants";
import SearchPage from "./SearchPage";

// System Settings class
export default class SearchPageCandidateSearch extends SearchPage {
  page: Page;
  filterSelectors: {
    School_Region: string;
    Categories: string;
    Employment_Types: string;
    Salaries: string;
    Agencies: string;
    Job_Status: string;
    Select_a_Job: string;
    Divisions: string;
    Skills: string;
    Departments: string;
  };
  inputButtonSelectors: {
    SearchButton: string;
    searchTabToggle: string;
    Applicationfrom: string;
    Applicationto: string;
    FirstName: string;
    ApplicationStatuses: string;
    LastName: string;
    Joblocation: string;
    Phone: string;
    Mobile: string;
    Email: string;
    ApplicationNo: string;
    CandidateNo: string;
    CandidateType: string;
    Enterpostcode: string;
    AppStatusDropdown: string;
    JobLocationDropdown: string;
    CandidateTypeDropdown: string;
    //tableVisibality: string;
  };
  // Class constructor
  constructor(page: Page) {
    super(page);
    this.page = page;
    this.filterSelectors = {
      School_Region: "a-filter-by-school-region",
      Categories: "a-filter-by-categories",
      Employment_Types: "a-filter-by-employment-types",
      Salaries: "a-filter-by-salaries",
      Agencies: "a-filter-by-agencies",
      Job_Status: "a-filter-by-job-status",
      Select_a_Job: "a-filter-by-select-a-job",
      Divisions: "a-filter-by-divisions",
      Skills: "a-filter-by-skills",
      Departments: "a-filter-by-departments",
      // Add more selectors as needed
    };

    this.inputButtonSelectors = {
      SearchButton: "btn-search",
      searchTabToggle: "div-collapse-arrow-up-arrow-down",
      Applicationfrom: "txt-application-from",
      Applicationto: "txt-application-to",
      FirstName: "txt-first-name",
      ApplicationStatuses: "txt-value-select-application-statuses",
      LastName: "txt-last-name",
      Joblocation: "txt-value-select-job-location",
      Phone: "txt-phone",
      Mobile: "txt-mobile",
      Email: "txt-email",
      ApplicationNo: "txt-application-no",
      CandidateNo: "txt-candidate-no",
      CandidateType: "txt-value-select-candidate-type",
      Enterpostcode: "txt-enter-postcode",
      AppStatusDropdown: "options-container-select-application-statuses",
      JobLocationDropdown: "options-container-select-job-location",
      CandidateTypeDropdown: "options-container-select-candidate-type",
      // tableVisibality: "btn-search",
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
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(1000);
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
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(1000);
    const parentSelector = this.page.getByTestId(
      "options-container-filter-by-" + output.toLowerCase()
    );
    const randomChildClick = await this.selectRandomChild(parentSelector, "li");
    await randomChildClick.click();
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
