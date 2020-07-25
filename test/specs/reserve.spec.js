const moment = require('moment');
const ConfirmPage = require('../pageobjects/confirm.page');
const LoginPage = require('../pageobjects/login.page');
const MyPage = require('../pageobjects/my.page');
const PlansPage = require('../pageobjects/plans.page');
const ReservePage = require('../pageobjects/reserve.page');
const RoomPage = require('../pageobjects/room.page');
const TopPage = require('../pageobjects/top.page');

describe('Reservation', () => {
  afterEach(() => {
    if (browser.getWindowHandles().length > 1) {
      browser.closeWindow();
    }
    browser.switchWindow(/^Plans.+$/);
  });

  it('should be display initial values [not logged in]' , () => {
    TopPage.open();
    TopPage.goToPlansPage();
    PlansPage.openPlanByTitle('Plan with special offers');
    browser.switchWindow(/^Reservation.+$/);
    ReservePage.submitButton.waitForClickable();

    const tomorrow = moment().add(1, 'days').format('MM/DD/YYYY');

    expect(ReservePage.planName).toHaveText('Plan with special offers');
    expect(ReservePage.reserveDate).toHaveValue(tomorrow);
    expect(ReservePage.reserveTerm).toHaveValue('1');
    expect(ReservePage.headCount).toHaveValue('1');
    expect(ReservePage.email).not.toBeDisplayed();
    expect(ReservePage.tel).not.toBeDisplayed();
    ReservePage.contact.selectByVisibleText('By email');
    expect(ReservePage.email).toBeDisplayed();
    expect(ReservePage.tel).not.toBeDisplayed();
    expect(ReservePage.email).toHaveValue('');
    ReservePage.contact.selectByVisibleText('By telephone');
    expect(ReservePage.email).not.toBeDisplayed();
    expect(ReservePage.tel).toBeDisplayed();
    expect(ReservePage.tel).toHaveValue('');

    browser.switchToFrame(ReservePage.roomFrame);
    expect(RoomPage.header).toHaveText('Standard Twin');
    browser.switchToFrame(null);
  });

  it('should be display initial values [logged in]' , () => {
    TopPage.open();
    TopPage.goToLoginPage();
    LoginPage.email.setValue('clark@example.com');
    LoginPage.password.setValue('password');
    LoginPage.submit();
    MyPage.goToPlansPage();
    PlansPage.openPlanByTitle('Premium plan');
    browser.switchWindow(/^Reservation.+$/);
    ReservePage.submitButton.waitForClickable();

    const tomorrow = moment().add(1, 'days').format('MM/DD/YYYY');

    expect(ReservePage.planName).toHaveText('Premium plan');
    expect(ReservePage.reserveDate).toHaveValue(tomorrow);
    expect(ReservePage.reserveTerm).toHaveValue('1');
    expect(ReservePage.headCount).toHaveValue('2');
    expect(ReservePage.username).toHaveValue('Clark Evans');
    expect(ReservePage.email).not.toBeDisplayed();
    expect(ReservePage.tel).not.toBeDisplayed();
    ReservePage.contact.selectByVisibleText('By email');
    expect(ReservePage.email).toBeDisplayed();
    expect(ReservePage.tel).not.toBeDisplayed();
    expect(ReservePage.email).toHaveValue('clark@example.com');
    ReservePage.contact.selectByVisibleText('By telephone');
    expect(ReservePage.email).not.toBeDisplayed();
    expect(ReservePage.tel).toBeDisplayed();
    expect(ReservePage.tel).toHaveValue('01234567891');

    browser.switchToFrame(ReservePage.roomFrame);
    expect(RoomPage.header).toHaveText('Premium Twin');
    browser.switchToFrame(null);
  });

  it('should be an error when blank values' , () => {
    TopPage.open();
    TopPage.goToPlansPage();
    PlansPage.openPlanByTitle('Plan with special offers');
    browser.switchWindow(/^Reservation.+$/);
    ReservePage.submitButton.waitForClickable();

    ReservePage.setReserveDate('');
    ReservePage.reserveTerm.setValue('');
    ReservePage.headCount.setValue('');
    ReservePage.username.setValue('the tester');  // move focus

    expect(ReservePage.reserveDateMessage).toHaveText('Please fill out this field.');
    expect(ReservePage.reserveTermMessage).toHaveText('Please fill out this field.');
    expect(ReservePage.headCountMessage).toHaveText('Please fill out this field.');
  });

  it('should be an error when invalid values [under]' , () => {
    TopPage.open();
    TopPage.goToPlansPage();
    PlansPage.openPlanByTitle('Plan with special offers');
    browser.switchWindow(/^Reservation.+$/);
    ReservePage.submitButton.waitForClickable();

    const today = moment().format('MM/DD/YYYY');

    ReservePage.setReserveDate(today);
    ReservePage.reserveTerm.setValue('0');
    ReservePage.headCount.setValue('0');
    ReservePage.username.setValue('the tester');  // move focus

    expect(ReservePage.reserveDateMessage).toHaveText('Please enter a date after tomorrow.');
    expect(ReservePage.reserveTermMessage).toHaveText('Value must be greater than or equal to 1.');
    expect(ReservePage.headCountMessage).toHaveText('Value must be greater than or equal to 1.');
  });

  it('should be an error when invalid values [over]' , () => {
    TopPage.open();
    TopPage.goToPlansPage();
    PlansPage.openPlanByTitle('Plan with special offers');
    browser.switchWindow(/^Reservation.+$/);
    ReservePage.submitButton.waitForClickable();

    const after90 = moment().add(91, 'days').format('MM/DD/YYYY');

    ReservePage.setReserveDate(after90);
    ReservePage.reserveTerm.setValue('10');
    ReservePage.headCount.setValue('10');
    ReservePage.username.setValue('the tester');  // move focus

    expect(ReservePage.reserveDateMessage).toHaveText('Please enter a date within 3 months.');
    expect(ReservePage.reserveTermMessage).toHaveText('Value must be less than or equal to 9.');
    expect(ReservePage.headCountMessage).toHaveText('Value must be less than or equal to 9.');
  });

  it('should be an error when invalid values [string]' , () => {
    TopPage.open();
    TopPage.goToPlansPage();
    PlansPage.openPlanByTitle('Plan with special offers');
    browser.switchWindow(/^Reservation.+$/);
    ReservePage.submitButton.waitForClickable();

    ReservePage.setReserveDate('12/3//345');
    ReservePage.reserveTerm.setValue('a');  // cannot input
    ReservePage.headCount.setValue('a');  // cannot input
    ReservePage.username.setValue('テスト太郎');  // move focus

    expect(ReservePage.reserveDateMessage).toHaveText('Please enter a valid value.');
    expect(ReservePage.reserveTermMessage).toHaveText('Please fill out this field.');
    expect(ReservePage.headCountMessage).toHaveText('Please fill out this field.');
  });

  it('should be an error when submitting [mail]' , () => {
    TopPage.open();
    TopPage.goToPlansPage();
    PlansPage.openPlanByTitle('Plan with special offers');
    browser.switchWindow(/^Reservation.+$/);
    ReservePage.submitButton.waitForClickable();

    ReservePage.username.setValue('');
    ReservePage.contact.selectByVisibleText('By email');
    ReservePage.email.setValue('');
    ReservePage.submit();

    expect(ReservePage.usernameMessage).toHaveText('Please fill out this field.');
    expect(ReservePage.emailMessage).toHaveText('Please fill out this field.');
  });

  it('should be an error when submitting [tel]' , () => {
    TopPage.open();
    TopPage.goToPlansPage();
    PlansPage.openPlanByTitle('Plan with special offers');
    browser.switchWindow(/^Reservation.+$/);
    ReservePage.submitButton.waitForClickable();

    ReservePage.username.setValue('');
    ReservePage.contact.selectByVisibleText('By telephone');
    ReservePage.tel.setValue('');
    ReservePage.submit();

    expect(ReservePage.usernameMessage).toHaveText('Please fill out this field.');
    expect(ReservePage.telMessage).toHaveText('Please fill out this field.');
  });

  it('should be successful the reservation [not logged in] [initial values]' , () => {
    TopPage.open();
    TopPage.goToPlansPage();
    PlansPage.openPlanByTitle('Plan with special offers');
    browser.switchWindow(/^Reservation.+$/);
    ReservePage.submitButton.waitForClickable();

    const expectedStart = moment().add(1, 'days');
    const expectedEnd = moment().add(2, 'days');
    let expectedTotalBill;
    if (expectedStart.day() === 0 || expectedStart.day() === 6) {
      expectedTotalBill = 'Total $87.50 (included taxes)';
    } else {
      expectedTotalBill = 'Total $70.00 (included taxes)';
    }
    const expectedTerm = `${expectedStart.format('MMMM D, YYYY')} - ${expectedEnd.format('MMMM D, YYYY')}. 1 night(s)`

    ReservePage.username.setValue('the tester');
    ReservePage.contact.selectByVisibleText('I don\'t need.');
    ReservePage.submit();

    expect(ConfirmPage.totalBill).toHaveText(expectedTotalBill);
    expect(ConfirmPage.planName).toHaveText('Plan with special offers');
    expect(ConfirmPage.term).toHaveText(expectedTerm);
    expect(ConfirmPage.headCount).toHaveText('1 person(s)');
    expect(ConfirmPage.plans).toHaveText('none');
    expect(ConfirmPage.username).toHaveText('the tester');
    expect(ConfirmPage.contact).toHaveText('not required');
    expect(ConfirmPage.comment).toHaveText('none');

    ConfirmPage.confirm();
    expect(ConfirmPage.modalMessage).toHaveText('We look forward to visiting you.');
    ConfirmPage.close();
    expect(browser.waitUntil(() => browser.getWindowHandles().length === 1)).toBeTruthy();
  });

  it('should be successful the reservation [logged in]' , () => {
    TopPage.open();
    TopPage.goToLoginPage();
    LoginPage.email.setValue('clark@example.com');
    LoginPage.password.setValue('password');
    LoginPage.submit();
    MyPage.goToPlansPage();
    PlansPage.openPlanByTitle('Premium plan');
    browser.switchWindow(/^Reservation.+$/);
    ReservePage.submitButton.waitForClickable();

    const expectedStart = moment().add(90, 'days');
    const expectedEnd = moment().add(92, 'days');
    let expectedTotalBill;
    if (expectedStart.day() === 6) {
      expectedTotalBill = 'Total $1,120.00 (included taxes)';
    } else if (expectedStart.day() === 0 || expectedStart.day() === 5) {
      expectedTotalBill = 'Total $1,020.00 (included taxes)';
    } else {
      expectedTotalBill = 'Total $920.00 (included taxes)';
    }
    const expectedTerm = `${expectedStart.format('MMMM D, YYYY')} - ${expectedEnd.format('MMMM D, YYYY')}. 2 night(s)`

    ReservePage.reserveTerm.setValue('2');
    ReservePage.headCount.setValue('4');
    ReservePage.setBreakfastPlan(true);
    ReservePage.setEarlyCheckInPlan(true);
    ReservePage.setSightseeingPlan(false);
    ReservePage.contact.selectByVisibleText('By email');
    ReservePage.comment.setValue('aaa\n\nbbbbbbb\ncc');
    ReservePage.reserveDate.setValue(expectedStart.format('MM/DD/YYYY'));
    ReservePage.submit();

    expect(ConfirmPage.totalBill).toHaveText(expectedTotalBill);
    expect(ConfirmPage.planName).toHaveText('Premium plan');
    expect(ConfirmPage.term).toHaveText(expectedTerm);
    expect(ConfirmPage.headCount).toHaveText('4 person(s)');
    expect(ConfirmPage.plans).toHaveTextContaining('Breakfast');
    expect(ConfirmPage.plans).toHaveTextContaining('Early check-in');
    expect(ConfirmPage.plans).not.toHaveTextContaining('Sightseeing');
    expect(ConfirmPage.username).toHaveText('Clark Evans');
    expect(ConfirmPage.contact).toHaveText('Email: clark@example.com');
    expect(ConfirmPage.comment).toHaveText('aaa\n\nbbbbbbb\ncc');

    ConfirmPage.confirm();
    expect(ConfirmPage.modalMessage).toHaveText('We look forward to visiting you.');
    ConfirmPage.close();
    expect(browser.waitUntil(() => browser.getWindowHandles().length === 1)).toBeTruthy();
  });
});
