import { Browser, Page, chromium, expect } from "@playwright/test";
import { Helpers } from "../../utils/helpers";
import { error, timeLog } from "console";
import exp from "constants";
import SystemSettingsPage from "./SystemSettingsPage";


// System Settings communication class
export default class GeneralSettingsPage  extends SystemSettingsPage{

    page: Page;

   selectors = {
   
        ...super.getSelectors(),
        //pageHeading:'div-page-title',//getByTestId
        locations:'Locations',//getByRole
        jobRegions:'Job Regions',
        departments:'Departments',
        jobCategories:'Job Categories',
        jobLevels:'Job Levels',
        adverts:'Adverts',
        salaryBands:'Salary Bands',
        advertCategories:'Advert Categories',
        externalAgencies:'External Agencies',
        candidateApplicationStatuses:'Candidate Application Statuses',
        divisions:'Divisions',
        documentLibrary:'Document Library',
        ethnicOrigins:'Ethnic Origins',
        campaigns:'Campaigns',
        jobTitles:'Job Titles',
        addressBook:'Address Book',
        schoolLocations:'School Locations',
        schoolSubjects:'School Subjects',
        costCenters:'Cost Centers',
        packages:'Packages',
        jobCodes:'Job Codes',
        statusChangeReasons:'Status Change Reasons',
        skillsCategory:'Skills Category',
        skills:'Skills',
        bulkRecruitmentSpecialisms:'Bulk Recruitment Specialisms',
        agencySpecialisms:'Agency Specialisms',
        deleteAndWithdrawReasons:'Delete & Withdraw Reasons',
        NHSBanks_eESS_Interface:'NHSBanks(eESS Interface)',
        jobBoardMarketplaceCampaigns:'Job Board Marketplace Campaigns',
        jobBoardMarketingLogos:'Job Board Marketing Logos',
        workPattern:'Work Pattern',
        colleagueCategory:'Colleague Category',
        postReference:'Post Reference',
        fundingSource:'Funding Source',
        locationsSearchInputBox:'txt-search-listing-location',
        locationsSearchButton:'btn-search-listing-location'

       
        // Add more selectors as needed
    };

     // Class constructor 
     constructor(page: Page) {
        super(page);
        this.page = page;
        

    }

    async verifyGeneralSettingsScreen() {

        await expect(this.page.getByTestId(this.selectors.pageHeading )).toBeVisible();
        console.log("General Settings main page heading is visible.");
        await expect(this.page.getByRole('heading',{ name: this.selectors.locations, exact: true } )).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.jobRegions,exact: true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.departments ,exact: true})).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.jobCategories,exact: true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.jobLevels,exact: true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.adverts,exact: true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.salaryBands,exact: true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.advertCategories })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.externalAgencies,exact: true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.candidateApplicationStatuses,exact: true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.divisions,exact: true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.documentLibrary,exact: true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.ethnicOrigins,exact: true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.campaigns,exact: true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.jobTitles,exact: true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.addressBook,exact: true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.schoolLocations, exact: true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.schoolSubjects,exact: true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.costCenters,exact: true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.packages,exact: true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.jobCodes,exact: true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.statusChangeReasons,exact: true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.skillsCategory,exact: true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.skills,exact: true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.bulkRecruitmentSpecialisms,exact: true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.agencySpecialisms,exact: true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.deleteAndWithdrawReasons,exact: true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.NHSBanks_eESS_Interface,exact: true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.jobBoardMarketplaceCampaigns,exact: true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.jobBoardMarketingLogos,exact: true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.workPattern,exact: true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.colleagueCategory,exact: true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.postReference,exact: true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: this.selectors.fundingSource,exact: true })).toBeVisible();
        

        
        console.log("All elements on the Application Template screen are visible.");
    }
    async locatoinsSearchInput() {

        return await this.page.getByTestId(this.selectors.locationsSearchInputBox);

    }
    async locationsSearchButton() {

        return await this.page.getByTestId(this.selectors.locationsSearchButton).click();

    }

}