import { Browser, Page, chromium, expect } from "@playwright/test";
import { Helpers } from "../utils/helpers";
import { error, timeLog } from "console";
import exp from "constants";


// System Settings class
export default class CommunicationPage {

    page: Page;

    selectors: {


              // Add more selectors as needed
    };

     // Class constructor 
     constructor(page: Page) {

        this.page = page;
        this.selectors = {

            : 'btn-header-home-setting',// Use getByHeading

        }

    }

    async navigateToSystemSettingsLink() {

        return await this.page.getByTestId(this.selectors.systemSettingsLink);
    }

}