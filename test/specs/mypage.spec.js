const path = require('path');
const IconPage = require('../pageobjects/icon.page');
const LoginPage = require('../pageobjects/login.page');
const MyPage = require('../pageobjects/my.page');
const SignupPage = require('../pageobjects/signup.page');
const TopPage = require('../pageobjects/top.page');

describe('MyPage', () => {
  it('should be display preset user [clark]', async () => {
    await TopPage.open();
    await TopPage.goToLoginPage();
    await LoginPage.email.setValue('clark@example.com');
    await LoginPage.password.setValue('password');
    await LoginPage.submit();

    await expect(MyPage.email).toHaveText('clark@example.com');
    await expect(MyPage.username).toHaveText('Clark Evans');
    await expect(MyPage.rank).toHaveText('Premium');
    await expect(MyPage.address).toHaveText('Mountain View, California');
    await expect(MyPage.tel).toHaveText('01234567891');
    await expect(MyPage.gender).toHaveText('male');
    await expect(MyPage.birthday).toHaveText('not answered');
    await expect(MyPage.notification).toHaveText('received');
  });

  it('should be display preset user [diana]', async () => {
    await TopPage.open();
    await TopPage.goToLoginPage();
    await LoginPage.email.setValue('diana@example.com');
    await LoginPage.password.setValue('pass1234');
    await LoginPage.submit();

    await expect(MyPage.email).toHaveText('diana@example.com');
    await expect(MyPage.username).toHaveText('Diana Johansson');
    await expect(MyPage.rank).toHaveText('Normal');
    await expect(MyPage.address).toHaveText('Redmond, Washington');
    await expect(MyPage.tel).toHaveText('not answered');
    await expect(MyPage.gender).toHaveText('female');
    await expect(MyPage.birthday).toHaveText('April 1, 2000');
    await expect(MyPage.notification).toHaveText('not received');
  });

  it('should be display preset user [ororo]', async () => {
    await TopPage.open();
    await TopPage.goToLoginPage();
    await LoginPage.email.setValue('ororo@example.com');
    await LoginPage.password.setValue('pa55w0rd!');
    await LoginPage.submit();

    await expect(MyPage.email).toHaveText('ororo@example.com');
    await expect(MyPage.username).toHaveText('Ororo Saldana');
    await expect(MyPage.rank).toHaveText('Premium');
    await expect(MyPage.address).toHaveText('Cupertino, California');
    await expect(MyPage.tel).toHaveText('01212341234');
    await expect(MyPage.gender).toHaveText('other');
    await expect(MyPage.birthday).toHaveText('December 17, 1988');
    await expect(MyPage.notification).toHaveText('not received');
  });

  it('should be display preset user [miles]', async () => {
    await TopPage.open();
    await TopPage.goToLoginPage();
    await LoginPage.email.setValue('miles@example.com');
    await LoginPage.password.setValue('pass-pass');
    await LoginPage.submit();

    await expect(MyPage.email).toHaveText('miles@example.com');
    await expect(MyPage.username).toHaveText('Miles Boseman');
    await expect(MyPage.rank).toHaveText('Normal');
    await expect(MyPage.address).toHaveText('not answered');
    await expect(MyPage.tel).toHaveText('01298765432');
    await expect(MyPage.gender).toHaveText('not answered');
    await expect(MyPage.birthday).toHaveText('August 31, 1992');
    await expect(MyPage.notification).toHaveText('received');
  });

  it('should be display new user', async () => {
    await TopPage.open();
    await TopPage.goToSignupPage();
    await SignupPage.email.setValue('new-user@example.com');
    await SignupPage.password.setValue('11111111');
    await SignupPage.passwordConfirmation.setValue('11111111');
    await SignupPage.username.setValue('Jane Doe');
    await SignupPage.rankNormal.click();
    await SignupPage.address.setValue('Detroit, Michigan');
    await SignupPage.tel.setValue('09876543211');
    await SignupPage.gender.selectByVisibleText('female');
    await SignupPage.setBirthday('2000-01-01');
    await SignupPage.setNotification(false);
    await SignupPage.submit();

    await expect(MyPage.email).toHaveText('new-user@example.com');
    await expect(MyPage.username).toHaveText('Jane Doe');
    await expect(MyPage.rank).toHaveText('Normal');
    await expect(MyPage.address).toHaveText('Detroit, Michigan');
    await expect(MyPage.tel).toHaveText('09876543211');
    await expect(MyPage.gender).toHaveText('female');
    await expect(MyPage.birthday).toHaveText('January 1, 2000');
    await expect(MyPage.notification).toHaveText('not received');
  });

  it('should be an error selecting not image on icon setting', async () => {
    await TopPage.open();
    await TopPage.goToLoginPage();
    await LoginPage.email.setValue('new-user@example.com');
    await LoginPage.password.setValue('11111111');
    await LoginPage.submit();
    await MyPage.iconLink.click();
    const filePath = path.join(__dirname, '..', 'uploadfiles', 'dummy.txt');
    await IconPage.icon.setValue(filePath);

    await expect(IconPage.iconMessage).toHaveText('Please select an image file.');
  });

  it('should be an error selecting over 10KB file on icon setting', async () => {
    await TopPage.open();
    await TopPage.goToLoginPage();
    await LoginPage.email.setValue('new-user@example.com');
    await LoginPage.password.setValue('11111111');
    await LoginPage.submit();
    await MyPage.iconLink.click();
    const filePath = path.join(__dirname, '..', 'uploadfiles', '240x240_12.png');
    await IconPage.icon.setValue(filePath);

    await expect(IconPage.iconMessage).toHaveText('Please select a file with a size of 10 KB or less.');
  });

  it('should be display icon image', async () => {
    await TopPage.open();
    await TopPage.goToLoginPage();
    await LoginPage.email.setValue('new-user@example.com');
    await LoginPage.password.setValue('11111111');
    await LoginPage.submit();
    await MyPage.iconLink.click();
    const filePath = path.join(__dirname, '..', 'uploadfiles', '240x240_01.png');
    await IconPage.icon.setValue(filePath);
    await IconPage.setZoom(80);
    await IconPage.setColor('#000000');
    await IconPage.submit();

    await expect(MyPage.iconImage).toExist();
    // expect(MyPage.iconImage).toHaveAttribute('width', '70');async 
    await expect((await MyPage.iconImage.getCSSProperty('backgroundColor')).value).toBe('rgba(0,0,0,1)');
  });

  it('should delete new user', async () => {
    await TopPage.open();
    await TopPage.goToLoginPage();
    await LoginPage.email.setValue('new-user@example.com');
    await LoginPage.password.setValue('11111111');
    await LoginPage.submit();
    await MyPage.delete();

    await expect(await browser.getAlertText()).toBe('If you cancel your membership, all information will be deleted.\nDo you wish to proceed?');
    await browser.acceptAlert();
    await browser.pause(1000); // eslint-disable-line wdio/no-pause
    await expect(await browser.getAlertText()).toBe('The process has been completed. Thank you for your service.');
    await browser.acceptAlert();
    await expect(browser).toHaveUrl('index.html', {containing: true});
  });
});
