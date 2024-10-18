import { test, expect, Page } from "@playwright/test";
import { defineConfig, devices } from "@playwright/test";
import fs from "fs";
//import { ExcelRow } from "../utils/excelUtils";

// Import necessary modules
import { log } from "console";
import ExcelJS from "exceljs";
import path from "path";
import exp from "constants";
import ExcelUtils from "../../utils/excelUtils";
import SearchPage from "../../pages/search-pages/SearchPage";
import { Helpers } from "../../utils/helpers";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// variable to hold data, initialized as 'any' type.
type TableRow = { [key: string]: any };

let systemSettingsData: TableRow[];

// Use the saved state to load the authenticated session
test.use({ storageState: "state.json" });

test.beforeAll(async () => {
  // loginData = await (ExcelUtils.readData('D:\\JobTrain Documents\\JobtrainData.xlsx', 'LoginData'));
  systemSettingsData = await ExcelUtils.readData(
    "utils/JobtrainData.xlsx",
    "SystemSettingsData"
  );
});
test.beforeEach(async ({ page }) => {
  await page.goto("Search/Index", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("networkidle");
});

test("navigate to search page", async ({ page }) => {
  const search = new SearchPage(page);
  await page.waitForLoadState("networkidle");
  await (await search.navigateToSearchLink()).click();
  await page.waitForLoadState("networkidle");
  await Helpers.takeScreenshot(page, "search page home ");
});
test("navigate to search Job", async ({ page }) => {
  const search = new SearchPage(page);
  await (await search.openSearchJobs()).click();
  await page.waitForLoadState("networkidle");
  await Helpers.takeScreenshot(page, "search jobs ");
});
test("navigate to Search Candidates", async ({ page }) => {
  const search = new SearchPage(page);
  await (await search.openSearchCandidates()).click();
  await page.waitForLoadState("networkidle");
  await Helpers.takeScreenshot(page, "search candidates ");
});
test("navigate to candidate keyword search", async ({ page }) => {
  const search = new SearchPage(page);
  await (await search.openSearchCandidates()).click();
  await page.waitForLoadState("networkidle");
  await Helpers.takeScreenshot(page, "candidate keyword search");
});
test("navigate to Saved Searh", async ({ page }) => {
  const search = new SearchPage(page);
  await (await search.openSearchCandidates()).click();
  await page.waitForLoadState("networkidle");
  await Helpers.takeScreenshot(page, "saved search");
});
test("navigate to search Talent", async ({ page }) => {
  const search = new SearchPage(page);
  await (await search.openSearchTalent()).click();
  await page.waitForLoadState("networkidle");
  await Helpers.takeScreenshot(page, "search talent");
});
test("navigate to internal address book search", async ({ page }) => {
  const search = new SearchPage(page);
  await (await search.openSearchCandidates()).click();
  await page.waitForLoadState("networkidle");
  await Helpers.takeScreenshot(page, "internal address book search");
});
