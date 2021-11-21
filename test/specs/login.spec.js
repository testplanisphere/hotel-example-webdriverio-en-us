const LoginPage = require('../pageobjects/login.page');
const MyPage = require('../pageobjects/my.page');
const TopPage = require('../pageobjects/top.page');

describe('Login', () => {
  it('should be successful logged in preset user', async () => {
    await TopPage.open();
    await TopPage.goToLoginPage();
    await LoginPage.email.setValue('clark@example.com');
    await LoginPage.password.setValue('password');
    await LoginPage.submit();

    await expect(MyPage.header).toHaveText('MyPage');
  });

  it('should be an error when empty input', async () => {
    await TopPage.open();
    await TopPage.goToLoginPage();
    await LoginPage.email.setValue('');
    await LoginPage.password.setValue('');
    await LoginPage.submit();

    await expect(LoginPage.emailMessage).toHaveText('Please fill out this field.');
    await expect(LoginPage.passwordMessage).toHaveText('Please fill out this field.');
  });

  it('should be an error when invalid user', async () => {
    await TopPage.open();
    await TopPage.goToLoginPage();
    await LoginPage.email.setValue('error@example.com');
    await LoginPage.password.setValue('error');
    await LoginPage.submit();

    await expect(LoginPage.emailMessage).toHaveText('Email or password is invalid.');
    await expect(LoginPage.passwordMessage).toHaveText('Email or password is invalid.');
  });
});
