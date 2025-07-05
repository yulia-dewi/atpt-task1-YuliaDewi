import { test, expect } from '@playwright/test';

test('add item per category and delete item - no login', {tag: '@additional'}, async ({ page }) => {
  await page.goto('https://demoblaze.com/');
//   await page.getByRole('link', { name: 'Log in' }).click();
//   await page.locator('#loginusername').fill('useryddeleteproduct');
//   await page.locator('#loginpassword').fill('Pswd1234');
//   await page.getByRole('button', { name: 'Log in' }).click();

  const itemCategory = ['Phones', 'Laptops', 'Monitors'];
  const categorizedItems = {
    Phones: [
      { name: 'Samsung galaxy s6', price: 360 },
      { name: 'Nokia lumia 1520', price: 820 },
      { name: 'Nexus 6', price: 650 },
    //   { name: 'Samsung galaxy s7', price: 800 },
    //   { name: 'Iphone 6 32gb', price: 790 },
    //   { name: 'Sony xperia z5', price: 320 },
    //   { name: 'HTC One M9', price: 700 }
    ],
    Laptops: [
      { name: 'Sony vaio i5', price: 790 },
    //   { name: 'Sony vaio i7', price: 790 },
    //   { name: 'MacBook air', price: 700 },
    //   { name: 'Dell i7 8gb', price: 700 },
      { name: '2017 Dell 15.6 Inch', price: 700 },
      // { name: 'MacBook Pro', price: 1100 }
    ],
    Monitors: [
      { name: 'Apple monitor 24', price: 400 },
      { name: 'ASUS Full HD', price: 230 }
    ]
  };

  for (const category of itemCategory) {  //not adding all products because sometimes the pages not loading correctly
  
    for (const item of categorizedItems[category]) {
      
      await page.locator(`a.list-group-item`, { hasText: category }).click();
      await page.locator('a', { hasText: item.name }).click();
      
      await Promise.all([
        page.waitForEvent('dialog'),
        await page.locator('//a[text()="Add to cart"]').click()
      ]).then(async ([dialog]) => {
        expect(dialog.message()).toContain('Product added');
        await dialog.accept();
      });
  
      await page.getByRole('link', { name: 'Home' }).click();
      
    }
  }

  await page.getByRole('link', { name: 'Cart' }).click();
  await page.waitForTimeout(2000);

  const productNameToDelete = 'Sony vaio i5';
  const rows = await page.$$('.success');

  for (const row of rows) {
    const nameCell = await row.$('td:nth-child(2)');
    const name = await nameCell?.innerText();

    if (name?.trim() === productNameToDelete) {
      const deleteLink = await row.$('a:text("Delete")');
      if (deleteLink) {
        await deleteLink.click();
        console.log(`Deleted item: ${productNameToDelete}`);
        break;
      }
    }
  }
 
  await expect(page.getByRole('cell', { name: 'Sony vaio i5' })).not.toBeVisible();

});