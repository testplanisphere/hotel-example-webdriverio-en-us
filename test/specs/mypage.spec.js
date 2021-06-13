const path = require('path');
const IconPage = require('../pageobjects/icon.page');
const LoginPage = require('../pageobjects/login.page');
const MyPage = require('../pageobjects/my.page');
const SignupPage = require('../pageobjects/signup.page');
const TopPage = require('../pageobjects/top.page');

describe('MyPage', () => {
  it('should be display preset user [clark]', () => {
    TopPage.open();
    TopPage.goToLoginPage();
    LoginPage.email.setValue('clark@example.com');
    LoginPage.password.setValue('password');
    LoginPage.submit();

    expect(MyPage.email).toHaveText('clark@example.com');
    expect(MyPage.username).toHaveText('Clark Evans');
    expect(MyPage.rank).toHaveText('Premium');
    expect(MyPage.address).toHaveText('Mountain View, California');
    expect(MyPage.tel).toHaveText('01234567891');
    expect(MyPage.gender).toHaveText('male');
    expect(MyPage.birthday).toHaveText('not answered');
    expect(MyPage.notification).toHaveText('received');
  });

  it('should be display preset user [diana]', () => {
    TopPage.open();
    TopPage.goToLoginPage();
    LoginPage.email.setValue('diana@example.com');
    LoginPage.password.setValue('pass1234');
    LoginPage.submit();

    expect(MyPage.email).toHaveText('diana@example.com');
    expect(MyPage.username).toHaveText('Diana Johansson');
    expect(MyPage.rank).toHaveText('Normal');
    expect(MyPage.address).toHaveText('Redmond, Washington');
    expect(MyPage.tel).toHaveText('not answered');
    expect(MyPage.gender).toHaveText('female');
    expect(MyPage.birthday).toHaveText('April 1, 2000');
    expect(MyPage.notification).toHaveText('not received');
  });

  it('should be display preset user [ororo]', () => {
    TopPage.open();
    TopPage.goToLoginPage();
    LoginPage.email.setValue('ororo@example.com');
    LoginPage.password.setValue('pa55w0rd!');
    LoginPage.submit();

    expect(MyPage.email).toHaveText('ororo@example.com');
    expect(MyPage.username).toHaveText('Ororo Saldana');
    expect(MyPage.rank).toHaveText('Premium');
    expect(MyPage.address).toHaveText('Cupertino, California');
    expect(MyPage.tel).toHaveText('01212341234');
    expect(MyPage.gender).toHaveText('other');
    expect(MyPage.birthday).toHaveText('December 17, 1988');
    expect(MyPage.notification).toHaveText('not received');
  });

  it('should be display preset user [miles]', () => {
    TopPage.open();
    TopPage.goToLoginPage();
    LoginPage.email.setValue('miles@example.com');
    LoginPage.password.setValue('pass-pass');
    LoginPage.submit();

    expect(MyPage.email).toHaveText('miles@example.com');
    expect(MyPage.username).toHaveText('Miles Boseman');
    expect(MyPage.rank).toHaveText('Normal');
    expect(MyPage.address).toHaveText('not answered');
    expect(MyPage.tel).toHaveText('01298765432');
    expect(MyPage.gender).toHaveText('not answered');
    expect(MyPage.birthday).toHaveText('August 31, 1992');
    expect(MyPage.notification).toHaveText('received');
  });

  it('should be display new user', () => {
    TopPage.open();
    TopPage.goToSignupPage();
    SignupPage.email.setValue('new-user@example.com');
    SignupPage.password.setValue('11111111');
    SignupPage.passwordConfirmation.setValue('11111111');
    SignupPage.username.setValue('Jane Doe');
    SignupPage.rankNormal.click();
    SignupPage.address.setValue('Detroit, Michigan');
    SignupPage.tel.setValue('09876543211');
    SignupPage.gender.selectByVisibleText('female');
    SignupPage.setBirthday('2000-01-01');
    SignupPage.setNotification(false);
    SignupPage.submit();

    expect(MyPage.email).toHaveText('new-user@example.com');
    expect(MyPage.username).toHaveText('Jane Doe');
    expect(MyPage.rank).toHaveText('Normal');
    expect(MyPage.address).toHaveText('Detroit, Michigan');
    expect(MyPage.tel).toHaveText('09876543211');
    expect(MyPage.gender).toHaveText('female');
    expect(MyPage.birthday).toHaveText('January 1, 2000');
    expect(MyPage.notification).toHaveText('not received');
  });

  it('should be an error selecting not image on icon setting', () => {
    TopPage.open();
    TopPage.goToLoginPage();
    LoginPage.email.setValue('new-user@example.com');
    LoginPage.password.setValue('11111111');
    LoginPage.submit();
    MyPage.iconLink.click();
    const filePath = path.join(__dirname, '..', 'uploadfiles', 'dummy.txt');
    IconPage.icon.setValue(filePath);

    expect(IconPage.iconMessage).toHaveText('Please select an image file.');
  });

  it('should be an error selecting over 10KB file on icon setting', () => {
    TopPage.open();
    TopPage.goToLoginPage();
    LoginPage.email.setValue('new-user@example.com');
    LoginPage.password.setValue('11111111');
    LoginPage.submit();
    MyPage.iconLink.click();
    const filePath = path.join(__dirname, '..', 'uploadfiles', '240x240_12.png');
    IconPage.icon.setValue(filePath);

    expect(IconPage.iconMessage).toHaveText('Please select a file with a size of 10 KB or less.');
  });

  it('should be display icon image', () => {
    TopPage.open();
    TopPage.goToLoginPage();
    LoginPage.email.setValue('new-user@example.com');
    LoginPage.password.setValue('11111111');
    LoginPage.submit();
    MyPage.iconLink.click();
    const filePath = path.join(__dirname, '..', 'uploadfiles', '240x240_01.png');
    IconPage.icon.setValue(filePath);
    IconPage.setZoom(80);
    IconPage.setColor('#000000');
    IconPage.submit();

    expect(MyPage.iconImage).toExist();
    // expect(MyPage.iconImage).toHaveAttribute('width', '70');
    expect(MyPage.iconImage.getCSSProperty('backgroundColor').value).toBe('rgba(0,0,0,1)');
  });

  it('should delete new user', () => {
    TopPage.open();
    TopPage.goToLoginPage();
    LoginPage.email.setValue('new-user@example.com');
    LoginPage.password.setValue('11111111');
    LoginPage.submit();
    MyPage.delete();

    expect(browser.getAlertText()).toBe('If you cancel your membership, all information will be deleted.\nDo you wish to proceed?');
    browser.acceptAlert();
    browser.pause(1000);
    expect(browser.getAlertText()).toBe('The process has been completed. Thank you for your service.');
    browser.acceptAlert();
    expect(browser).toHaveUrl('index.html', {containing: true});
  });
});
