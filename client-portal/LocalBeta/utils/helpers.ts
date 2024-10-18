/**
 * File: helpers.ts
 * Author: Shabbir Minhas
 * Date:
 *
 * Description:
 * This file contains helper functions that can be used across the project.
 *
 * Classes/Functions:
 *   takeScreenshot:
 *     Description: Takes a screenshot of the current page.
 *     Author: Shabbir
 *
 * Usage:
 * import { takeScreenshot } from "../utils/helpers";
 * await takeScreenshot(page, 'example-page');
 */

import { expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import { Page } from "playwright";
import { fileURLToPath } from "url";
// Recreate __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/**
 * Helpers class containing utility functions for the project.
 */
export class Helpers {
  private static page: Page;

  static intializePage(page: Page) {
    Helpers.page = page;
  }
  /**
   * Takes a screenshot and saves it in a dated folder.
   * @param {Page} page - The Playwright page object.
   * @param {string} screenshotName - The name for the screenshot file.
   */

  static async takeScreenshot(
    page: Page,
    screenshotName: string,
    baseDir: string = __dirname
  ): Promise<void> {
    // Get the current date in YYYY-MM-DD format
    const currentDate = new Date().toISOString().split("T")[0];

    // Create the folder path
    const folderPath = path.join(__dirname, "Screenshots", currentDate);

    // Check if the folder exists, if not, create it
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Get the current time in HH-MM-SS format
    const currentTime = new Date()
      .toISOString()
      .split("T")[1]
      .split(".")[0]
      .replace(/:/g, "-");

    // Create the full file path
    const filePath = path.join(
      folderPath,
      `${screenshotName}-${currentTime}.png`
    );

    // Take the screenshot
   // await page.screenshot({ path: filePath, fullPage: true });

    console.log(`Screenshot saved at ${filePath}`);
  }
  // Other helper functions can be added here...

  static async verifySorting(
    columnHeaderTestId: string,
    columnCellId: string,
    dataType: "string" | "number" | "date",
    cellExtension: string,
    ascending: boolean = true
  ) {
    if (!this.page) {
      throw new Error(
        "Helpers class has not been initialized with a page object."
      );
    }
    // Click on the header
    await this.page.getByTestId(columnHeaderTestId).click();
    await this.page.waitForTimeout(500);
    await this.page.waitForLoadState("networkidle");
    // Get the values of the first 5 rows

    const rowValues = [];
    for (let i = 0; i < 5; i++) {
      try {
        const cellText = await this.page
          .getByTestId(`${columnCellId}-${i}-${cellExtension}`)
          .innerText();
        rowValues.push(cellText.trim()); // Trim to remove any leading/trailing whitespace
      } catch (error) {
        console.log(`Error getting text for row ${i}:`, error);
        break; // Exit loop if we can't find more rows
      }
    }
    console.log("Raw values:", rowValues);
    // Convert values based on data type
    const convertedValues = rowValues.map((value) =>
      this.convertValue(value, dataType)
    );
    console.log("Converted values:", convertedValues);
    // Check if the rows are sorted correctly
    for (let i = 1; i < convertedValues.length; i++) {
      const prev = convertedValues[i - 1];
      const current = convertedValues[i];

      if (prev !== null && current !== null) {
        const comparisonResult = this.compare(prev, current);
        console.log(
          `Comparing ${prev} to ${current}. Result: ${comparisonResult}`
        ); // For debugging
        if (ascending) {
          expect(comparisonResult).toBeLessThanOrEqual(0);
        } else {
          expect(comparisonResult).toBeGreaterThanOrEqual(0);
        }
      }
    }
  }

  // this function will compare two values based on their data type  and return comparison result 0, -1, or 1 respectively
  private static compare(a: any, b: any): number {
    if (a === null && b === null) return 0;
    if (a === null) return -1;
    if (b === null) return 1;

    if (a instanceof Date && b instanceof Date) {
      return a.getTime() - b.getTime();
    }
    if (typeof a === "number" && typeof b === "number") {
      return a - b;
    }
    return String(a).localeCompare(String(b), undefined, {
      sensitivity: "base",
    });
  }

  // this function will convert the value to specific type
  private static convertValue(
    value: string,
    dataType: "string" | "number" | "date"
  ): any {
    if (value === "" || value.toLowerCase() === "n/a") return null;
    switch (dataType) {
      case "number":
        const num = parseFloat(value);
        return isNaN(num) ? null : num;
      case "date":
        const date = new Date(value);
        return isNaN(date.getTime()) ? null : date;
      default:
        return value.toLowerCase();
    }
  }

  static async getPageSize(tableInputPageSize: string): Promise<number> {
    const selectElement = await this.page.getByTestId(tableInputPageSize);
    return parseInt(
      await selectElement.evaluate((el: HTMLSelectElement) => el.value)
    );
  }

  static async setPageSize(
    size: number,
    tableInputPageSizeSelector: string
  ): Promise<void> {
    await this.page
      .getByTestId(tableInputPageSizeSelector)
      .selectOption(size.toString());
    await this.page.waitForLoadState("networkidle");
  }

  static async getTotalEntries(
    tableShowingResultSelector: string
  ): Promise<number> {
    const text = await this.page
      .getByTestId(tableShowingResultSelector)
      .textContent();
    const match = text?.match(/of (\d+) entries/);
    return match ? parseInt(match[1]) : 0;
  }

  static async getCurrentPageInfo(tableShowingResultSelector: string): Promise<{
    start: number;
    end: number;
    total: number;
  }> {
    await this.page.waitForLoadState("networkidle");
    const text = await this.page
      .getByTestId(tableShowingResultSelector)
      .textContent();
    const match = text?.match(
      /Showing\s+(\d+)\s+to\s+(\d+)\s+of\s+(\d+)\s+entries/
    );
    if (match) {
      return {
        start: parseInt(match[1]),
        end: parseInt(match[2]),
        total: parseInt(match[3]),
      };
    }
    throw new Error("Unable to parse current page info");
  }

  static async goToFirstPage(firstPageButtonSelector: string) {
    await this.page.getByTestId(firstPageButtonSelector).click();
    await this.page.waitForLoadState("networkidle");
  }

  static async goToLastPage(lastPageButtonSelector: string) {
    await this.page.getByTestId(lastPageButtonSelector).click();
    await this.page.waitForLoadState("networkidle");
  }

  static async goToNextPage(nextButtonSelector: string) {
    await this.page.getByTestId(nextButtonSelector).click();
    await this.page.waitForLoadState("networkidle");
  }

  static async goToPreviousPage(previousButtonSelector: string) {
    await this.page.getByTestId(previousButtonSelector).click();
    await this.page.waitForLoadState("networkidle");
  }

  static async isFirstPageButtonDisabled(
    firstPageButtonSelector: string
  ): Promise<boolean> {
    const button = await this.page.getByTestId(firstPageButtonSelector);
    return await button.evaluate((el) => {
      const anchr = el.querySelector("a");
      const status = anchr ? anchr.classList.contains("disabled") : false;
      console.log("status of the FirstPage Button", status);
      return status;
    });
  }

  static async isLastPageButtonDisabled(
    lastPageButtonSelector: string
  ): Promise<boolean> {
    const button = await this.page.getByTestId(lastPageButtonSelector);
    return await button.evaluate((el) => {
      const anchr = el.querySelector("a");
      const status = anchr ? anchr.classList.contains("disabled") : false;
      return status;
    });
  }

  static async getTableRowCount(): Promise<number> {
    return await this.page.locator(".table_row").count();
  }
}
