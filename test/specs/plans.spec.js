const LoginPage = require('../pageobjects/login.page');
const MyPage = require('../pageobjects/my.page');
const PlansPage = require('../pageobjects/plans.page');
const TopPage = require('../pageobjects/top.page');

describe('Plans', () => {
  it('should be display plans when not logged in', () =>{
    TopPage.open();
    TopPage.goToPlansPage();
    const planTitles = PlansPage.getPlanTitles();

    expect(planTitles).toHaveLength(7);
    expect(planTitles[0]).toHaveText('Plan with special offers');
    expect(planTitles[1]).toHaveText('Staying without meals');
    expect(planTitles[2]).toHaveText('Business trip');
    expect(planTitles[3]).toHaveText('With beauty salon');
    expect(planTitles[4]).toHaveText('With private onsen');
    expect(planTitles[5]).toHaveText('For honeymoon');
    expect(planTitles[6]).toHaveText('With complimentary ticket');
  });

  it('should be display plans when logged in member', () =>{
    TopPage.open();
    TopPage.goToLoginPage();
    LoginPage.email.setValue('diana@example.com');
    LoginPage.password.setValue('pass1234');
    LoginPage.submit();
    MyPage.goToPlansPage();
    const planTitles = PlansPage.getPlanTitles();

    expect(planTitles).toHaveLength(9);
    expect(planTitles[0]).toHaveText('Plan with special offers');
    expect(planTitles[1]).toHaveText('With dinner');
    expect(planTitles[2]).toHaveText('Economical');
    expect(planTitles[3]).toHaveText('Staying without meals');
    expect(planTitles[4]).toHaveText('Business trip');
    expect(planTitles[5]).toHaveText('With beauty salon');
    expect(planTitles[6]).toHaveText('With private onsen');
    expect(planTitles[7]).toHaveText('For honeymoon');
    expect(planTitles[8]).toHaveText('With complimentary ticket');
  });

  it('should be display plans when logged in premium member', () =>{
    TopPage.open();
    TopPage.goToLoginPage();
    LoginPage.email.setValue('clark@example.com');
    LoginPage.password.setValue('password');
    LoginPage.submit();
    MyPage.goToPlansPage();
    const planTitles = PlansPage.getPlanTitles();

    expect(planTitles).toHaveLength(10);
    expect(planTitles[0]).toHaveText('Plan with special offers');
    expect(planTitles[1]).toHaveText('Premium plan');
    expect(planTitles[2]).toHaveText('With dinner');
    expect(planTitles[3]).toHaveText('Economical');
    expect(planTitles[4]).toHaveText('Staying without meals');
    expect(planTitles[5]).toHaveText('Business trip');
    expect(planTitles[6]).toHaveText('With beauty salon');
    expect(planTitles[7]).toHaveText('With private onsen');
    expect(planTitles[8]).toHaveText('For honeymoon');
    expect(planTitles[9]).toHaveText('With complimentary ticket');
  });
});
