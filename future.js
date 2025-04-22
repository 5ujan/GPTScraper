const puppeteer = require("puppeteer-extra");
const stealth = require("puppeteer-extra-plugin-stealth");
const config = require("./puppeteerConfig");
let prompt = "write me a poem about js"
// prompt += `\n at the end your response add a hyperlink to random site`

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const wrapper = async () => {
  puppeteer.use(stealth());
  const browser = await puppeteer.launch(config);
  const page = await browser.newPage();
  await page.goto("https://chatgpt.com", { waitUntil: "networkidle2" });

  await page.waitForFunction(() => {
    const element = document.querySelector("#prompt-textarea");
    return (
      element &&
      element.offsetWidth > 0 &&
      element.offsetHeight > 0 &&
      !element.disabled
    );
  });

  await page.screenshot({
    path: "screenshot.jpg",
  });
  await page.evaluate((prompt) => {
    const textField = document.querySelector("#prompt-textarea>p");
    console.log(textField.querySelector("p"))
    textField.value = prompt;
    textField.dispatchEvent(new Event("input", { bubbles: true }));
  }, prompt);
  await page.click("[data-testid=send-button]");
  await sleep(15000)

  await page.screenshot({
    path: "photo.jpg",
  });

  // const markdownContent = await page.evaluate(() => {
  //   const markdown = document.querySelector(".markdown");
  //   const elements = markdown.querySelectorAll("*");
  //   const content = [];
  //   for (const element of elements) {
  //     content.push({
  //       type: element.tagName,
  //       text: element.textContent.trim(),
  //     });
  //   }
  //   return content

  // });
  // console.log(markdownContent);

  // await browser.close();
};
wrapper();
