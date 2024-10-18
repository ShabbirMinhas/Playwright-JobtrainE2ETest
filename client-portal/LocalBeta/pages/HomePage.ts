/**
 * File: HomePage.ts
 * Author: Shabbir Minhas
 * Date: May 28, 2024
 *
 * Description:
 * This file defines the Home Page class, which implements the Page Object Model (POM) pattern.
 * The Home Page class encapsulates all interactions and elements related to the home/landing
 *  page functionality of the application.
 *
 * Classes:
 *   HomePage:
 *     Description: Encapsulates interactions and elements related to the home page functionality.
 *     Author: Shabbir Minhas
 *
 * Usage:
 * import HomePage from "../pages/HomePage";
 * import { Helpers } from "../utils/helpers";
 * const home = new HomePage(page);
 * ;
 */

import { Browser, Page, chromium, expect } from "@playwright/test";
import { Helpers } from "../utils/helpers";
import { TIMEOUT } from "dns";
import { link } from "fs";
import exp from "constants";
//import { checkPrime } from "crypto";
//import { url } from "inspector";

// HomePage class
export default class HomePage {
  page: Page;
  // homeTab='Home'//getByID
  // Define the selectors object
  selectors: {
    topNavBarulList: string;
    homeTab: string;
    jobsTab: string;
    quickLinkButton: string;
    quickLinkNavButton: string;
    quickLinkDiv: string;
    homeTilesSection: string;
    homeTilesList: string;
    homeJobsAdvertised: string;
    homeSearchDiv: string;
    homeSearchCandidate: string;
    homeSearchJobs: string;
    homeSearchButton: string;
    addNotes: string;
    addNewNotes: string;
    homePageBottomRow: string;
    notesTitleInputField: string;
    notesContentTextArea: string;
    notesDatePicker: string;
    notesSaveButton: string;
    deleteNotesDiv: string;
    deleteNote: string;

    // Add more selectors as needed
  };
  // Class constructor
  constructor(page: Page) {
    this.page = page;
    this.selectors = {
      homeTab: "btn-home-home", // Use getByTestId
      topNavBarulList: "header-home-ul", // Use getByTestId
      jobsTab: "btn-home-jobs", // Use getByTestId
      quickLinkButton: "btn-home-header-left-menu", // Use getByTestId
      quickLinkNavButton: "LeftSideMenu", // Use getByTestId
      homeSearchDiv: ".input-group.home_search",
      homeSearchCandidate: "Search for Candidates", //Use getByPlaceholder
      homeSearchJobs: "", //Use getByPlaceholder
      homeSearchButton: "btn-home-search",
      quickLinkDiv: "quick-nav", // Use getByTestId
      homePageBottomRow: ".row.bottom-card-row", // Use getByClass'
      addNotes: " New Task ",
      addNewNotes: ".btn.btn-outline-dark.btn-sm.pull-right.mr-3", //user getByClass
      // homeSearchInputBox: 'Search for Jobs',//Use getByRole(textbox)
      notesTitleInputField: "Please enter the title here ...", //Use getByPlaceholder
      notesContentTextArea: "Please enter the content of the task here ...", //Use getByPlaceholder
      notesDatePicker: "txt-null", // Use getByTestId
      notesSaveButton: "Save", // Use getByRole(button)
      deleteNotesDiv: "accordionExample",
      deleteNote: "remove",
      homeTilesSection: "home-page-statistics",
      homeTilesList: "home-page-statistics-ul",
      homeJobsAdvertised: "btn-jobs-advertised",
      // Use getByRole (Link)
      // Use getByText
    };
  }
  //Navigation to the login page
  async navigateToHomePage(url: string) {
    await this.page.goto(url);
  }
  async homeTab() {
    return await this.page.getByTestId(this.selectors.homeTab);
  }
  async jobTab() {
    return await this.page.getByTestId(this.selectors.jobsTab);
  }

  async allBrokenLinksVerification() {}
  async getAllLinksFromPage(page: Page): Promise<Set<string>> {
    // Get all links from the page
    const links = await page.locator("a");
    const allLinks = await links.all();

    const allValidHrefs = new Set<string>();

    for (const link of allLinks) {
      try {
        const href = await link.getAttribute("href");

        if (href) {
          if (href.startsWith("javascript:")) {
            console.log(`Skipping JavaScript link: ${href}`);
            continue;
          }

          const fullUrl = new URL(href, page.url()).href;
          allValidHrefs.add(fullUrl);
        } else {
          console.warn("Found a link without href attribute");
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Error processing link: ${error.message}`);
        } else {
          console.error(`Error processing link: ${String(error)}`);
        }
      }
    }

    console.log(`Found ${allValidHrefs.size} valid links`);
    return allValidHrefs;
  }

  async tilesLinksVerification() {
    const tileslistItem = await this.page.getByTestId(
      this.selectors.homeTilesList
    );
    // Locate all child <a> tags within the <ul>
    const liTags = await tileslistItem.locator("li");
    const count = await liTags.count();
    await expect(count).toBeGreaterThan(0);
    // Optionally, perform actions or assertions on each anchor tag
    for (let i = 0; i < count; i++) {
      const li = liTags.nth(i);
      const tileHeading = await li.locator("p").innerText();
      await expect(li).not.toBeNull();
      await li.click();
      await this.page.waitForLoadState("networkidle");
      await this.page.waitForTimeout(1000);
      await Helpers.takeScreenshot(this.page, tileHeading);
      await console.log(tileHeading);
      this.page.goBack();
      await this.page.waitForLoadState("networkidle");
      // Optional: Validate that you are back on the expected page
      await this.page.waitForSelector(
        '[data-testid="home-page-statistics-ul"]',
        { timeout: 5000 }
      ); // Adjust the selector and timeout as needed
    }
  }

  async jobSearchFormVerification() {
    const homeSearchForm = await this.page
      .locator(this.selectors.homeSearchDiv)
      .locator(">*");
    await homeSearchForm.first().fill("A*");
    const homeSearchOptionss = await homeSearchForm.nth(2).locator(">*");
    await homeSearchOptionss.first().selectOption({ value: "0: ForJobs" });
    await homeSearchOptionss.nth(1).click();
    await expect(this.page).toHaveTitle("Job Search");
    const count = await homeSearchForm.count();
    for (let i = 0; i < count; i++) {
      const element = await homeSearchForm.nth(i);
      const tagName = await element.evaluate((node) =>
        node.tagName.toLowerCase()
      );

      let innerText = "";
      try {
        innerText = await element.innerText();
      } catch (e) {
        console.log(`Error getting innerText for child ${i}:`, e);
      }

      console.log(`Child ${i} tag name: ${tagName}, innerText: ${innerText}`);
    }

    return homeSearchForm;
  }

  async searchTypeJobs() {
    await this.page.locator("#searchType").selectOption("Search Jobs");
    //         await page.getByPlaceholder('Username').fill('jtadmin_new');

        //   await page.getByPlaceholder('Password').fill('21ClientT@');

    //   await page.goto('https://beta.jobtrain.co.uk/client/Home');
  }

  async searchTypeCondidates() {
    return await this.page.locator("#searchType").selectOption("Candidates");
  }
  async searchForCandiateInputBox() {
    return await this.page.getByTestId("txt-search-by-job-and-candidate");
  }

  async searchForJobsInputBox() {
    return await this.page.getByTestId("txt-search-by-job-and-candidate");
  }
  async clickSearchButton() {
    await this.page.getByRole("button", { name: "Search" }).click();
  }
  async addNewNotes() {
    this.page
      .getByRole("button", { name: this.selectors.addNotes })
      .waitFor({ state: "visible" });
    await this.page
      .getByRole("button", {
        name: this.selectors.addNotes,
      })
      .click();
  }
  async clickTitleAtNotes() {
    return await this.page.getByPlaceholder(
      this.selectors.notesTitleInputField
    );
  }

  async fillNotesTitle() {
    return await this.page.getByRole("textbox", {
      name: this.selectors.notesTitleInputField,
    });
  }
  async fillNotesContents() {
    return await this.page.getByRole("textbox", {
      name: this.selectors.notesContentTextArea,
    });
  }
  async notesDatePicker() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = today.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    console.log(formattedDate);
    this.page.getByTestId(this.selectors.notesDatePicker).click();
    //await this.page.getByPlaceholder(this.selectors.notesDatePicker).click()
    await this.page
      .getByTestId(this.selectors.notesDatePicker)
      .fill(formattedDate);
  }
  async notesSaveButton() {
    await this.page
      .getByRole("button", { name: this.selectors.notesSaveButton })
      .click();
  }
  async notesAlertVerification() {
    await this.page
      .getByRole("button", { name: this.selectors.notesSaveButton })
      .click();
  }

  async addNotesUsingIndexesOfTheControls() {
    //return  await this.page.getByRole('button',{name:this.selectors.addNotes});
    // return await this.page.locator(this.selectors.homePageMainDiv);
  }

  async deleteNotes() {
    const allNotes = await this.page
      .getByTestId(this.selectors.deleteNotesDiv)
      .locator(">*");
    const noOfNotesAdded = await allNotes.count();
    console.log(noOfNotesAdded);
    for (let i = 0; i < noOfNotesAdded; i++) {
      const element = allNotes.nth(i);
      const tagName = await element.evaluate((node) =>
        node.tagName.toLowerCase()
      );
      console.log(`Element ${i}: ${tagName}`);

      let innerText = "";
      try {
        innerText = await element.innerText();
      } catch (e) {
        console.log(`Error getting innerText for child ${i}:`, e);
      }

      console.log(`Child ${i} tag name: ${tagName}, innerText: ${innerText}`);
    }
    return allNotes;
  }

  async editNotes() {
    const allNotes = await this.page
      .getByTestId(this.selectors.deleteNotesDiv)
      .locator(">*");
    const noOfNotesAdded = await allNotes.count();
    console.log(noOfNotesAdded);
    for (let i = 0; i < noOfNotesAdded; i++) {
      const element = allNotes.nth(i);
      const tagName = await element.evaluate((node) =>
        node.tagName.toLowerCase()
      );
      console.log(`Element ${i}: ${tagName}`);

      let innerText = "";
      try {
        innerText = await element.innerText();
      } catch (e) {
        console.log(`Error getting innerText for child ${i}:`, e);
      }

      console.log(`Child ${i} tag name: ${tagName}, innerText: ${innerText}`);
    }
    return allNotes;
  }

  async deleteNote() {
    return await this.page.getByTestId(this.selectors.deleteNote);
  }

  async addNotesDialogVerification() {
    TIMEOUT: 3000;
    await this.addNewNotes();
    TIMEOUT: 3000;
    const allChildren = await this.page
      .getByTestId("div-appointment-date-time-form")
      .locator("*");
    return allChildren;
  }
  async homePageMainScreenControlsVerification() {
    return await this.page.locator("#main div");
  }

  async quickLinksSectionVerification() {
    const quickLinkMainDiv = await this.page
      .getByTestId(this.selectors.quickLinkDiv)
      .locator(".scrollbar");
    const quickLinkDiv = await quickLinkMainDiv.locator(".force-overflow");
    const quickLinkAllElements = await quickLinkDiv.locator(">*");
    // Get the count of all direct children
    const elementCount = await quickLinkAllElements.count();
    for (let i = 0; i < elementCount; i++) {
      const element = quickLinkAllElements.nth(i);
      const tagName = await element.evaluate((node) =>
        node.tagName.toLowerCase()
      );
      console.log(`Element ${i}: ${tagName}`);
    }

    return quickLinkAllElements;
  }

  async quickLinkButton() {
    const quickLinkMainDiv = await this.page
      .getByTestId(this.selectors.quickLinkDiv)
      .locator(".scrollbar");
    const quickLinkDiv = await quickLinkMainDiv.locator(".force-overflow");
    const quickLinkAllElements = await quickLinkDiv.locator(">*");
    return quickLinkAllElements;
  }

  async homePageBottomRow() {
    const landingPageBottomRow = await this.page.locator(
      this.selectors.homePageBottomRow
    );
  }

  async homePage() {
    const landingPageBottomRow = await this.page.locator(
      this.selectors.homePageBottomRow
    );
  }
}
