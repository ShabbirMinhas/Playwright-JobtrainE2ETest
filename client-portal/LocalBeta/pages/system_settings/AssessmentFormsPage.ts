import { Browser, Page, chromium, expect } from "@playwright/test";
import { Helpers } from "../../utils/helpers";
import { error, timeLog } from "console";
import exp from "constants";
import SystemSettingsPage from "./SystemSettingsPage";


// System Settings communication class
export default class AssessmentFormsPage  extends SystemSettingsPage{

    page: Page;

   selectors = {
   
        ...super.getSelectors(),
       // pageHeading:'div-page-title-',//'div-page-title',
        assessmentForm:'Assessment Forms',
        questionBank:'Question Bank',
        groupAndTimedForms:'Group & Timed Forms',
        jobType:'Job Type',
        archivedForms:'Archived Forms',

        // Add more selectors as needed
    };

     // Class constructor 
     constructor(page: Page) {
        super(page);
        this.page = page;
        

    }

    async verifyAssessmentFormsScreen() {

        await expect(this.page.getByTestId(this.selectors.pageHeading)).toBeVisible();
        console.log("Assement Forms main page heading is visible.");
        const assessmentFormLocator = await this.page.getByRole('heading', { name: this.selectors.assessmentForm,exact:true }).nth(1)
        await expect (assessmentFormLocator).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.questionBank,exact:true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.groupAndTimedForms,exact:true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.jobType,exact:true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.archivedForms,exact:true })).toBeVisible();
        
        console.log("All elements on the Assessment Fomrs screen are visible.");
    }

}
