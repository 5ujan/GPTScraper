const { executablePath, profilePath } = require("puppeteer");
// console.log(executablePath())
module.exports = {
    // Path to the Chromium executable on your system
    executablePath: "/usr/bin/chromium-browser", // Replace with the actual path
    headless: false, // Set to false for headful mode
    userDataDir: "/home/sbaskota/.config/chromium/Profile 2",
    args: ["--no-sandbox", "--disable-http2"], // Add additional Chromium flags if needed
  // Other Puppeteer configurations go here
};


