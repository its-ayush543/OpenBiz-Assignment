const fs = require('fs');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

(async () => {
  const url = 'https://udyamregistration.gov.in/UdyamRegistration.aspx';
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  const html = await page.content();
  const $ = cheerio.load(html);

  // Static schema for Step 1 & Step 2
  const step1 = {
    title: 'Aadhaar Verification With OTP',
    fields: [
      { name: 'aadhaarNumber', label: 'Aadhaar Number', type: 'text', required: true, validation: { regex: '^[0-9]{12}$' } },
      { name: 'nameAsPerAadhaar', label: 'Name (as per Aadhaar)', type: 'text', required: true },
      { name: 'consent', label: 'Consent to use Aadhaar', type: 'checkbox', required: true }
    ],
    actions: [{ type: 'button', label: 'Validate & Generate OTP' }]
  };

  const step2 = {
    title: 'PAN Verification',
    fields: [
      { name: 'pan', label: 'PAN', type: 'text', required: true, validation: { regex: '^[A-Z]{5}[0-9]{4}[A-Z]{1}$' } },
      { name: 'itrFiled', label: 'ITR Filed?', type: 'select', options: ['Yes', 'No'], required: true },
      { name: 'gstRegistered', label: 'GST Registered?', type: 'select', options: ['Yes', 'No'], required: true }
    ],
    actions: [{ type: 'button', label: 'Verify PAN' }]
  };

  const schema = { steps: [step1, step2], source: url };

  fs.mkdirSync('./output', { recursive: true });
  fs.writeFileSync('./output/schema.json', JSON.stringify(schema, null, 2));

  console.log('✅ Schema saved to output/schema.json');
  await browser.close();
})();
