import { expect, test, type Page } from '@playwright/test';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { homeHref, translations, type Language } from '../src/lib/santuario/i18n';

const original = 'reference/El-Santuario-Premium-Codex/dist';
const slugs = (await readdir('src/content/santuario')).filter(name => name.endsWith('.json')).map(name => name.replace(/\.json$/, ''));
const routes = ['/', ...slugs.map(slug => `/lecturas/${slug}/`)];
const languages: Language[] = ['en', 'es'];

async function prepareScreenshot(page: Page, url: string) {
  const response = await page.goto(url);
  expect(response?.status()).toBe(200);
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map(async image => {
      image.loading = 'eager';
      await image.decode();
    }));
  });
}

for (const language of languages) {
  const home = homeHref(language);
  const copy = translations[language];
  for (const route of routes) {
    test(`${language}: complete content, metadata and responsive layout: ${route}`, async ({ page, context }, testInfo) => {
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
      const currentPath = home.slice(0, -1) + route;
      await prepareScreenshot(page, currentPath);
      await expect(page.locator('html')).toHaveAttribute('lang', language);
      await expect(page.locator('#menu-button')).toHaveText(language.toUpperCase());
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,nofollow');
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://lacasaquecanta-sanctuario.vercel.app${currentPath}`);
      await expect(page.locator('link[hreflang="en"]')).toHaveAttribute('href', `https://lacasaquecanta-sanctuario.vercel.app/santuario${route}`);
      await expect(page.locator('link[hreflang="es"]')).toHaveAttribute('href', `https://lacasaquecanta-sanctuario.vercel.app/es/santuario${route}`);
      if (route !== '/') {
        const slug = route.split('/')[2];
        const entry = JSON.parse(await readFile(`src/content/santuario/${slug}.json`, 'utf8'));
        const article = language === 'en' ? entry.en : entry;
        await expect(page.locator('h1')).toHaveText(article.title);
        await expect(page.locator('.article-intro')).toHaveText(article.summary);
        await expect(page.locator('.article-body section h2')).toHaveText(article.sections.map((section: { heading: string }) => section.heading));
        await expect(page.locator('.article-body section p')).toHaveText(article.sections.map((section: { text: string }) => section.text));
        await expect(page.locator('blockquote')).toHaveText(`“${article.quote}”`);
        await expect(page.locator('.article-hero img')).toHaveAttribute('alt', article.heroAlt);
        const data = JSON.parse(await page.locator('script[type="application/ld+json"]').innerText());
        expect(data.inLanguage).toBe(language === 'es' ? 'es-MX' : 'en-US');
        expect(data.headline).toBe(article.title);
        expect(data.creativeWorkStatus).toBe('Demo');
      } else {
        await expect(page).toHaveTitle(`${copy.pageTitle} · El Santuario`);
        await expect(page.locator('.cover-intro')).toHaveText(copy.coverIntro);
        await expect(page.locator('[data-filter="all"]')).toContainText(copy.allStories);
      }
      const name = `${language}-${testInfo.project.name}-${route === '/' ? 'cover' : route.split('/')[2]}`;
      await mkdir('artifacts', { recursive: true });
      const screenshot = await page.screenshot({ fullPage: true, animations: 'disabled' });
      await writeFile(`artifacts/${name}.png`, screenshot);
      // The Spanish version still matches the supplied mockup; only the new header control is masked.
      if (language === 'es') {
        const reference = await context.newPage();
        await prepareScreenshot(reference, `http://127.0.0.1:4174${route}`);
        const options = { fullPage: true, animations: 'disabled' as const, maskColor: '#f6f3ec' };
        const expected = PNG.sync.read(await reference.screenshot({ ...options, mask: [reference.locator('.topbar')] }));
        const actual = PNG.sync.read(await page.screenshot({ ...options, mask: [page.locator('.topbar')] }));
        expect({ width: actual.width, height: actual.height }).toEqual({ width: expected.width, height: expected.height });
        const diff = new PNG({ width: actual.width, height: actual.height });
        const different = pixelmatch(expected.data, actual.data, diff.data, actual.width, actual.height, { threshold: 0.1 });
        const fraction = different / (actual.width * actual.height);
        if (fraction > 0.001) await writeFile(`artifacts/${name}-diff.png`, PNG.sync.write(diff));
        expect(fraction, `${different} pixels differ from the supplied design`).toBeLessThanOrEqual(0.001);
        await reference.close();
      }
      expect(errors).toEqual([]);
    });
  }

  test(`${language}: filters and additional stories`, async ({ page }) => {
    await page.goto(home);
    await expect(page.locator('.stories .story:visible')).toHaveCount(3);
    await page.getByRole('button', { name: copy.more }).click();
    await expect(page.locator('.stories .story:visible')).toHaveCount(6);
    await expect(page.getByRole('button', { name: copy.more })).toBeHidden();
    for (const [category, count] of [['Naturaleza', 2], ['Rituales', 1], ['Arte y oficio', 1], ['Sabores', 1], ['Vida en la casa', 1]] as const) {
      const filter = page.locator(`[data-filter="${category}"]`);
      await filter.click();
      await expect(filter).toHaveText(copy.categories[category]);
      await expect(filter).toHaveAttribute('aria-pressed', 'true');
      await expect(page.locator('.stories .story:visible')).toHaveCount(count);
      await expect(page.locator('#filter-status')).toHaveText(`${count} ${copy.storiesIn} ${copy.categories[category].toLowerCase()}`);
    }
    await page.locator('[data-filter="all"]').click();
    await expect(page.locator('.stories .story:visible')).toHaveCount(6);
    await page.locator('.story h3 a').first().click();
    await page.locator('.article-breadcrumb a').click();
    await expect(page).toHaveURL(new RegExp(`${home}$`));
    await expect(page.locator('.stories .story:visible')).toHaveCount(3);
  });

  test(`${language}: favorites persist across languages and handle unavailable storage`, async ({ page }) => {
    await page.goto(`${home}lecturas/${slugs[0]}/`);
    const save = page.locator('.save-story');
    await save.click();
    await expect(save).toContainText(copy.saved);
    await page.reload();
    await expect(save).toHaveAttribute('aria-pressed', 'true');
    await page.locator('#menu-button').click();
    await page.locator('#lang-menu a').click();
    await expect(save).toHaveAttribute('aria-pressed', 'true');
    await expect(save).toContainText(translations[language === 'en' ? 'es' : 'en'].saved);
    await page.goto(`${home}lecturas/${slugs[0]}/`);
    await save.click();
    await expect(save).toHaveAttribute('aria-pressed', 'false');
    await page.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new Error('Unavailable'); } }));
    await page.reload();
    await save.click();
    await expect(save).toHaveText(copy.saveError);
  });

  test(`${language}: keyboard, mobile menu and reduced motion`, async ({ page, isMobile }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(home);
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: copy.skip })).toBeFocused();
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
    if (isMobile) {
      const menu = page.locator('.mobile-menu');
      await menu.click();
      await expect(menu).toHaveAttribute('aria-label', copy.closeMenu);
      await expect(page.locator('#mobile-nav')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.locator('#mobile-nav')).toBeHidden();
      await expect(menu).toBeFocused();
      await menu.click();
      await page.locator('#mobile-nav').getByRole('link', { name: copy.journal }).click();
      await expect(page.locator('#mobile-nav')).toBeHidden();
      await expect(menu).toHaveAttribute('aria-label', copy.openMenu);
    }
  });

  test(`${language}: EN/ES dropdown follows the hotel and keeps the current page`, async ({ page }) => {
    for (const route of routes) {
      const current = home.slice(0, -1) + route;
      await page.goto(current);
      const button = page.locator('#menu-button');
      await button.click();
      await expect(button).toHaveAttribute('aria-expanded', 'true');
      await expect(page.locator('#lang-menu')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.locator('#lang-menu')).toBeHidden();
      await expect(button).toBeFocused();
      await page.keyboard.press('ArrowDown');
      await expect(page.locator('#lang-menu a')).toBeFocused();
      await page.keyboard.press('Enter');
      const other = language === 'en' ? 'es' : 'en';
      await expect(page).toHaveURL(new RegExp(`${homeHref(other).slice(0, -1)}${route}$`));
      await expect(page.locator('html')).toHaveAttribute('lang', other);
      await expect(page.locator('#menu-button')).toHaveText(other.toUpperCase());
    }
    await page.goto(`${home}?source=journal#diario`);
    await page.locator('#menu-button').click();
    await page.locator('#lang-menu a').click();
    await expect(page).toHaveURL(new RegExp(`${homeHref(language === 'en' ? 'es' : 'en')}\\?source=journal#diario$`));
    await page.locator('#menu-button').click();
    await page.locator('h1').click();
    await expect(page.locator('#lang-menu')).toBeHidden();
  });

  test(`${language}: internal links keep the selected language`, async ({ page, request }) => {
    for (const route of routes) {
      await page.goto(home.slice(0, -1) + route);
      const links = await page.locator('a[href^="/"]').evaluateAll(anchors => anchors.map(anchor => anchor.getAttribute('href')!));
      for (const href of new Set(links)) {
        // The only cross-language link is the EN/ES menu option.
        const isSwitch = href === (language === 'en' ? `/es/santuario${route}` : `/santuario${route}`);
        expect(href.startsWith(home) || isSwitch, href).toBe(true);
        expect((await request.get(href)).status(), href).toBe(200);
      }
      await expect(page.locator('.hotel-link')).toHaveAttribute('href', language === 'es' ? 'https://www.lacasaquecanta.com/es' : 'https://www.lacasaquecanta.com/');
    }
    await page.goto('/');
    await expect(page).toHaveURL(/\/santuario\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    expect(await (await request.get('/sitemap.xml')).text()).not.toContain('<url>');
  });
}

test('supplied images and fonts are preserved byte for byte', async () => {
  for (const file of await readdir(path.join(original, 'assets/editorial'))) {
    expect((await readFile(path.join('public/santuario/assets/editorial', file))).equals(await readFile(path.join(original, 'assets/editorial', file))), file).toBe(true);
  }
});
