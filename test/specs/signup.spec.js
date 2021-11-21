const MyPage = require('../pageobjects/my.page');
const SignupPage = require('../pageobjects/signup.page');
const TopPage = require('../pageobjects/top.page');

describe('Sign up', () => {
  it('should be successful sign up', async () => {
    await TopPage.open();
    await TopPage.goToSignupPage();
    await SignupPage.email.setValue('new-user@example.com');
    await SignupPage.password.setValue('password');
    await SignupPage.passwordConfirmation.setValue('password');
    await SignupPage.username.setValue('new user 1');
    await SignupPage.rankNormal.click();
    await SignupPage.address.setValue('New York City');
    await SignupPage.tel.setValue('01234567891');
    await SignupPage.gender.selectByVisibleText('female');
    await SignupPage.setBirthday('2000-01-01');
    await SignupPage.setNotification(true);
    await SignupPage.submit();

    await expect(MyPage.header).toHaveText('MyPage');
  });

  it('should be an error when blank', async () => {
    await TopPage.open();
    await TopPage.goToSignupPage();
    await SignupPage.email.setValue('');
    await SignupPage.password.setValue('');
    await SignupPage.passwordConfirmation.setValue('');
    await SignupPage.username.setValue('');
    await SignupPage.rankPremium.click();
    await SignupPage.address.setValue('');
    await SignupPage.tel.setValue('');
    await SignupPage.gender.selectByVisibleText('I do not answer.');
    await SignupPage.setBirthday('');
    await SignupPage.setNotification(false);
    await SignupPage.submit();

    await expect(SignupPage.emailMessage).toHaveText('Please fill out this field.');
    await expect(SignupPage.passwordMessage).toHaveText('Please fill out this field.');
    await expect(SignupPage.passwordConfirmationMessage).toHaveText('Please fill out this field.');
    await expect(SignupPage.usernameMessage).toHaveText('Please fill out this field.');
    await expect(SignupPage.addressMessage).toHaveText('');
    await expect(SignupPage.telMessage).toHaveText('');
    await expect(SignupPage.genderMessage).toHaveText('');
    await expect(SignupPage.birthdayMessage).toHaveText('');
  });

  it('should be an error when invalid value', async () => {
    await TopPage.open();
    await TopPage.goToSignupPage();
    await SignupPage.email.setValue('a');
    await SignupPage.password.setValue('1234567');
    await SignupPage.passwordConfirmation.setValue('1');
    await SignupPage.username.setValue('tester tester');
    await SignupPage.rankNormal.click();
    await SignupPage.address.setValue('Chicago, Illinois');
    await SignupPage.tel.setValue('1234567890');
    await SignupPage.gender.selectByVisibleText('other');
    await SignupPage.setBirthday('2000-01-01');
    await SignupPage.setNotification(true);
    await SignupPage.submit();

    await expect(SignupPage.emailMessage).toHaveText('Please enter a non-empty email address.');
    await expect(SignupPage.passwordMessage).toHaveText('Please lengthen this text to 8 characters or more.');
    await expect(SignupPage.passwordConfirmationMessage).toHaveText('Please lengthen this text to 8 characters or more.');
    await expect(SignupPage.usernameMessage).toHaveText('');
    await expect(SignupPage.addressMessage).toHaveText('');
    await expect(SignupPage.telMessage).toHaveText('Please match the requested format.');
    await expect(SignupPage.genderMessage).toHaveText('');
    await expect(SignupPage.birthdayMessage).toHaveText('');
  });

  it('should be an error when email has already been taken', async () => {
    await TopPage.open();
    await TopPage.goToSignupPage();
    await SignupPage.email.setValue('new-user@example.com');
    await SignupPage.password.setValue('password');
    await SignupPage.passwordConfirmation.setValue('password');
    await SignupPage.username.setValue('new user 1');
    await SignupPage.rankNormal.click();
    await SignupPage.address.setValue('Las Vegas, Nevada');
    await SignupPage.tel.setValue('01234567891');
    await SignupPage.gender.selectByVisibleText('female');
    await SignupPage.setBirthday('2000-01-01');
    await SignupPage.setNotification(true);
    await SignupPage.submit();

    await expect(SignupPage.emailMessage).toHaveText('Email has already been taken.');
  });

  it('should be an error when password doesn\'t match', async () => {
    await TopPage.open();
    await TopPage.goToSignupPage();
    await SignupPage.email.setValue('new-user@example.com');
    await SignupPage.password.setValue('password');
    await SignupPage.passwordConfirmation.setValue('123456789');
    await SignupPage.rankNormal.click();
    await SignupPage.address.setValue('Kansas City, Missouri');
    await SignupPage.tel.setValue('01234567891');
    await SignupPage.gender.selectByVisibleText('female');
    await SignupPage.setBirthday('2000-01-01');
    await SignupPage.setNotification(true);
    await SignupPage.submit();

    await expect(SignupPage.passwordConfirmationMessage).toHaveText('Password doesn\'t match.');
  });
});
