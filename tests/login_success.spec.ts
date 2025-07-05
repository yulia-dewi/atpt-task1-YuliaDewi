import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('https://demoblaze.com/');
})


test('login user success', {tag: '@positive'}, async ({ page }) => {
    await page.getByRole('link', { name: 'Log in' }).click();
    await page.locator('#loginusername').fill('useryd');
    await page.locator('#loginpassword').fill('Pswd1234');
    await page.getByRole('button', { name: 'Log in' }).click();

    await page.waitForTimeout(4000);
    await expect(page.getByRole('link', { name: 'Welcome useryd' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Log out' })).toBeVisible();

  //await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match any user in this service');
});