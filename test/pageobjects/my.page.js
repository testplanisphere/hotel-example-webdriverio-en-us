const Page = require('./page');

class MyPage extends Page {
  get planLink() { return $('=Reserve'); }
  get iconLink() { return $('#icon-link'); }
  get header() { return $('<h2>'); }
  get email() { return $('#email'); }
  get password() { return $('#password'); }
  get username() { return $('#username'); }
  get rank() { return $('#rank'); }
  get address() { return $('#address'); }
  get tel() { return $('#tel'); }
  get gender() { return $('#gender'); }
  get birthday() { return $('#birthday'); }
  get notification() { return $('#notification'); }
  get iconImage() { return $('#icon-holder > img'); }
  get deleteButton() { return $('#delete-form > button'); }

  async goToPlansPage() {
    await (await this.planLink).click();
  }

  async delete() {
    await (await this.deleteButton).click();
  }
}

module.exports = new MyPage();
