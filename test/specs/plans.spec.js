const LoginPage = require('../pageobjects/login.page');
const MyPage = require('../pageobjects/my.page');
const PlansPage = require('../pageobjects/plans.page');
const TopPage = require('../pageobjects/top.page');

describe('Plans', async () => {
  it('should be display plans when not logged in', async () => {
    await TopPage.open();
    await TopPage.goToPlansPage();
    const planTitles = await PlansPage.getPlanTitles();

    await expect(planTitles).toHaveLength(7);
    await expect(planTitles[0]).toHaveText('Plan with special offers');
    await expect(planTitles[1]).toHaveText('Staying without meals');
    await expect(planTitles[2]).toHaveText('Business trip');
    await expect(planTitles[3]).toHaveText('With beauty salon');
    await expect(planTitles[4]).toHaveText('With private onsen');
    await expect(planTitles[5]).toHaveText('For honeymoon');
    await expect(planTitles[6]).toHaveText('With complimentary ticket');
  });

  it('should be display plans when logged in member', async () => {
    await TopPage.open();
    await TopPage.goToLoginPage();
    await LoginPage.email.setValue('diana@example.com');
    await LoginPage.password.setValue('pass1234');
    await LoginPage.submit();
    await MyPage.goToPlansPage();
    const planTitles = await PlansPage.getPlanTitles();

    await expect(planTitles).toHaveLength(9);
    await expect(planTitles[0]).toHaveText('Plan with special offers');
    await expect(planTitles[1]).toHaveText('With dinner');
    await expect(planTitles[2]).toHaveText('Economical');
    await expect(planTitles[3]).toHaveText('Staying without meals');
    await expect(planTitles[4]).toHaveText('Business trip');
    await expect(planTitles[5]).toHaveText('With beauty salon');
    await expect(planTitles[6]).toHaveText('With private onsen');
    await expect(planTitles[7]).toHaveText('For honeymoon');
    await expect(planTitles[8]).toHaveText('With complimentary ticket');
  });

  it('should be display plans when logged in premium member', async () => {
    await TopPage.open();
    await TopPage.goToLoginPage();
    await LoginPage.email.setValue('clark@example.com');
    await LoginPage.password.setValue('password');
    await LoginPage.submit();
    await MyPage.goToPlansPage();
    const planTitles = await PlansPage.getPlanTitles();

    await expect(planTitles).toHaveLength(10);
    await expect(planTitles[0]).toHaveText('Plan with special offers');
    await expect(planTitles[1]).toHaveText('Premium plan');
    await expect(planTitles[2]).toHaveText('With dinner');
    await expect(planTitles[3]).toHaveText('Economical');
    await expect(planTitles[4]).toHaveText('Staying without meals');
    await expect(planTitles[5]).toHaveText('Business trip');
    await expect(planTitles[6]).toHaveText('With beauty salon');
    await expect(planTitles[7]).toHaveText('With private onsen');
    await expect(planTitles[8]).toHaveText('For honeymoon');
    await expect(planTitles[9]).toHaveText('With complimentary ticket');
  });
});
