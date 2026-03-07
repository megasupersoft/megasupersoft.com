import { chromium } from 'playwright';
import { execSync } from 'child_process';

const browser = await chromium.launch();

for (const scheme of ['dark', 'light']) {
  // --- Square profile logo ---
  // Hide everything except ASCII art for a clean square crop
  const sqPage = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await sqPage.emulateMedia({ colorScheme: scheme });
  await sqPage.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await sqPage.waitForTimeout(2000);
  await sqPage.evaluate(() => {
    // Hide nav, tagline, buttons, features, footer — everything except ASCII pre
    document.querySelector('.VPNav')?.setAttribute('style', 'display:none!important');
    document.querySelector('.VPHero')?.setAttribute('style', 'display:none!important');
    document.querySelector('.VPFeatures')?.setAttribute('style', 'display:none!important');
    document.querySelector('.site-footer')?.setAttribute('style', 'display:none!important');
    // Hide tagline and actions within ascii-hero
    for (const el of document.querySelectorAll('.ascii-hero .tagline, .ascii-hero .ascii-tagline, .ascii-hero .actions, .ascii-hero .VPButton')) {
      el.setAttribute('style', 'display:none!important');
    }
  });
  const preBox = await sqPage.locator('.ascii-hero pre').boundingBox();
  if (preBox) {
    const side = preBox.width + 160;
    const cx = preBox.x + preBox.width / 2;
    const cy = preBox.y + preBox.height / 2;
    await sqPage.screenshot({
      path: `public/brand/logo-square-${scheme}-raw.png`,
      clip: {
        x: Math.max(0, cx - side / 2),
        y: Math.max(0, cy - side / 2),
        width: side,
        height: side,
      },
    });
  }
  // Circle-safe variant (for YouTube etc.) — more padding so logo fits inside circular crop
  if (preBox) {
    const side = preBox.width * 1.8;
    const cx = preBox.x + preBox.width / 2;
    const cy = preBox.y + preBox.height * 0.55; // nudge down slightly to visually center
    await sqPage.screenshot({
      path: `public/brand/logo-circle-${scheme}-raw.png`,
      clip: {
        x: Math.max(0, cx - side / 2),
        y: Math.max(0, cy - side / 2),
        width: side,
        height: side,
      },
    });
  }
  await sqPage.close();

  // --- Banners and OG (with tagline, no buttons/nav) ---
  const configs = [
    { name: `banner-x-${scheme}`, vw: 1500, w: 1500, h: 500 },
    { name: `banner-youtube-${scheme}`, vw: 2560, w: 2560, h: 1440 },
    { name: `hero-screenshot-${scheme}`, vw: 1920, w: 1920, h: 1080 },
  ];

  for (const cfg of configs) {
    const p = await browser.newPage({ viewport: { width: cfg.vw, height: cfg.h } });
    await p.emulateMedia({ colorScheme: scheme });
    await p.goto('http://localhost:5173', { waitUntil: 'networkidle' });
    await p.waitForTimeout(2000);
    await p.evaluate(() => {
      document.querySelector('.VPNav')?.setAttribute('style', 'display:none!important');
      document.querySelector('.VPFeatures')?.setAttribute('style', 'display:none!important');
      document.querySelector('.site-footer')?.setAttribute('style', 'display:none!important');
    });
    const box = await p.locator('.ascii-hero pre').boundingBox();
    if (box) {
      const cy = box.y + box.height / 2;
      const y = Math.max(0, cy - cfg.h / 2);
      await p.screenshot({
        path: `public/brand/${cfg.name}.png`,
        clip: { x: 0, y, width: cfg.w, height: cfg.h },
      });
    }
    await p.close();
  }

  // --- OG image ---
  const ogP = await browser.newPage({ viewport: { width: 1200, height: 1080 } });
  await ogP.emulateMedia({ colorScheme: scheme });
  await ogP.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await ogP.waitForTimeout(2000);
  await ogP.evaluate(() => {
    document.querySelector('.VPNav')?.setAttribute('style', 'display:none!important');
    document.querySelector('.VPFeatures')?.setAttribute('style', 'display:none!important');
    document.querySelector('.site-footer')?.setAttribute('style', 'display:none!important');
  });
  const ogBox = await ogP.locator('.ascii-hero pre').boundingBox();
  if (ogBox) {
    const cy = ogBox.y + ogBox.height / 2;
    await ogP.screenshot({
      path: `public/og-image-${scheme}.png`,
      clip: { x: 0, y: Math.max(0, cy - 315), width: 1200, height: 630 },
    });
  }
  await ogP.close();
}

await browser.close();

// Resize square logos to 1024x1024
for (const scheme of ['dark', 'light']) {
  execSync(`sips -z 1024 1024 public/brand/logo-square-${scheme}-raw.png --out public/brand/logo-square-${scheme}.png 2>/dev/null`);
  execSync(`rm public/brand/logo-square-${scheme}-raw.png`);
  execSync(`sips -z 800 800 public/brand/logo-circle-${scheme}-raw.png --out public/brand/logo-circle-${scheme}.png 2>/dev/null`);
  execSync(`rm public/brand/logo-circle-${scheme}-raw.png`);
}

console.log('done');
