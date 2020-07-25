const Page = require('./page');

class TopPage extends Page {
  get loginLink() { return $('=Login'); }
  get signupLink() { return $('=Sign up'); }
  get planLink() { return $('=Reserve'); }

  open() {
    super.open('/en-US/');
  }

  goToLoginPage() {
    this.loginLink.click();
  }

  goToSignupPage() {
    this.signupLink.click();
  }

  goToPlansPage() {
    this.planLink.click();
  }
}

module.exports = new TopPage();
