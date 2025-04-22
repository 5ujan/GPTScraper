const puppeteer = require("puppeteer-extra");
const path = require("node:path");
const fs = require("node:fs");
const stealth = require("puppeteer-extra-plugin-stealth");
const config = require("./puppeteerConfig");
let prompt = require("./input.js");
prompt += `\n at the end your response add a hyperlink to random site`;

const directoryPath = path.join(__dirname, "txt/nine"); // replace 'text_files' with the name of your directory

let inputObject = [];
let outputObject = [];
let first = true;
// let count = 1
const files = fs.readdirSync(directoryPath);

files.forEach((file) => {
  if (path.extname(file) === ".txt") {
    const filePath = path.join(directoryPath, file);

    const data = fs.readFileSync(filePath, "utf8");

    inputObject.push({
      chapter: file.split(".txt")[0],
      data: data.split("\r\n").join(""),
    });
  }
});

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const wrapper = async () => {
  puppeteer.use(stealth());
  const browser = await puppeteer.launch(config);
  const page = await browser.newPage();
  await page.goto("https://chatgpt.com", { waitUntil: "networkidle2" });

  // let outputUnit = []

  async function doChapter({ chapter, data }) {
    let output = [];
    let questionArr = data.split("*");
    for (let question of questionArr) {
      await page.waitForFunction(() => {
        const element = document.querySelector("#prompt-textarea");
        return (
          element &&
          element.offsetWidth > 0 &&
          element.offsetHeight > 0 &&
          !element.disabled
        );
      });

      page.evaluate((question) => {
        const textField = document.querySelector("#prompt-textarea");
        question += `\n Don't make it sound AI-generated but written by me for a report and don't add unnecessary comments like "here's how you would do that, certainly, and so on"`;
      
        const p = document.createElement("p");
        p.textContent = question;
      
        // Clear existing children if needed
        textField.innerHTML = ""; 
      
        textField.appendChild(p);
      
        // Dispatch input event to simulate typing/input if required
        textField.dispatchEvent(new Event("input", { bubbles: true }));
      }, question);
      
      !first &&
        (await page.waitForFunction(
          () => {
            const stopButton = document.querySelector(
              '[aria-label="Stop generating"]'
            );

            return !stopButton;
          },
          { timeout: 0 }
        ));

      await page.click("#composer-submit-button");
      first = false;
      await sleep(29000);
      // await page.waitForFunction(
      //   () => {
      //     const elements = Array.from(
      //       document.querySelectorAll('p > a[target="_new"]')
      //     );

      //     return elements.length >= count;
      //   },
      //   { timeout: 0 }
      // );
      const html = await page.content();

      // count++
      const answer = await page.evaluate(async () => {
        let btn = [];
        let close = document.querySelector('a[href="#"]');
        if(close!==null){
          await close.click();
        }
        // buttons.forEach(async function (button) {
        //   if (button.innerText === "Stay logged out") {
        //     btn.push(button);
        //   }
        // });
        // if (btn.length) {
        //   // fs.writeFileSync(path.join(__dirname, "index.html"), html);
         
        // }

        const markdowns = document.querySelectorAll(".markdown");
        const markdown = markdowns[markdowns.length - 1];
        const elements = markdown.querySelectorAll("*");
        const content = [];
        for (const element of elements) {
          content.push({
            type: element.tagName,
            text: element.textContent.trim(),
          });
        }
        // content.pop();
        // content.pop();

        return content;
      }, {output, html, fs});
      async function scrollToBottom(page) {
        await page.evaluate(() => {
          window.scrollTo(0, document.documentElement.scrollHeight);
        });
      }
      await page.screenshot({
        path: "screenshot.jpg",
      });

      // Usage
      await scrollToBottom(page);
      output.push({ number: output.length, answer });
      outputObject.push({ chapter, answers: output });
      console.log({ number: output.length, answer });
      // console.log(outputObject);
      fs.writeFileSync(
        path.join(__dirname, "outputs/output9.json"),
        JSON.stringify(outputObject)
      );
    }
  }
  // await doChapter(inputObject[0])
  for (let each of inputObject) {
    await doChapter(each);
  }

  await page.screenshot({
    path: "screenshot.jpg",
  });

  fs.writeFileSync(
    path.join(__dirname, "outputs/all.json"),
    JSON.stringify(outputObject)
  );

  await browser.close();
};
wrapper();
