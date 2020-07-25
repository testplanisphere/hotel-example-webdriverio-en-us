const LoginPage = require('../pageobjects/login.page');
const MyPage = require('../pageobjects/my.page');
const TopPage = require('../pageobjects/top.page');

describe('Login', () => {
  it('should be successful logged in preset user', () => {
    TopPage.open();
    TopPage.goToLoginPage();
    LoginPage.email.setValue('clark@example.com');
    LoginPage.password.setValue('password');
    LoginPage.submit();

    expect(MyPage.header).toHaveText('MyPage');
  });

  it('should be an error when empty input', () => {
    TopPage.open();
    TopPage.goToLoginPage();
    LoginPage.email.setValue('');
    LoginPage.password.setValue('');
    LoginPage.submit();

    expect(LoginPage.emailMessage).toHaveText('Please fill out this field.');
    expect(LoginPage.passwordMessage).toHaveText('Please fill out this field.');
  });

  it('should be an error when invalid user', () => {
    TopPage.open();
    TopPage.goToLoginPage();
    LoginPage.email.setValue('error@example.com');
    LoginPage.password.setValue('error');
    LoginPage.submit();

    expect(LoginPage.emailMessage).toHaveText('Email or password is invalid.');
    expect(LoginPage.passwordMessage).toHaveText('Email or password is invalid.');
  });
});
