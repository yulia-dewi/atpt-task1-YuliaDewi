import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('https://demoblaze.com/');
})

test('login user not exist', {tag: '@negative'}, async ({ page }) => {
  await page.getByRole('link', { name: 'Log in' }).click();
  await page.locator('#loginusername').fill('yulia_dewif');
  await page.locator('#loginpassword').fill('dfdfsdf');
  
  const dialogPromise = page.waitForEvent('dialog');
  await page.locator('//button[text()="Log in"]').click();
  const dialog = await dialogPromise;
  
  console.log(dialog.message());
  expect(dialog.message()).toBe('User does not exist.');
  await dialog.accept();
   
});

test('login without any mandatory', {tag: '@negative'}, async ({ page }) => {
  await page.getByRole('link', { name: 'Log in' }).click();
  
  page.on('dialog', async (dialog1) => { 
    const message = dialog1.message();
    console.log(message);
    expect(dialog1.message()).toBe('Please fill out Username and Password.');
    await dialog1.accept();
  });
  await page.locator('//button[text()="Log in"]').click();

});

test('login with only username', {tag: '@negative'}, async ({ page }) => {
  await page.getByRole('link', { name: 'Log in' }).click();
  await page.locator('#loginusername').fill('yulia_dewif');
  
  page.on('dialog', async (dialog1) => { 
    const message = dialog1.message();
    console.log(message);
    expect(dialog1.message()).toBe('Please fill out Username and Password.');
    await dialog1.accept();
  });
  await page.locator('//button[text()="Log in"]').click();
  

});

test('login with only password', {tag: '@negative'}, async ({ page }) => {
  await page.getByRole('link', { name: 'Log in' }).click();
  await page.locator('#loginpassword').fill('dfdfsdf');
  
  page.on('dialog', async (dialog1) => { 
    const message = dialog1.message();
    console.log(message);
    expect(dialog1.message()).toBe('Please fill out Username and Password.');
    await dialog1.accept();
  });
  await page.locator('//button[text()="Log in"]').click();
  

});