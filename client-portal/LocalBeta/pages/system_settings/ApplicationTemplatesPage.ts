import { Browser, Page, chromium, expect } from "@playwright/test";
import { Helpers } from "../../utils/helpers";
import { error, timeLog } from "console";
import exp from "constants";
import SystemSettingsPage from "./SystemSettingsPage";


// System Settings communication class
export default class ApplicationTemplatePage  extends SystemSettingsPage{

    page: Page;

   selectors = {
   
        ...super.getSelectors(),
       // pageHeading:'div-page-title-',//div-page-title
        applicationTemplateHeading:'Settings: Application Templates & Custom Fields',
        applicationTemplate:'Application Templates',
        directApplyApplicationForm:'Direct Apply Application Form',
        customFields:'Custom Fields',

        
       

        // Add more selectors as needed
    };

     // Class constructor 
     constructor(page: Page) {
        super(page);
        this.page = page;
        

    }

    async verifyApplicationTemplateScreen() {

        await expect(this.page.getByTestId(this.selectors.pageHeading )).toBeVisible();
        console.log("Application Template main page heading is visible.");
        await expect(this.page.getByRole('heading', { name: this.selectors.applicationTemplate,exact:true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.directApplyApplicationForm,exact:true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.customFields,exact:true })).toBeVisible();
        console.log("All elements on the Application Template screen are visible.");
    }

}
