const MyPage = require('../pageobjects/my.page');
const SignupPage = require('../pageobjects/signup.page');
const TopPage = require('../pageobjects/top.page');

describe('Sign up', () => {
  it('should be successful sign up', () => {
    TopPage.open();
    TopPage.goToSignupPage();
    SignupPage.email.setValue('new-user@example.com');
    SignupPage.password.setValue('password');
    SignupPage.passwordConfirmation.setValue('password');
    SignupPage.username.setValue('new user 1');
    SignupPage.rankNormal.click();
    SignupPage.address.setValue('New York City');
    SignupPage.tel.setValue('01234567891');
    SignupPage.gender.selectByVisibleText('female');
    SignupPage.setBirthday('2000-01-01');
    SignupPage.setNotification(true);
    SignupPage.submit();

    expect(MyPage.header).toHaveText('MyPage');
  });

  it('should be an error when blank', () => {
    TopPage.open();
    TopPage.goToSignupPage();
    SignupPage.email.setValue('');
    SignupPage.password.setValue('');
    SignupPage.passwordConfirmation.setValue('');
    SignupPage.username.setValue('');
    SignupPage.rankPremium.click();
    SignupPage.address.setValue('');
    SignupPage.tel.setValue('');
    SignupPage.gender.selectByVisibleText('I do not answer.');
    SignupPage.setBirthday('');
    SignupPage.setNotification(false);
    SignupPage.submit();

    expect(SignupPage.emailMessage).toHaveText('Please fill out this field.');
    expect(SignupPage.passwordMessage).toHaveText('Please fill out this field.');
    expect(SignupPage.passwordConfirmationMessage).toHaveText('Please fill out this field.');
    expect(SignupPage.usernameMessage).toHaveText('Please fill out this field.');
    expect(SignupPage.addressMessage).toHaveText('');
    expect(SignupPage.telMessage).toHaveText('');
    expect(SignupPage.genderMessage).toHaveText('');
    expect(SignupPage.birthdayMessage).toHaveText('');
  });

  it('should be an error when invalid value', () => {
    TopPage.open();
    TopPage.goToSignupPage();
    SignupPage.email.setValue('a');
    SignupPage.password.setValue('1234567');
    SignupPage.passwordConfirmation.setValue('1');
    SignupPage.username.setValue('tester tester');
    SignupPage.rankNormal.click();
    SignupPage.address.setValue('Chicago, Illinois');
    SignupPage.tel.setValue('1234567890');
    SignupPage.gender.selectByVisibleText('other');
    SignupPage.setBirthday('2000-01-01');
    SignupPage.setNotification(true);
    SignupPage.submit();

    expect(SignupPage.emailMessage).toHaveText('Please enter a non-empty email address.');
    expect(SignupPage.passwordMessage).toHaveText('Please lengthen this text to 8 characters or more.');
    expect(SignupPage.passwordConfirmationMessage).toHaveText('Please lengthen this text to 8 characters or more.');
    expect(SignupPage.usernameMessage).toHaveText('');
    expect(SignupPage.addressMessage).toHaveText('');
    expect(SignupPage.telMessage).toHaveText('Please match the requested format.');
    expect(SignupPage.genderMessage).toHaveText('');
    expect(SignupPage.birthdayMessage).toHaveText('');
  });

  it('should be an error when email has already been taken', () => {
    TopPage.open();
    TopPage.goToSignupPage();
    SignupPage.email.setValue('new-user@example.com');
    SignupPage.password.setValue('password');
    SignupPage.passwordConfirmation.setValue('password');
    SignupPage.username.setValue('new user 1');
    SignupPage.rankNormal.click();
    SignupPage.address.setValue('Las Vegas, Nevada');
    SignupPage.tel.setValue('01234567891');
    SignupPage.gender.selectByVisibleText('female');
    SignupPage.setBirthday('2000-01-01');
    SignupPage.setNotification(true);
    SignupPage.submit();

    expect(SignupPage.emailMessage).toHaveText('Email has already been taken.');
  });

  it('should be an error when password doesn\'t match', () => {
    TopPage.open();
    TopPage.goToSignupPage();
    SignupPage.email.setValue('new-user@example.com');
    SignupPage.password.setValue('password');
    SignupPage.passwordConfirmation.setValue('123456789');
    SignupPage.rankNormal.click();
    SignupPage.address.setValue('Kansas City, Missouri');
    SignupPage.tel.setValue('01234567891');
    SignupPage.gender.selectByVisibleText('female');
    SignupPage.setBirthday('2000-01-01');
    SignupPage.setNotification(true);
    SignupPage.submit();

    expect(SignupPage.passwordConfirmationMessage).toHaveText('Password doesn\'t match.');
  });
});
