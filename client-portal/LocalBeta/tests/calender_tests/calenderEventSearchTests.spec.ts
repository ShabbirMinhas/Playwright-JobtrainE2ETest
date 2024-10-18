import { test, expect, Page } from "@playwright/test";
import ExcelUtils, { ExcelRow, WriteOptions } from "../../utils/excelUtils";
import { Helpers } from "../../utils/helpers";
import CalenderEventSearch from "../../pages/calender-page/CalenderEventSearchPage";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// variable to hold data, initialized as 'any' type.
type TableRow = { [key: string]: any };

let assessementFormsData: TableRow[];
// Use the saved state to load the authenticated session
test.use({ storageState: "state.json" });
let calenderSearchEvent: CalenderEventSearch;
test.beforeAll(async () => {
  // loginData = await (ExcelUtils.readData('D:\\JobTrain Documents\\JobtrainData.xlsx', 'LoginData'));
  assessementFormsData = await ExcelUtils.readData(
    "E:\\JobtrainData.xlsx",
    "SystemSettingsData"
  );
});
test.beforeEach(async ({ page }) => {
  await page.goto("Calendar/ListEvent", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("networkidle");
  calenderSearchEvent = new CalenderEventSearch(page);
});

test("verify visibility,expand and collapse search of section", async ({
  page,
}) => {
  await page.waitForLoadState("networkidle");
  await await calenderSearchEvent.verifySearchExpandAndCollapse();
});
test("search for a specific event by name", async ({ page }) => {
  const selectors = calenderSearchEvent.getSelectors();
  await page.getByTestId(selectors.searchArrowButton).click();
  await calenderSearchEvent.searchByEventName("Test Event");
});

test("verify placeholder value and search by event location", async ({
  page,
}) => {
  const selectors = calenderSearchEvent.getSelectors();
  await page.getByTestId(selectors.searchArrowButton).click();
  const textValue = "JT Test Location 2";
  console.log("using event location searching events by its name :", textValue);
  await calenderSearchEvent.VerifyAndsearchByEventLocation(textValue.trim());
});

test("search by event start date", async ({ page }) => {
  const selectors = calenderSearchEvent.getSelectors();
  await page.getByTestId(selectors.searchArrowButton).click();
  const datestring = "1/1/2024";
  console.log("using event start date searching by start date :", datestring);
  await calenderSearchEvent.SearchByStartDate(datestring);
});

test("select archived filter and perform searchh", async ({ page }) => {
  const selectors = calenderSearchEvent.getSelectors();
  await page.getByTestId(selectors.searchArrowButton).click();
  await calenderSearchEvent.searchByArchivedFilter();
});

test("search by job title and reference", async () => {
  const jobTitle = "1st Commis Baker";
  const reference = "JS-1234";
  console.log(
    "using job title and reference searching by job title :",
    jobTitle,
    "and reference :",
    reference
  );
  await calenderSearchEvent.searchByJobTitleAndReference(jobTitle, reference);
});

test("verify and select event creater,interviewer and perform search", async () => {
  const eventCreater = "Arslan Khan(arslan.khan+65@datamagnetics.com)";
  const eventInterviewer = "Bhola Record , raza.m@outlook.com ";
  console.log(
    "using event creater and interviewer searching by creater :",
    eventCreater,
    "and interviewer :",
    eventInterviewer
  );
  await calenderSearchEvent.searchByEventCreaterAndInterviewer(
    eventCreater,
    eventInterviewer
  );
});
test("verify placeholder value and search by event user", async ({ page }) => {
  const selectors = calenderSearchEvent.getSelectors();
  await page.getByTestId(selectors.searchArrowButton).click();
  const textValue = "Bhola Record(raza.m@outlook.com)";
  console.log("using event user searching events by its userName :", textValue);
  await calenderSearchEvent.verifyAndSearchByEventUser(textValue);
});
test("enter candidate name and perform search", async () => {
  const candidateName = "Test User";
  console.log("searching by candidate Name :", candidateName);
  await calenderSearchEvent.searchCandidateName(candidateName);
});

test("perform search with multiple criteria", async ({ page }) => {
  const selectors = calenderSearchEvent.getSelectors();
  await page.getByTestId(selectors.searchArrowButton).click();
  await page.getByTestId(selectors.eventName).fill("evenName");
  await page.getByTestId(selectors.eventLocation).fill("Fleet - Ship Based");
  await page.getByTestId(selectors.startDate).fill("1/1/2024");
  await page.getByTestId(selectors.archived).selectOption("1");
  await page.getByTestId(selectors.jobTitle).fill("job Title");
  await page.getByTestId(selectors.jobReference).fill("-1234");
  await page
    .getByTestId(selectors.eventCreater)
    .fill("Arslan Khan(arslan.khan@datamagnetics.com)");
  await page
    .getByTestId(selectors.eventInterviewer)
    .fill("Bhola Record , raza.m27@outlook.com");
  await page
    .getByTestId(selectors.eventUser)
    .fill("Ahmad Usman(usman123@gmail.com)");
  await page.getByTestId(selectors.candidateName).fill("Test User");
  await page.getByTestId(selectors.searchButton).click();
});
