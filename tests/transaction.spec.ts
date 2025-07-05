import { test, expect } from '@playwright/test';

test('submit order success', {tag: '@positive'}, async ({ page }) => {
  await page.goto('https://demoblaze.com/');
  await page.getByRole('link', { name: 'Log in' }).click();
  await page.locator('#loginusername').fill('useryd');
  await page.locator('#loginpassword').fill('Pswd1234');
  await page.getByRole('button', { name: 'Log in' }).click();

  
  const products = [
    { name: 'Samsung galaxy s6', price: 360 },
    { name: 'Nokia lumia 1520', price: 820 },
    { name: 'HTC One M9', price: 700 }
  ];

  for (const product of products) {
    await page.locator(`//a[text()="${product.name}"]`).click();
    

    // Prepare to catch the alert BEFORE clicking "Add to cart"
    const dialogPromise = page.waitForEvent('dialog');

    await page.locator('//a[text()="Add to cart"]').click();

    const dialog = await dialogPromise;
    console.log(dialog.message());
    expect(dialog.message()).toBe('Product added.');
    await dialog.accept();

    // Go back to homepage for next product
    await page.getByRole('link', { name: 'Home' }).click();
    await page.waitForTimeout(1000); // wait for page to load
  }

  // Go to Cart
  await page.getByRole('link', { name: 'Cart' }).click();
  await page.waitForTimeout(2000); // allow cart table to render

  // Check product names and prices in cart
  let totalCalculated = 0;
  for (const product of products) {
    const row = page.locator(`//td[text()="${product.name}"]/..`);
    await expect(row.locator('td:nth-child(2)')).toHaveText(product.name);
    await expect(row.locator('td:nth-child(3)')).toHaveText(product.price.toString());
    totalCalculated += product.price;
  }

  // Check total value
  const totalText = await page.locator('#totalp').innerText();
  await expect(Number(totalText)).toBe(totalCalculated);
  await expect(totalCalculated).toBe(1880);
  console.log(totalCalculated);

  // Click "Place Order"
  await page.getByRole('button', { name: 'Place Order' }).click();
  await page.locator('//input[@id="name"]').fill('Safira');
  await page.locator('//input[@id="country"]').fill('Indonesia');
  await page.locator('//input[@id="city"]').fill('Jakarta');
  await page.locator('//input[@id="card"]').fill('4525472847442424');
  await page.locator('//input[@id="month"]').fill('December');
  await page.locator('//input[@id="year"]').fill('2028');
  await page.locator('//button[text()="Purchase"]').click();

  //const confirmationText = await page.locator('p.lead.text-muted').textContent();
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth(); // getMonth() is 0-based
  const year = today.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;
  console.log(formattedDate);

  await expect(page.getByRole('heading', { name: 'Thank you for your purchase!' })).toBeVisible();
  await expect(page.locator('p.lead')).toContainText(`Amount: ${totalCalculated} USD`);
  await expect(page.locator('p.lead')).toContainText('Card Number: 4525472847442424');
  await expect(page.locator('p.lead')).toContainText('Name: Safira');
  await expect(page.locator('p.lead')).toContainText(`Date: ${formattedDate}`); //demoblaze showing late 1 month, so getMonth not + 1
  
  await page.locator('//button[text()="OK"]').click();
  const closeBtn = page.locator('//button[text()="Purchase"] /parent::div//button[text()="Close"]');  //button[text()="Purchase"] //ancestor::div[1]//button[text()="Close"]
  if (await closeBtn.isVisible()) {
    await closeBtn.click();
  }
  //await page.locator('//button[text()="Purchase"] /parent::div//button[text()="Close"]').click(); 
  
  await page.locator('//a[text()="Log out"]').click();
  await expect (page.locator('//a[text()="Log in"]')).toBeVisible();
});