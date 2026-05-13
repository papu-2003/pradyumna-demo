const { chromium } = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;
const fs = require('fs');

(async () => {
  const url = process.argv[2];

  if (!url) {
    console.log("❌ Please provide URL");
    process.exit(1);
  }

  console.log("🚀 Starting scan...");
  console.log("🌐 Opening:", url);

  const browser = await chromium.launch({
    headless: true
  });

  const context = await browser.newContext({
    ignoreHTTPSErrors: true
  });

  const page = await context.newPage();

  await page.goto(url, {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });

  await page.waitForTimeout(5000);

  const results = await new AxeBuilder({ page }).analyze();

  fs.writeFileSync('axe-report.json', JSON.stringify(results, null, 2));

  console.log("✅ Scan completed");
  console.log("🔍 Violations:", results.violations.length);

  await browser.close();
})();
