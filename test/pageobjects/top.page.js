const Page = require('./page');

class TopPage extends Page {
  get loginLink() { return $('=Login'); }
  get signupLink() { return $('=Sign up'); }
  get planLink() { return $('=Reserve'); }

  async open() {
    await super.open('/en-US/');
  }

  async goToLoginPage() {
    await (await this.loginLink).click();
  }

  async goToSignupPage() {
    await (await this.signupLink).click();
  }

  async goToPlansPage() {
    await (await this.planLink).click();
  }
}

module.exports = new TopPage();
