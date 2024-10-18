import { Browser, Page, chromium, expect } from "@playwright/test";
import { Helpers } from "../../utils/helpers";
import { error, timeLog } from "console";
import exp from "constants";
import SystemSettingsPage from "./SystemSettingsPage";


// System Settings communication class
export default class  RedeploymentPage  extends SystemSettingsPage{

    page: Page;

   selectors = {
   
        ...super.getSelectors(),
        //Welcome Hub
        //pageHeading:'div-page-title',//getByTestId
        btnBrandBuilder:'btn-brand-builder',
        redeploymentStatusesLink:'Redeployment Statuses',
        redeploymentWithdrawalReasonsLink:'Redeployment Withdrawal Reasons',
        redeploymentFormsLink:'Redeployment Forms'
      
        
       
        // Add more selectors as needed
    };

     // Class constructor 
     constructor(page: Page) {
        super(page);
        this.page = page;
        

    }

    async verifyRedeploymentScreen() {

        await expect(this.page.getByTestId(this.selectors.pageHeading )).toBeVisible();
        console.log("Redeployment Settings main page heading is visible.");
        //await expect(this.page.getByRole('heading',{ name: this.selectors.welcomeHub, exact: true } )).toBeVisible();
        
       // await expect(this.page.getByRole('heading', { name: this.selectors.documentLibrary ,exact: true})).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.redeploymentStatusesLink,exact: true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.redeploymentWithdrawalReasonsLink,exact: true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.redeploymentFormsLink,exact: true })).toBeVisible();
        console.log("All elements on the redeployment screen are visible.");
    }

}