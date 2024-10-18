import { Browser, Page, chromium, expect } from "@playwright/test";
import { error, timeLog } from "console";
import exp from "constants";
import SearchPage from "./SearchPage";

// System Settings class
export default class SearchPageJobSearch extends SearchPage {
  page: Page;
  filterSelectors: {
    Recruiter: string;
    Divisions: string;
    Locations: string;
    Regions: string;
    Departments: string;
    Categories: string;
    Job_Levels: string;
    Job_Statuses: string;
    Employment_Types: string;
    Job_Access: string;
    Salaries: string;
    Agencies: string;
    // Add more selectors as needed
  };
  inputButtonSelectors: {
    searchTabToggle: string;
    jobTitle: string;
    jobReference: string;
    jobStatus: string;
    location: string;
    dateFrom: string;
    dateTo: string;
    bulkRecruitmentJob: string;
    searchButton: string;
    JobStatusDropdown: string;
    locationDropdown: string;
    //tableVisibality: string;
  };
  // Class constructor
  constructor(page: Page) {
    super(page);
    this.page = page;
    this.filterSelectors = {
      Recruiter: "a-filter-by-recruiter",
      Divisions: "a-filter-by-divisions",
      Locations: "a-filter-by-locations",
      Regions: "a-filter-by-regions",
      Departments: "a-filter-by-departments",
      Categories: "a-filter-by-categories",
      Job_Levels: "a-filter-by-job-levels",
      Job_Statuses: "a-filter-by-job-statuses",
      Employment_Types: "a-filter-by-employment-types",
      Job_Access: "a-filter-by-job-access",
      Salaries: "a-filter-by-salaries",
      Agencies: "a-filter-by-agencies",
    };
    this.inputButtonSelectors = {
      searchTabToggle: "div-collapse-arrow-up-arrow-down", // Selector to toggle the overall search tab
      jobTitle: "txt-job-title", // Selector for the Job Title input field
      jobReference: "txt-job-reference", // Selector for the Job Reference input field
      jobStatus: "txt-value-select-job-status", // Selector for the Job Status dropdown
      location: "txt-value-select-location", // Selector for the Location input field
      dateFrom: "txt-date-from", // Selector for the Date From input field
      dateTo: "txt-date-to", // Selector for the Date To input field
      bulkRecruitmentJob: "div-bulk-recruitment-job", // Selector for the Bulk Recruitment Job field
      searchButton: "btn-search", // Selector for the Search button
      JobStatusDropdown: "options-container-select-job-status",
      locationDropdown: "available-options-container-select-location",
      // tableVisibality: "btn-search", // Selector for the search results container};
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
