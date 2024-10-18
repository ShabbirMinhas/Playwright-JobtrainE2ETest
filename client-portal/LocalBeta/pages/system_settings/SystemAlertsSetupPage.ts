import { Browser, Page, chromium, expect } from "@playwright/test";
import { Helpers } from "../../utils/helpers";
import { error, timeLog } from "console";
import exp from "constants";
import SystemSettingsPage from "./SystemSettingsPage";


// System Settings communication class
export default class SystemAlertsSetupPage  extends SystemSettingsPage{

    page: Page;

   selectors = {
   
        ...super.getSelectors(),
        //Welcome Hub
        pageHeading:'div-page-title-',//getByTestId //div-page-title
        
        systemAlertsTemplates:'System Alerts Templates',
       
       
        // Add more selectors as needed
    };

     // Class constructor 
     constructor(page: Page) {
        super(page);
        this.page = page;
        

    }

    async verifySystemAlertsSetupScreen() {

        await expect(this.page.getByTestId(this.selectors.pageHeading )).toBeVisible();
        console.log("System Alerts main page heading is visible.");
        await expect(this.page.getByRole('heading', { name: this.selectors.systemAlertsTemplates,exact: true })).toBeVisible();
        
        
        
        console.log("All elements on the Welcome Hub screen are visible.");
    }

}