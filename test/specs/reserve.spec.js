const DateTime = require('luxon').DateTime;
const ConfirmPage = require('../pageobjects/confirm.page');
const LoginPage = require('../pageobjects/login.page');
const MyPage = require('../pageobjects/my.page');
const PlansPage = require('../pageobjects/plans.page');
const ReservePage = require('../pageobjects/reserve.page');
const RoomPage = require('../pageobjects/room.page');
const TopPage = require('../pageobjects/top.page');

describe('Reservation', () => {
  afterEach(async () => {
    if ((await browser.getWindowHandles()).length > 1) {
      await browser.closeWindow();
    }
    await browser.switchWindow(/^Plans.+$/);
  });

  it('should be display initial values [not logged in]' , async () => {
    await TopPage.open();
    await TopPage.goToPlansPage();
    await PlansPage.openPlanByTitle('Plan with special offers');
    await browser.switchWindow(/^Reservation.+$/);
    await ReservePage.submitButton.waitForClickable();

    const tomorrow = DateTime.local().plus({ days: 1 }).toFormat('LL/dd/yyyy');

    await expect(ReservePage.planName).toHaveText('Plan with special offers');
    await expect(ReservePage.reserveDate).toHaveValue(tomorrow);
    await expect(ReservePage.reserveTerm).toHaveValue('1');
    await expect(ReservePage.headCount).toHaveValue('1');
    await expect(ReservePage.email).not.toBeDisplayed();
    await expect(ReservePage.tel).not.toBeDisplayed();
    await ReservePage.contact.selectByVisibleText('By email');
    await expect(ReservePage.email).toBeDisplayed();
    await expect(ReservePage.tel).not.toBeDisplayed();
    await expect(ReservePage.email).toHaveValue('');
    await ReservePage.contact.selectByVisibleText('By telephone');
    await expect(ReservePage.email).not.toBeDisplayed();
    await expect(ReservePage.tel).toBeDisplayed();
    await expect(ReservePage.tel).toHaveValue('');

    await browser.switchToFrame(await ReservePage.roomFrame);
    await expect(RoomPage.header).toHaveText('Standard Twin');
    await browser.switchToFrame(null);
  });

  it('should be display initial values [logged in]' , async () => {
    await TopPage.open();
    await TopPage.goToLoginPage();
    await LoginPage.email.setValue('clark@example.com');
    await LoginPage.password.setValue('password');
    await LoginPage.submit();
    await MyPage.goToPlansPage();
    await PlansPage.openPlanByTitle('Premium plan');
    await browser.switchWindow(/^Reservation.+$/);
    await ReservePage.submitButton.waitForClickable();

    const tomorrow = DateTime.local().plus({ days: 1 }).toFormat('LL/dd/yyyy');

    await expect(ReservePage.planName).toHaveText('Premium plan');
    await expect(ReservePage.reserveDate).toHaveValue(tomorrow);
    await expect(ReservePage.reserveTerm).toHaveValue('1');
    await expect(ReservePage.headCount).toHaveValue('2');
    await expect(ReservePage.username).toHaveValue('Clark Evans');
    await expect(ReservePage.email).not.toBeDisplayed();
    await expect(ReservePage.tel).not.toBeDisplayed();
    await ReservePage.contact.selectByVisibleText('By email');
    await expect(ReservePage.email).toBeDisplayed();
    await expect(ReservePage.tel).not.toBeDisplayed();
    await expect(ReservePage.email).toHaveValue('clark@example.com');
    await ReservePage.contact.selectByVisibleText('By telephone');
    await expect(ReservePage.email).not.toBeDisplayed();
    await expect(ReservePage.tel).toBeDisplayed();
    await expect(ReservePage.tel).toHaveValue('01234567891');

    await browser.switchToFrame(await ReservePage.roomFrame);
    await expect(RoomPage.header).toHaveText('Premium Twin');
    await browser.switchToFrame(null);
  });

  it('should be an error when blank values' , async () => {
    await TopPage.open();
    await TopPage.goToPlansPage();
    await PlansPage.openPlanByTitle('Plan with special offers');
    await browser.switchWindow(/^Reservation.+$/);
    await ReservePage.submitButton.waitForClickable();

    await ReservePage.setReserveDate('');
    await ReservePage.reserveTerm.setValue('');
    await ReservePage.headCount.setValue('');
    await ReservePage.username.setValue('the tester');  // move focus

    await expect(ReservePage.reserveDateMessage).toHaveText('Please fill out this field.');
    await expect(ReservePage.reserveTermMessage).toHaveText('Please fill out this field.');
    await expect(ReservePage.headCountMessage).toHaveText('Please fill out this field.');
  });

  it('should be an error when invalid values [under]' , async () => {
    await TopPage.open();
    await TopPage.goToPlansPage();
    await PlansPage.openPlanByTitle('Plan with special offers');
    await browser.switchWindow(/^Reservation.+$/);
    await ReservePage.submitButton.waitForClickable();

    const today = DateTime.local().toFormat('LL/dd/yyyy');

    await ReservePage.setReserveDate(today);
    await ReservePage.reserveTerm.setValue('0');
    await ReservePage.headCount.setValue('0');
    await ReservePage.username.setValue('the tester');  // move focus

    await expect(ReservePage.reserveDateMessage).toHaveText('Please enter a date after tomorrow.');
    await expect(ReservePage.reserveTermMessage).toHaveText('Value must be greater than or equal to 1.');
    await expect(ReservePage.headCountMessage).toHaveText('Value must be greater than or equal to 1.');
  });

  it('should be an error when invalid values [over]' , async () => {
    await TopPage.open();
    await TopPage.goToPlansPage();
    await PlansPage.openPlanByTitle('Plan with special offers');
    await browser.switchWindow(/^Reservation.+$/);
    await ReservePage.submitButton.waitForClickable();

    const after90 = DateTime.local().plus({ days: 91 }).toFormat('LL/dd/yyyy');

    await ReservePage.setReserveDate(after90);
    await ReservePage.reserveTerm.setValue('10');
    await ReservePage.headCount.setValue('10');
    await ReservePage.username.setValue('the tester');  // move focus

    await expect(ReservePage.reserveDateMessage).toHaveText('Please enter a date within 3 months.');
    await expect(ReservePage.reserveTermMessage).toHaveText('Value must be less than or equal to 9.');
    await expect(ReservePage.headCountMessage).toHaveText('Value must be less than or equal to 9.');
  });

  it('should be an error when invalid values [string]' , async () => {
    await TopPage.open();
    await TopPage.goToPlansPage();
    await PlansPage.openPlanByTitle('Plan with special offers');
    await browser.switchWindow(/^Reservation.+$/);
    await ReservePage.submitButton.waitForClickable();

    await ReservePage.setReserveDate('12/3//345');
    await ReservePage.reserveTerm.setValue('a');  // cannot input
    await ReservePage.headCount.setValue('a');  // cannot input
    await ReservePage.username.setValue('テスト太郎');  // move focus

    await expect(ReservePage.reserveDateMessage).toHaveText('Please enter a valid value.');
    await expect(ReservePage.reserveTermMessage).toHaveText('Please fill out this field.');
    await expect(ReservePage.headCountMessage).toHaveText('Please fill out this field.');
  });

  it('should be an error when submitting [mail]' , async () => {
    await TopPage.open();
    await TopPage.goToPlansPage();
    await PlansPage.openPlanByTitle('Plan with special offers');
    await browser.switchWindow(/^Reservation.+$/);
    await ReservePage.submitButton.waitForClickable();

    await ReservePage.username.setValue('');
    await ReservePage.contact.selectByVisibleText('By email');
    await ReservePage.email.setValue('');
    await ReservePage.submit();

    await expect(ReservePage.usernameMessage).toHaveText('Please fill out this field.');
    await expect(ReservePage.emailMessage).toHaveText('Please fill out this field.');
  });

  it('should be an error when submitting [tel]' , async () => {
    await TopPage.open();
    await TopPage.goToPlansPage();
    await PlansPage.openPlanByTitle('Plan with special offers');
    await browser.switchWindow(/^Reservation.+$/);
    await ReservePage.submitButton.waitForClickable();

    await ReservePage.username.setValue('');
    await ReservePage.contact.selectByVisibleText('By telephone');
    await ReservePage.tel.setValue('');
    await ReservePage.submit();

    await expect(ReservePage.usernameMessage).toHaveText('Please fill out this field.');
    await expect(ReservePage.telMessage).toHaveText('Please fill out this field.');
  });

  it('should be successful the reservation [not logged in] [initial values]' , async () => {
    await TopPage.open();
    await TopPage.goToPlansPage();
    await PlansPage.openPlanByTitle('Plan with special offers');
    await browser.switchWindow(/^Reservation.+$/);
    await ReservePage.submitButton.waitForClickable();

    const expectedStart = DateTime.local().plus({ days: 1 });
    const expectedEnd = DateTime.local().plus({ days: 2 });
    let expectedTotalBill;
    if (expectedStart.weekday === 6 || expectedStart.weekday === 7) {
      expectedTotalBill = 'Total $87.50 (included taxes)';
    } else {
      expectedTotalBill = 'Total $70.00 (included taxes)';
    }
    const expectedTerm = `${expectedStart.toFormat('LLLL d, yyyy')} - ${expectedEnd.toFormat('LLLL d, yyyy')}. 1 night(s)`

    await ReservePage.username.setValue('the tester');
    await ReservePage.contact.selectByVisibleText('I don\'t need.');
    await ReservePage.submit();

    await expect(ConfirmPage.totalBill).toHaveText(expectedTotalBill);
    await expect(ConfirmPage.planName).toHaveText('Plan with special offers');
    await expect(ConfirmPage.term).toHaveText(expectedTerm);
    await expect(ConfirmPage.headCount).toHaveText('1 person(s)');
    await expect(ConfirmPage.plans).toHaveText('none');
    await expect(ConfirmPage.username).toHaveText('the tester');
    await expect(ConfirmPage.contact).toHaveText('not required');
    await expect(ConfirmPage.comment).toHaveText('none');

    await ConfirmPage.confirm();
    await expect(ConfirmPage.modalMessage).toHaveText('We look forward to visiting you.');
    await ConfirmPage.close();
    await expect(await browser.waitUntil(async () => (await browser.getWindowHandles()).length === 1)).toBeTruthy();
  });

  it('should be successful the reservation [logged in]' , async () => {
    await TopPage.open();
    await TopPage.goToLoginPage();
    await LoginPage.email.setValue('clark@example.com');
    await LoginPage.password.setValue('password');
    await LoginPage.submit();
    await MyPage.goToPlansPage();
    await PlansPage.openPlanByTitle('Premium plan');
    await browser.switchWindow(/^Reservation.+$/);
    await ReservePage.submitButton.waitForClickable();

    const expectedStart = DateTime.local().plus({ days: 90 });
    const expectedEnd = DateTime.local().plus({ days: 92 });
    let expectedTotalBill;
    if (expectedStart.weekday === 6) {
      expectedTotalBill = 'Total $1,120.00 (included taxes)';
    } else if (expectedStart.weekday === 5 || expectedStart.weekday === 7) {
      expectedTotalBill = 'Total $1,020.00 (included taxes)';
    } else {
      expectedTotalBill = 'Total $920.00 (included taxes)';
    }
    const expectedTerm = `${expectedStart.toFormat('LLLL d, yyyy')} - ${expectedEnd.toFormat('LLLL d, yyyy')}. 2 night(s)`

    await ReservePage.reserveTerm.setValue('2');
    await ReservePage.headCount.setValue('4');
    await ReservePage.setBreakfastPlan(true);
    await ReservePage.setEarlyCheckInPlan(true);
    await ReservePage.setSightseeingPlan(false);
    await ReservePage.contact.selectByVisibleText('By email');
    await ReservePage.comment.setValue('aaa\n\nbbbbbbb\ncc');
    await ReservePage.reserveDate.setValue(expectedStart.toFormat('LL/dd/yyyy'));
    await ReservePage.submit();

    await expect(ConfirmPage.totalBill).toHaveText(expectedTotalBill);
    await expect(ConfirmPage.planName).toHaveText('Premium plan');
    await expect(ConfirmPage.term).toHaveText(expectedTerm);
    await expect(ConfirmPage.headCount).toHaveText('4 person(s)');
    await expect(ConfirmPage.plans).toHaveTextContaining('Breakfast');
    await expect(ConfirmPage.plans).toHaveTextContaining('Early check-in');
    await expect(ConfirmPage.plans).not.toHaveTextContaining('Sightseeing');
    await expect(ConfirmPage.username).toHaveText('Clark Evans');
    await expect(ConfirmPage.contact).toHaveText('Email: clark@example.com');
    await expect(ConfirmPage.comment).toHaveText('aaa\n\nbbbbbbb\ncc');

    await ConfirmPage.confirm();
    await expect(ConfirmPage.modalMessage).toHaveText('We look forward to visiting you.');
    await ConfirmPage.close();
    await expect(await browser.waitUntil(async () => (await browser.getWindowHandles()).length === 1)).toBeTruthy();
  });
});
