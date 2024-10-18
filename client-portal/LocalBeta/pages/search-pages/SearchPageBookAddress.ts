import { Browser, Page, chromium, expect } from "@playwright/test";
import { error, timeLog } from "console";
import exp from "constants";
import SearchPage from "./SearchPage";

// System Settings class
export default class SearchPageBookAddress {
  page: Page;
  inputButtonSelectors: {
    SearchButton: string;
    Name: string;
    Email: string;
    Job_Title: string;
    Location: string;
  };
  // Class constructor
  constructor(page: Page) {
    this.page = page;
    this.inputButtonSelectors = {
      SearchButton: "btn-search",
      Name: "txt-name",
      Email: "txt-email",
      Job_Title: "txt-job-title",
      Location: "txt-location",
    };
  }
  async getInputButtonSelectors() {
    return this.inputButtonSelectors;
  }
}
