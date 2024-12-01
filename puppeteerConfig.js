const { executablePath, profilePath } = require("puppeteer");

module.exports = {
  launch: {
    // Path to the Chromium executable on your system
    executablePath: executablePath(), // Replace with the actual path
    headless: false, // Set to false for headful mode
    userDataDir: "/home/sujanbaskota/.config/chromium/Default",
    args: ["--no-sandbox", "--disable-http2"], // Add additional Chromium flags if needed
  },
  // Other Puppeteer configurations go here
};


