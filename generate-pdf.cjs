const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  try {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    // Get the absolute path to the HTML file
    const htmlPath = 'file://' + path.join(__dirname, 'resume.html').replace(/\\/g, '/');
    console.log('Navigating to:', htmlPath);
    
    await page.goto(htmlPath, { waitUntil: 'networkidle2', timeout: 30000 });
    console.log('Page loaded');
    
    // Output path
    const outputPath = path.join(__dirname, 'public', 'Ali_Zain_Resume.pdf');
    
    console.log('Generating PDF...');
    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
    });

    console.log('PDF generated successfully at: ' + outputPath);
    await browser.close();
  } catch (error) {
    console.error('Error generating PDF:', error);
    process.exit(1);
  }
})();
