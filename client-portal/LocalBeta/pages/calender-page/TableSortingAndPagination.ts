import { Browser, Locator, Page, chromium, expect } from "@playwright/test";
// System Settings class
export default class TableSortingAndPagination {
  async getSelectors() {
    return this.selectors;
  }

  cleanArray = (array: string[]): string[] => {
    return array.map((item) => item.trim()).filter((item) => item !== "");
  };

  page: Page;
  selectors: {
    tableHeader: string;
    subjectHeader: string;
    startDateHeader: string;
    selfServiceHeader: string;
    appointmentTypeHeader: string;
    location_header: string;
    tableShowingResults: string;
    tableInputPageSize: string;
    firstPageButton: string;
    lastPageButton: string;
    previousButton: string;
    nextButton: string;
  };

  constructor(page: Page) {
    this.page = page;
    this.selectors = {
      tableHeader: "div-theader-null",
      subjectHeader: "div-theader-name-Subject",
      startDateHeader: "div-theader-name-StartDate",
      selfServiceHeader: "div-theader-name-CandidateAction",
      appointmentTypeHeader: "div-theader-name-SYSTEMAPPOINTMENTTYPE",
      location_header: "div-theader-name-LOCATIONNAME",
      tableShowingResults: "div-showing-results-null",
      tableInputPageSize: "select-page-size-null",
      firstPageButton: "li-first-page-null",
      lastPageButton: "li-last-page-null",
      previousButton: "li-previous-pagenull",
      nextButton: "li-next-page-null",
    };
  }
  async GetHeaderSpans() {
    const tableHeader = await this.page.getByTestId(this.selectors.tableHeader);
    const spans = await tableHeader.locator("span").allTextContents();
    return spans;
  }

  async verifySorting(
    columnHeaderTestId: string,
    columnCellId: string,
    dataType: "string" | "number" | "date",
    cellExtension: string,
    ascending: boolean = true
  ) {
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
  private compare(a: any, b: any): number {
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
  private convertValue(
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
  async getPageSize(): Promise<number> {
    const selectElement = await this.page.getByTestId(
      this.selectors.tableInputPageSize
    );
    return parseInt(
      await selectElement.evaluate((el: HTMLSelectElement) => el.value)
    );
  }
  async setPageSize(size: number) {
    await this.page
      .getByTestId(this.selectors.tableInputPageSize)
      .selectOption(size.toString());
    await this.page.waitForLoadState("networkidle");
  }
  async getTotalEntries(): Promise<number> {
    const text = await this.page
      .getByTestId(this.selectors.tableShowingResults)
      .textContent();
    const match = text?.match(/of (\d+) entries/);
    return match ? parseInt(match[1]) : 0;
  }
  async getCurrentPageInfo(): Promise<{
    start: number;
    end: number;
    total: number;
  }> {
    await this.page.waitForLoadState("networkidle");
    const text = await this.page
      .getByTestId(this.selectors.tableShowingResults)
      .textContent();
    await this.page.waitForLoadState("networkidle");
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

  async goToFirstPage() {
    await this.page.getByTestId(this.selectors.firstPageButton).click();
    await this.page.waitForLoadState("networkidle");
  }

  async goToLastPage() {
    await this.page.getByTestId(this.selectors.lastPageButton).click();
    await this.page.waitForLoadState("networkidle");
  }

  async goToNextPage() {
    await this.page.getByTestId(this.selectors.nextButton).click();
    await this.page.waitForLoadState("networkidle");
  }

  async goToPreviousPage() {
    await this.page.getByTestId(this.selectors.previousButton).click();
    await this.page.waitForLoadState("networkidle");
  }

  async isFirstPageButtonDisabled(): Promise<boolean> {
    const button = await this.page.getByTestId(this.selectors.firstPageButton);
    return await button.evaluate((el) => {
      const anchr = el.querySelector("a");
      const status = anchr ? anchr.classList.contains("disabled") : false;
      console.log("status of the FirstPage Button", status);
      return status;
    });
  }

  async isLastPageButtonDisabled(): Promise<boolean> {
    const button = await this.page.getByTestId(this.selectors.lastPageButton);
    return await button.evaluate((el) => {
      const anchr = el.querySelector("a");
      const status = anchr ? anchr.classList.contains("disabled") : false;
      return status;
    });
  }

  async getTableRowCount(): Promise<number> {
    return await this.page.locator(".table_row").count();
  }
}
