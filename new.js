const puppeteer = require('puppeteer-extra');
const stealth = require("puppeteer-extra-plugin-stealth");
const fs = require("fs")

const query = "Write me a poem about my love for js";
const sleep = async (ms) => { return new Promise((res) => setTimeout(res, ms)) };

(async () => {
    puppeteer.use(stealth());  
    const browser = await puppeteer.launch({
        executablePath: '/usr/bin/chromium-browser', 
        headless: false 
    });

    const page = await browser.newPage();
    await page.goto('https://chatgpt.com'); 

    await page.waitForSelector("#prompt-textarea");
    await page.waitForSelector("[data-testid=send-button]");

    // Enter the query text and send it
    await page.evaluate(async (query) => {
        try {
            const inputElement = document.querySelector("#prompt-textarea");
            const sendButton = document.querySelector("[data-testid=send-button]");
            console.log(sendButton)

            inputElement.textContent = query;
            // sendButton.click();
        } catch (e) {
            console.log("Error:", e);
        }
    }, query);
    await page.click("[data-testid=send-button]")
    await page.waitForSelector("[data-testid=copy-turn-action-button]")

    const ans = await page.evaluate(() => {
        try {
            const responseElement = document.querySelector(".markdown");
            return responseElement ? responseElement.textContent : 'No response found';
        } catch (e) {
            console.log("Error:", e);
            return 'Error retrieving response';
        }
    });

    console.log("Answer from ChatGPT:", ans);
    fs.writeFileSync("ans.json", JSON.stringify({ans}))

 
    await browser.close();
})();
