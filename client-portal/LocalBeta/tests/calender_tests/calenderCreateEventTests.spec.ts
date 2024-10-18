import { test, expect, Page, selectors } from "@playwright/test";
import ExcelUtils, { ExcelRow, WriteOptions } from "../../utils/excelUtils";
import CalenderCreateEvent from "../../pages/calender-page/CalenderCreateEventPage";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// variable to hold data, initialized as 'any' type.
type TableRow = { [key: string]: any };

let assessementFormsData: TableRow[];
let createEvent: CalenderCreateEvent;
// Use the saved state to load the authenticated session
test.use({ storageState: "state.json" });
test.beforeAll(async () => {
  // loginData = await (ExcelUtils.readData('D:\\JobTrain Documents\\JobtrainData.xlsx', 'LoginData'));
  assessementFormsData = await ExcelUtils.readData(
    "E:\\JobtrainData.xlsx",
    "SystemSettingsData"
  );
});
test.beforeEach(async ({ page }) => {
  await page.goto("Calendar/AddCalendarEntry/NewCalendarEntry", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("networkidle");
  createEvent = new CalenderCreateEvent(page);
});

test("Verify event creator field is read-only", async ({ page }) => {
  const selectors = await createEvent.getSelectors();
  const eventCreatorField = page.getByTestId(selectors.eventCreator);
  await expect(eventCreatorField).toBeDisabled();
});

test("Toggle candidate self-service option", async ({ page }) => {
  const selectors = await createEvent.getSelectors();
  await createEvent.toggle(selectors.candidateSelfService);
  await expect(page.getByTestId(selectors.candidateSelfService)).toBeChecked();
  await createEvent.toggle(selectors.candidateSelfService);
  await expect(
    page.getByTestId(selectors.candidateSelfService)
  ).not.toBeChecked();
});

test("Verify 'Is this event private?' toggle", async ({ page }) => {
  const selectors = await createEvent.getSelectors();
  await createEvent.toggle(selectors.isThisEventPrivate);
  await expect(page.getByTestId(selectors.isThisEventPrivate)).toBeChecked();
  await createEvent.toggle(selectors.isThisEventPrivate);
  await expect(
    page.getByTestId(selectors.isThisEventPrivate)
  ).not.toBeChecked();
});

test("Attempt to create event with missing required fields", async ({
  page,
}) => {
  const selectors = await createEvent.getSelectors();
  await page.getByTestId(selectors.saveAndContinueButton).click();
  // i will skip this test because the error title changes every time sometime it event name and sometime event title
  await expect(page.getByText("Appointment title is required")).toBeVisible();
  await expect(page.getByText("Please enter No. of")).toBeVisible();
  // this is verification of the form that the form is not submitted
  await expect(page).toHaveURL(
    "http://beta.jobtrain.com/Calendar/AddCalendarEntry/NewCalendarEntry"
  );
});

test("Verify event name field validation", async ({ page }) => {
  const selectors = await createEvent.getSelectors();
  await page.getByTestId(selectors.eventName).fill("");
  await page.getByTestId(selectors.saveAndContinueButton).click();
  await page.waitForLoadState("networkidle");
  await expect(page.getByText("Appointment title is required")).toBeVisible();
  await page.getByTestId(selectors.eventName).fill("Test Event");
  await expect(page.getByText("Event Name is required")).not.toBeVisible();
});
test("Verify No of candidates per appointment field validation", async ({
  page,
}) => {
  const selectors = await createEvent.getSelectors();
  await page.getByTestId(selectors.candidatesPerAppointment).fill("");
  await page.getByTestId(selectors.saveAndContinueButton).click();
  await expect(page.getByText("Please enter No. of")).toBeVisible();
  await page.getByTestId(selectors.candidatesPerAppointment).fill("0");
  await expect(page.getByText("Please enter No. of")).not.toBeVisible();
});

test.skip("Create event with valid data and verify the placeholder values", async ({
  page,
}) => {
  const selectors = await createEvent.getSelectors();
  await page.getByTestId(selectors.eventName).fill("test event");
  const placeholdervalue = await page
    .getByTestId(selectors.eventType)
    .getAttribute("placeholder");
  await expect(placeholdervalue).toBe("Please Select");
  await createEvent.selectRandomFromInput(
    selectors.eventType,
    page.getByTestId("available-options-container-select-event-type")
  );
  await page.getByTestId(selectors.candidatesPerAppointment).fill("0");
  await page.getByTestId(selectors.saveAndContinueButton).click();
  await page.waitForLoadState("networkidle");
});

test("Create a complete event and verify 'Save & Continue'", async ({
  page,
}) => {
  const selectors = await createEvent.getSelectors();
  await page.getByTestId(selectors.eventName).fill("Complete Test Event");
  await createEvent.selectRandomFromInput(
    selectors.eventType,
    page.getByTestId("available-options-container-select-event-type")
  );
  await page
    .getByTestId(createEvent.selectors.candidatesPerAppointment)
    .fill("3");
  await createEvent.toggle(createEvent.selectors.candidateSelfService);
  await createEvent.toggle(createEvent.selectors.candidateSelfService);
  await createEvent.selectRandomFromInput(
    selectors.inviteEmailStatus,
    page.getByTestId(
      "available-options-container-select-which-status-should-prompt"
    )
  );
  await createEvent.selectRandomFromInput(
    selectors.candidateStatusAfterBooking,
    page.getByTestId(
      "available-options-container-select-canidate-status-after-booking"
    )
  );
  await createEvent.selectRandomFromInput(
    selectors.bookingCutOffRestriction,
    page.getByTestId(
      "available-options-container-select-booking-cut-off-restriction"
    )
  );
  await createEvent.selectRandomFromInput(
    selectors.assignToACampaign,
    page.getByTestId("available-options-container-select-assign-to-campaign")
  );
  await createEvent.toggle(createEvent.selectors.isThisEventPrivate);
  await createEvent.toggle(createEvent.selectors.isThisEventPrivate);
  await page.getByTestId(selectors.saveAndContinueButton).click();
  await page.waitForLoadState("networkidle");
  // this assertion is used to verify that we are directed to new url
  await expect(page).not.toHaveURL(
    "http://beta.jobtrain.com/Calendar/AddCalendarEntry/NewCalendarEntry"
  );
});
