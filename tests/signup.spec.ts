import { test, expect } from '@playwright/test';

test('sign up success', {tag: '@positive'}, async ({ page }) => {
  await page.goto('https://demoblaze.com/');
  await page.getByRole('link', { name: 'Sign up' }).click();

  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');   
  const day = String(now.getDate()).padStart(2, '0');          
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');
  const timestamp = `${month}${day}${hour}${minute}${second}`;
  const randomUsername = 'useryd' + timestamp;
  
  await page.getByRole('textbox', { name: 'Username:' }).fill(randomUsername);
  console.log(randomUsername);
  await page.getByRole('textbox', { name: 'Password:' }).fill('Pswd1234');
  
  const dialogPromise = page.waitForEvent('dialog');
  await page.getByRole('button', { name: 'Sign up' }).click();
  const dialog = await dialogPromise;
  console.log(dialog.message());
  expect(dialog.message()).toBe('Sign up successful.');
  await dialog.accept();

  // page.on('dialog', async dialog => {  //somehow feels like it was skipped, maybe because sometimes it failed to detect the dialog maybe
  //   console.log('===> Test logic running!');
  //   await page.getByRole('button', { name: 'Sign up' }).click();
  //   console.log(`Dialog message: ${dialog.message()}`);
    
  //   expect(dialog.message()).toBe('Sign up successful.');
  //   console.log('✅ Dialog message matched');
  //   await dialog.accept();  
  // });
  
});

