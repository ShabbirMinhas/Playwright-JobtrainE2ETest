import { Browser, Page, chromium, expect } from "@playwright/test";
import { Helpers } from "../../utils/helpers";
import { error, timeLog } from "console";
import exp from "constants";
import SystemSettingsPage from "./SystemSettingsPage";


// System Settings communication class
export default class OnboardingPage  extends SystemSettingsPage{

    page: Page;

   selectors = {
   
        ...super.getSelectors(),
        //Onboarding
        //pageHeading:'div-page-title',//getByTestId
        onboardingSettings:'Onboarding Settings',//getByRole
        documentTypes:'Document Types',
        documentLibrary:'Document Library',
        onboardingTemplates:'Onboarding Templates',
        onboardingForms:'Onboarding Forms',
        sub_statuses:'Sub-statuses',

        //Compliance
        compliance :' Compliance ',
        complianceSettings:'Compliance Settings',
        compliance_DocumentTypes:'Compliance Document Type',
        compliance_DocumentLibrary:'Document Library',
        complianceTemplates:'Compliance Templates',
        complianceForms:'Compliance Forms',
        teams:'Teams',
        complianceDesignSettings:'Compliance Design Settings',

        //Media Libraries
        imageLibrary:'Image Library',
        videoLibrary:'Video Library',
        textLibrary:'Text Library',
        mediaLibraries:' Media Libraries '
       
       

       
        // Add more selectors as needed
    };

     // Class constructor 
     constructor(page: Page) {
        super(page);
        this.page = page;
        

    }

    async verifyOnboardingScreen() {

        await expect(this.page.getByTestId(this.selectors.pageHeading )).toBeVisible();
        console.log("Onboarding Settings main page heading is visible.");
        await expect(this.page.getByRole('heading',{ name: this.selectors.onboardingSettings, exact: true } )).toBeVisible();
        const documentLibraryFirstLocator=this.page.getByRole('heading', { name: this.selectors.documentLibrary ,exact: true}).nth(0)
        await expect(documentLibraryFirstLocator).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.onboardingTemplates,exact: true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.onboardingForms,exact: true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.sub_statuses,exact: true })).toBeVisible();
       //compliance
        await expect(this.page.getByRole('heading', { name: this.selectors.compliance,exact: true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.complianceSettings })).toBeVisible();
        //await expect(this.page.getByRole('heading', { name: this.selectors.compliance_DocumentTypes,exact: true })).toBeVisible();
        const documentLibrarySecondLocator = await this.page.getByRole('heading', { name: this.selectors.compliance_DocumentLibrary,exact: true }).nth(1);
        await expect(documentLibrarySecondLocator).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.complianceTemplates,exact: true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.complianceForms,exact: true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.teams,exact: true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.complianceDesignSettings,exact: true })).toBeVisible();
      
        //Media Libraries
        await expect(this.page.getByRole('heading', { name: this.selectors.mediaLibraries,exact: true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.imageLibrary,exact: true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.videoLibrary,exact: true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.textLibrary,exact: true })).toBeVisible();
        
        
        console.log("All elements on the Application Template screen are visible.");
    }

}