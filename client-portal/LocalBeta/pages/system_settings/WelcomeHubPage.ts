import { Browser, Page, chromium, expect } from "@playwright/test";
import { Helpers } from "../../utils/helpers";
import { error, timeLog } from "console";
import exp from "constants";
import SystemSettingsPage from "./SystemSettingsPage";


// System Settings communication class
export default class WelcomeHubPage  extends SystemSettingsPage{

    page: Page;

   selectors = {
   
        ...super.getSelectors(),
        //Welcome Hub
        //pageHeading:'div-page-title',//getByTestId
        
        welcomeHub:'Welcome Hub',
        welcomeHubManager:'Welcome Hub Manager',
        welcomeHubLinks:'Welcome Hub Links',
        keyContacts:'Key Contacts',
        

        //Media Libraries
        mediaLibraries:' Media Libraries ',
        imageLibrary :'Image Library',
        videoLibrary:'Video Library',
        textLibrary:'Text Library',
       
        

       
       

       
        // Add more selectors as needed
    };

     // Class constructor 
     constructor(page: Page) {
        super(page);
        this.page = page;
        

    }

    async verifyWelcomeHubScreen() {

        await expect(this.page.getByTestId(this.selectors.pageHeading )).toBeVisible();
        console.log("Welcome Hub Settings main page heading is visible.");
        //await expect(this.page.getByRole('heading',{ name: this.selectors.welcomeHub, exact: true } )).toBeVisible();
        
       // await expect(this.page.getByRole('heading', { name: this.selectors.documentLibrary ,exact: true})).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.welcomeHubManager,exact: true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.welcomeHubLinks,exact: true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.keyContacts,exact: true })).toBeVisible();
       
        //Media Libraries
        await expect(this.page.getByRole('heading', { name: this.selectors.mediaLibraries,exact: true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.imageLibrary,exact: true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.videoLibrary,exact: true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.textLibrary,exact: true })).toBeVisible();
        
        
        
        console.log("All elements on the Welcome Hub screen are visible.");
    }

}