/**
 * Capture ECRS screenshots for project report.
 * Run: node scripts/capture_screenshots.mjs
 */
import { chromium } from "playwright";
import { mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "docs", "screenshots");
const BASE = "http://localhost:5173";

async function shot(page, name, url, actions) {
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  if (actions) await actions(page);
  await page.waitForTimeout(1500);
  const file = path.join(OUT, `${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log("Saved:", file);
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await shot(page, "fig-4-1-landing", `${BASE}/`);
  await shot(page, "fig-4-2-report-step1", `${BASE}/report`);
  await shot(page, "fig-4-4-track-report", `${BASE}/track`, async (p) => {
    await p.fill('input[placeholder*="KFD"]', "KFD-2026-489201");
    await p.click('button:has-text("Track")');
    await p.waitForTimeout(2000);
  });
  await shot(page, "fig-4-5-officer-login", `${BASE}/officer/login`);

  // Officer login flow
  await page.goto(`${BASE}/officer/login`, { waitUntil: "networkidle" });
  await page.fill('input[type="email"]', "k.mensah@ecrs.gov");
  await page.fill('input[type="password"]', "password");
  await page.click('button:has-text("Continue")');
  await page.waitForTimeout(1000);
  // 2FA step
  await page.click('button:has-text("Verify")');
  await page.waitForURL("**/officer**", { timeout: 15000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(OUT, "fig-4-6-dashboard.png"), fullPage: true });
  console.log("Saved: fig-4-6-dashboard.png");

  await shot(page, "fig-4-7-investigation", `${BASE}/officer/investigation?case=KFD-2026-489201`);
  await shot(page, "fig-4-8-analytics", `${BASE}/officer/analytics`);

  // ── Backend API screenshots ──
  const apiPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const apiShots = [
    ["fig-backend-health", "http://127.0.0.1:8000/api/health", "Backend API – Health Check"],
    ["fig-backend-zones", "http://127.0.0.1:8000/api/zones", "Backend API – Zones Endpoint"],
    ["fig-backend-categories", "http://127.0.0.1:8000/api/categories", "Backend API – Crime Categories"],
    ["fig-backend-landing-stats", "http://127.0.0.1:8000/api/landing/stats", "Backend API – Landing Statistics"],
    ["fig-backend-track", "http://127.0.0.1:8000/api/reports/track/KFD-2026-489201", "Backend API – Track Case Response"],
  ];
  for (const [name, url, _label] of apiShots) {
    await apiPage.goto(url, { waitUntil: "networkidle", timeout: 60000 });
    await apiPage.waitForTimeout(1000);
    await apiPage.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: true });
    console.log("Saved:", `${name}.png`);
  }

  // Protected dashboard JSON (login via API from browser context)
  const tokenRes = await fetch("http://127.0.0.1:8000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email: "k.mensah@ecrs.gov", password: "password" }),
  });
  const tokenData = await tokenRes.json();
  if (tokenData.token) {
    await apiPage.setExtraHTTPHeaders({
      Authorization: `Bearer ${tokenData.token}`,
      Accept: "application/json",
    });
    await apiPage.goto("http://127.0.0.1:8000/api/dashboard", {
      waitUntil: "networkidle",
      timeout: 60000,
    });
    await apiPage.waitForTimeout(1000);
    await apiPage.screenshot({ path: path.join(OUT, "fig-backend-dashboard.png"), fullPage: true });
    console.log("Saved: fig-backend-dashboard.png");
  }

  // ── Database screenshots (phpMyAdmin) ──
  const dbPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const dbUrls = [
    ["fig-db-structure", "http://localhost/phpmyadmin/index.php?route=/database/structure&db=ecrs_koforidua", "Database – ecrs_koforidua Table Structure"],
    ["fig-db-reports", "http://localhost/phpmyadmin/index.php?route=/sql&db=ecrs_koforidua&table=reports&pos=0", "Database – Reports Table Data"],
    ["fig-db-users", "http://localhost/phpmyadmin/index.php?route=/sql&db=ecrs_koforidua&table=users&pos=0", "Database – Users (Officers) Table"],
    ["fig-db-timeline", "http://localhost/phpmyadmin/index.php?route=/sql&db=ecrs_koforidua&table=case_timeline&pos=0", "Database – Case Timeline Table"],
  ];
  for (const [name, url, _label] of dbUrls) {
    try {
      await dbPage.goto(url, { waitUntil: "networkidle", timeout: 60000 });
      await dbPage.waitForTimeout(2000);
      await dbPage.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: true });
      console.log("Saved:", `${name}.png`);
    } catch (e) {
      console.warn("Skip", name, e.message);
    }
  }

  await browser.close();
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
