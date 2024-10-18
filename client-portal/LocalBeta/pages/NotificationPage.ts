import { Browser, Locator, Page, chromium, expect } from "@playwright/test";
import { Helpers } from "../utils/helpers";
import { error, timeLog } from "console";
import exp from "constants";


// Notification class
export default class NotificationPage {

    page: Page;

    selectors: {

        notificationLink: string;
        noOfNotification: string;
        totalNotificationCount:string;
        notificationLinksUl:string;
        

        // Add more selectors as needed
    };
    // Class constructor 
    constructor(page: Page) {

        this.page = page;
        this.selectors = {

            notificationLink: 'btn-header-home-notifications',// Use getById
            noOfNotification: '',//use getByHeading
            totalNotificationCount:'span-total-notification',
            notificationLinksUl:'ul-notification-container',
            
           

        };
    }

    async navigateToNotificationLink() {

        return await this.page.getByTestId(this.selectors.notificationLink);
    }
    async notificationTabsVerification() {

       
        const notificationUl= await this.page.getByTestId(this.selectors.notificationLinksUl).locator('>*');
        const notificationTabsCount = await notificationUl.count();
        return notificationTabsCount;
    }

    async totalNotificationCount() {

        const totalCount= await this.page.getByTestId(this.selectors.totalNotificationCount).textContent();
        const totalNotificationCount=await Number(totalCount)
        return totalNotificationCount;
    }

    async notificationLinksVerification() {

        const totalCount= await this.page.getByTestId(this.selectors.totalNotificationCount).innerText();;
        return totalCount;
    }
}