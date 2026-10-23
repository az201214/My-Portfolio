const path = require("path");
const { pathToFileURL } = require("url");
const { chromium } = require("@playwright/test");

(async () => {
  const resumePath = path.join(__dirname, "resume.html");
  const outputPath = path.join(__dirname, "public", "Ali_Zain_Resume.pdf");
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROME_PATH || undefined,
  });
  try {
    const page = await browser.newPage();
    await page.goto(pathToFileURL(resumePath).href, {
      waitUntil: "networkidle",
    });
    await page.pdf({
      path: outputPath,
      format: "A4",
      printBackground: true,
      margin: { top: "0px", right: "0px", bottom: "0px", left: "0px" },
    });
    console.log(`PDF generated successfully at: ${outputPath}`);
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error("Error generating PDF:", error);
  process.exitCode = 1;
});
