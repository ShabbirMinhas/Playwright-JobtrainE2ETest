import { Browser, Page, chromium, expect } from "@playwright/test";
import { Helpers } from "../../utils/helpers";
import { error, timeLog } from "console";
import exp from "constants";
import SystemSettingsPage from "./SystemSettingsPage";


// System Settings communication class
export default class  BrandBuilderPage  extends SystemSettingsPage{

    page: Page;

   selectors = {
   
        ...super.getSelectors(),
        //Welcome Hub
        //pageHeading:'div-page-title',//getByTestId
        btnBrandBuilder:'btn-brand-builder',
        internalLogin:'Internal Login',
        externalLogin:'External Login',
      
        
       
        // Add more selectors as needed
    };

     // Class constructor 
     constructor(page: Page) {
        super(page);
        this.page = page;
        

    }

     async verifyBrandBuilderScreen() {

        await expect(this.page.getByTestId(this.selectors.pageHeading )).toBeVisible();
        console.log("Brand Builder Settings main page heading is visible.");
        //await expect(this.page.getByRole('heading',{ name: this.selectors.welcomeHub, exact: true } )).toBeVisible();
        
       // await expect(this.page.getByRole('heading', { name: this.selectors.documentLibrary ,exact: true})).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.internalLogin,exact: true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.externalLogin,exact: true })).toBeVisible();

        console.log("All elements on the Brand Builder screen are visible.");
    }

}