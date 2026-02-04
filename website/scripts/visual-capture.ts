/**
 * Visual Capture Script
 *
 * Takes screenshots of the website for Claude to analyze.
 * Integrated with GSD workflow for visual verification after each plan.
 *
 * Usage:
 *   npm run visual:capture                    # Local dev server
 *   npm run visual:capture -- --url=URL       # Custom URL (e.g., Vercel preview)
 *
 * Output: Screenshots saved to .visual-verification/
 */

import { chromium, type Page, type Browser } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

// Configuration
const OUTPUT_DIR = '.visual-verification';
const DEFAULT_URL = 'http://localhost:3000';

// Viewports
const DESKTOP_VIEWPORT = { width: 1440, height: 900 };
const MOBILE_VIEWPORT = { width: 390, height: 844 }; // iPhone 14 Pro

// Section definitions with multiple selector strategies
// Uses: CSS selectors, text patterns for heading-based matching, nth-child fallbacks
interface SectionConfig {
  id: string;
  selector?: string | null; // CSS selector (optional if using textMatch)
  textMatch?: string; // Find section containing this heading text
  nthSection?: number; // Fallback: nth section in main (1-indexed)
  fullPage?: boolean;
  description: string;
}

const SECTIONS: SectionConfig[] = [
  { id: 'full-page', selector: null, fullPage: true, description: 'Full page screenshot' },
  { id: 'hero', selector: 'main > *:first-child', nthSection: 1, description: 'Hero section' },
  { id: 'hero-form', selector: '#hero-form', nthSection: 2, description: 'Hero conversion form' },
  { id: 'social-proof-counters', textMatch: '573', nthSection: 4, description: 'Social proof counters' },
  { id: 'cta-after-proof', textMatch: 'מוכן להצטרף', nthSection: 5, description: 'CTA after social proof' },
  { id: 'testimonials', textMatch: 'מה הלקוחות שלנו אומרים', nthSection: 6, description: 'Testimonials carousel' },
  { id: 'video-testimonial', textMatch: 'סיפור הצלחה', nthSection: 7, description: 'Video testimonial' },
  { id: 'roi-calculator', textMatch: 'כמה תרוויח', nthSection: 8, description: 'ROI Calculator' },
  { id: 'pricing', textMatch: 'תוכנית פשוטה', nthSection: 9, description: 'Pricing section' },
  { id: 'cta-after-pricing', textMatch: 'התחל היום, בחינם', nthSection: 10, description: 'CTA after pricing' },
  { id: 'zero-risk', textMatch: 'אפס סיכון', nthSection: 11, description: 'Zero risk summary' },
  { id: 'trust-badges', textMatch: 'למה לבחור', nthSection: 12, description: 'Trust badges' },
  { id: 'faq', textMatch: 'שאלות נפוצות', nthSection: 13, description: 'FAQ section' },
  { id: 'cta-after-faq', textMatch: 'יש לך עוד שאלות', nthSection: 14, description: 'CTA after FAQ' },
  { id: 'team', textMatch: 'הסיפור שלנו', nthSection: 15, description: 'Team section' },
  { id: 'contact', textMatch: 'צור קשר', nthSection: 16, description: 'Contact section' },
  { id: 'footer-guarantee', selector: 'main > section:last-of-type', nthSection: 17, description: 'Footer guarantee' },
];

interface CaptureResult {
  section: string;
  viewport: 'desktop' | 'mobile';
  filepath: string | null;
  success: boolean;
  error?: string;
}

interface CaptureReport {
  timestamp: string;
  url: string;
  viewports: {
    desktop: typeof DESKTOP_VIEWPORT;
    mobile: typeof MOBILE_VIEWPORT;
  };
  results: CaptureResult[];
  summary: {
    total: number;
    captured: number;
    failed: number;
  };
}

async function ensureOutputDir(): Promise<void> {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Clear previous screenshots
  const existingFiles = fs.readdirSync(OUTPUT_DIR);
  for (const file of existingFiles) {
    if (file.endsWith('.png') || file === 'report.json') {
      fs.unlinkSync(path.join(OUTPUT_DIR, file));
    }
  }
}

async function captureSection(
  page: Page,
  section: SectionConfig,
  viewport: 'desktop' | 'mobile',
  viewportSize: { width: number; height: number }
): Promise<CaptureResult> {
  const filename = `${viewport}-${section.id}.png`;
  const filepath = path.join(OUTPUT_DIR, filename);

  try {
    await page.setViewportSize(viewportSize);
    await page.waitForTimeout(300); // Let layout settle

    if (section.fullPage) {
      await page.screenshot({ path: filepath, fullPage: true });
      return { section: section.id, viewport, filepath: filename, success: true };
    }

    let element = null;

    // Strategy 1: Try CSS selector if provided
    if (section.selector) {
      const selectors = section.selector.split(', ');
      for (const selector of selectors) {
        element = await page.$(selector.trim());
        if (element) break;
      }
    }

    // Strategy 2: Try text matching - find section containing the heading text
    if (!element && section.textMatch) {
      // Find the heading/text, then get its closest section ancestor
      const textLocator = page.getByText(section.textMatch, { exact: false }).first();
      if (await textLocator.count() > 0) {
        // Get the section element that contains this text
        const sectionLocator = page.locator('main > section, main > div').filter({ has: textLocator }).first();
        if (await sectionLocator.count() > 0) {
          element = await sectionLocator.elementHandle();
        }
      }
    }

    // Strategy 3: Fallback to nth-section
    if (!element && section.nthSection) {
      const nthSelector = `main > *:nth-child(${section.nthSection})`;
      element = await page.$(nthSelector);
    }

    if (!element) {
      return {
        section: section.id,
        viewport,
        filepath: null,
        success: false,
        error: `Section not found (tried selector: ${section.selector}, text: ${section.textMatch}, nth: ${section.nthSection})`,
      };
    }

    // Scroll into view and wait for animations
    await element.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Capture the section
    await element.screenshot({ path: filepath });

    return { section: section.id, viewport, filepath: filename, success: true };
  } catch (error) {
    return {
      section: section.id,
      viewport,
      filepath: null,
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function main(): Promise<void> {
  // Parse command line arguments
  const args = process.argv.slice(2);
  let targetUrl = DEFAULT_URL;

  for (const arg of args) {
    if (arg.startsWith('--url=')) {
      targetUrl = arg.replace('--url=', '');
    }
  }

  console.log('\n📸 Visual Capture Starting...\n');
  console.log(`Target URL: ${targetUrl}`);
  console.log(`Output: ${OUTPUT_DIR}/\n`);

  await ensureOutputDir();

  let browser: Browser | null = null;

  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: DESKTOP_VIEWPORT,
      locale: 'he-IL',
      colorScheme: 'dark',
    });

    const page = await context.newPage();

    // Navigate to the page
    console.log('Loading page...');
    try {
      await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30000 });
    } catch {
      // Try with less strict waiting
      await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    }
    await page.waitForTimeout(2000); // Wait for animations

    const results: CaptureResult[] = [];

    // Desktop captures
    console.log('\n--- Desktop (1440px) ---\n');
    for (const section of SECTIONS) {
      const result = await captureSection(page, section, 'desktop', DESKTOP_VIEWPORT);
      results.push(result);
      const status = result.success ? '✓' : '✗';
      const message = result.success ? result.filepath : result.error;
      console.log(`${status} ${section.description}: ${message}`);
    }

    // Mobile captures
    console.log('\n--- Mobile (390px) ---\n');
    for (const section of SECTIONS) {
      const result = await captureSection(page, section, 'mobile', MOBILE_VIEWPORT);
      results.push(result);
      const status = result.success ? '✓' : '✗';
      const message = result.success ? result.filepath : result.error;
      console.log(`${status} ${section.description}: ${message}`);
    }

    // Generate report
    const captured = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    const report: CaptureReport = {
      timestamp: new Date().toISOString(),
      url: targetUrl,
      viewports: {
        desktop: DESKTOP_VIEWPORT,
        mobile: MOBILE_VIEWPORT,
      },
      results,
      summary: {
        total: results.length,
        captured,
        failed,
      },
    };

    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'report.json'),
      JSON.stringify(report, null, 2)
    );

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log(`\n✅ Capture complete!`);
    console.log(`   Captured: ${captured}/${results.length}`);
    if (failed > 0) {
      console.log(`   Failed: ${failed} (sections not found)`);
    }
    console.log(`\n📁 Files saved to: ${OUTPUT_DIR}/`);
    console.log(`📊 Report: ${OUTPUT_DIR}/report.json`);
    console.log('\n💡 Claude can now analyze these screenshots using the Read tool.\n');

  } catch (error) {
    console.error('\n❌ Capture failed:', error);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

main();
