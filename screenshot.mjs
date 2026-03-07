import { chromium } from 'playwright';
import { execSync } from 'child_process';

const browser = await chromium.launch();

// Base CSS: hide chrome + tagline, center the hero
const baseCSS = `
  .VPNav, .VPFeatures, .site-footer { display: none !important; }
  .ascii-tagline, .ascii-hero .actions, .ascii-hero .VPButton { display: none !important; }
  .ascii-hero {
    margin: 0 auto !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    min-height: 100vh !important;
    padding: 0 24px !important;
  }
`;

// Per-format CSS: scale up the logo and nudge vertical position
const scaleCSS = (scale, nudgeUp) => `
  .ascii-hero {
    max-width: none !important;
    margin: 0 auto !important;
    padding-bottom: ${nudgeUp}px !important;
  }
  .ascii-wrapper {
    transform: scale(${scale}) !important;
    transform-origin: center center !important;
  }
`;
const formatCSS = {
  logo: baseCSS + scaleCSS(1.3, 50),
  x: baseCSS + scaleCSS(1.4, 40),
  youtube: baseCSS + scaleCSS(2.2, 80),
  og: baseCSS + scaleCSS(1.5, 40),
};

async function screenshotPage(scheme, width, height, css) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.emulateMedia({ colorScheme: scheme });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: css });
  await page.waitForTimeout(1500);
  return page;
}

for (const scheme of ['dark', 'light']) {
  // --- Square profile logo (1024x1024) ---
  const logoPage = await screenshotPage(scheme, 1024, 1024, formatCSS.logo);
  await logoPage.screenshot({ path: `public/brand/logo-square-${scheme}.png` });
  await logoPage.close();

  // --- X/Bluesky banner (1500x500) ---
  const xPage = await screenshotPage(scheme, 1500, 500, formatCSS.x);
  await xPage.screenshot({ path: `public/brand/banner-x-${scheme}.png` });
  await xPage.close();

  // --- YouTube banner (2560x1440) ---
  const ytPage = await screenshotPage(scheme, 2560, 1440, formatCSS.youtube);
  await ytPage.screenshot({ path: `public/brand/banner-youtube-${scheme}.png` });
  await ytPage.close();

  // --- OG image (1200x630) ---
  const ogPage = await screenshotPage(scheme, 1200, 630, formatCSS.og);
  await ogPage.screenshot({ path: `public/og-image-${scheme}.png` });
  await ogPage.close();
}

await browser.close();
console.log('done');
