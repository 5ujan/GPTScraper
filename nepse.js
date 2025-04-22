// const puppeteer = require('puppeteer');
const puppeteer = require("puppeteer-extra")
const stealth = require("puppeteer-extra-plugin-stealth");
console.log(stealth());


(async () => {
    puppeteer.use(stealth())
    const browser = await puppeteer.launch({
        executablePath: '/usr/bin/chromium-browser', // Update this with your actual path
        headless: true
    });
    const page = await browser.newPage();
    await page.goto('https://nepalstock.com');
    await page.screenshot({path:"nepse.png"})
})();
