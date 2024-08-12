/**
 * File: PasswordResetPage.ts
 * Author: Shabbir Minhas
 * Date: May 8, 2024
 * 
 * Description:
 * This file defines the Password Reset Page class, which implements the Page Object Model (POM) pattern.
 * The Password Reset Page class encapsulates all interactions and elements related to the Password Reset functionality of the application.
 * 
 * Classes:
 *   PasswordResetPage:
 *     Description: Encapsulates interactions and elements related to the Password Reset functionality.
 *     Author: Shabbir Minhas
 * 
 * Usage:
 * import PasswordResetPage from "../pages/PasswordResetPage";
 *  
 * 
 */

import { Page, chromium, expect } from "@playwright/test";

// Password Reset Page class
export default class PasswordResetPage {

  readonly page: Page;

  // Define the selectors object 
  selectors: {

    readonly forgetPasswordLink: string;
    readonly jtLogo: string;
    readonly resetPasswordHeading: string;
    readonly resetPasswordInstructionsText: string
    readonly emailAddressInput: string;
    readonly resetPasswordButton: string;
    readonly copyrightText: string,
    readonly resetEmailSentMessage:string,
    // Add more selectors as needed
  };
  //  private readonly page: Page;
  // Class constructor 
  constructor(page: Page) {

    this.page = page;
    this.selectors = {
      forgetPasswordLink: 'Forgotten your password?',//Use getByRole(Link)
      jtLogo: 'Jobtrain Login',//Use getByRole(img)
      resetPasswordHeading: ' Reset Password ', // Use getByRole(heading)
      resetPasswordInstructionsText: 'Enter your username or email',// Use getByText
      emailAddressInput: 'inputEmail',// Use getByTestId
      resetPasswordButton: 'Reset Password',// Use getByRole(button)
      copyrightText: '©  Jobtrain Ltd. All rights reserved.',// Use getByText
     // resetEmailSentMessage:'MainContent_diverror' // Use getById
     resetEmailSentMessage:'We have emailed you the link'
    };
  }



  async clickForgetPasswordLink() {
    await this.page.click(this.selectors.forgetPasswordLink);
  }
  async getJobTrainLogo() {

    const jobTrainLogo = await this.page.getByText(this.selectors.jtLogo)
    return jobTrainLogo;
  }

  async passwordResetHeading() {

    const headingText = await this.page.getByRole('heading',{name:this.selectors.resetPasswordHeading})
    return headingText;
  }

  async fillEmail(email:string) {

    const userEmail = await this.page.getByTestId(this.selectors.emailAddressInput).fill(email);
    
  }

  async getEmailInput() {

    const userEmail = await this.page.getByTestId(this.selectors.emailAddressInput);
    return userEmail;
  }
  async clickResetPasswordButton() {

    const resetButton = await this.page.getByRole('button', { name: this.selectors.resetPasswordButton });
     return resetButton;

  }
  async verifyCopyrightText() {

    const getCopyrightText = await this.page.getByText(this.selectors.copyrightText);
    
    return getCopyrightText;


  }

  async getResetEmailSentMessage(){

    const getEmailSent = await this.page.getByText(this.selectors.resetEmailSentMessage);
    
    return getEmailSent;

  }

  async resetPasswordInstructionsText(){

    const getEmailInstructionText = await this.page.getByText(this.selectors.resetPasswordInstructionsText);
    return getEmailInstructionText;

  }

  async openPasswordResetScreen() {

    await this.page.getByLabel(this.selectors.forgetPasswordLink).click();

  }

}