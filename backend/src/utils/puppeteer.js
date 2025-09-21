const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

const generatePDF = async (htmlContent, fileName) => {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    const reportsDir = path.join(__dirname, '../../reports');
    await fs.mkdir(reportsDir, { recursive: true });
    
    const filePath = path.join(reportsDir, fileName);
    await page.pdf({
      path: filePath,
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
    });
    
    return filePath;
  } catch (error) {
    throw error;
  } finally {
    if (browser) await browser.close();
  }
};

module.exports = { generatePDF };