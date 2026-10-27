import { expect, test, type Page } from '@playwright/test';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

const original = 'reference/El-Santuario-Premium-Codex/dist';
const slugs = (await readdir('src/content/santuario')).filter(name => name.endsWith('.json')).map(name => name.replace(/\.json$/, ''));
const routes = ['/', ...slugs.map(slug => `/lecturas/${slug}/`)];

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
  await expect(page.locator('img')).not.toHaveCount(0);
}

for (const route of routes) {
  test(`preserves original design and content: ${route}`, async ({ page, context }, testInfo) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    const reference = await context.newPage();
    await prepareScreenshot(reference, `http://127.0.0.1:4174${route}`);
    await prepareScreenshot(page, `/santuario${route}`);
    await expect(page.locator('h1')).toHaveText(await reference.locator('h1').innerText());
    const bodySelector = route === '/' ? 'main' : '.article-body';
    const normalize = (value: string) => value.replace(/\s+/g, ' ').trim();
    expect(normalize(await page.locator(bodySelector).innerText())).toBe(normalize(await reference.locator(bodySelector).innerText()));
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,nofollow');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://lacasaquecanta-sanctuario.vercel.app/santuario${route}`);
    if (route !== '/') {
      const data = JSON.parse(await page.locator('script[type="application/ld+json"]').innerText());
      expect(data['@type']).toBe('BlogPosting');
      expect(data.creativeWorkStatus).toBe('Demo');
    }
    const expected = PNG.sync.read(await reference.screenshot({ fullPage: true, animations: 'disabled' }));
    const actualBuffer = await page.screenshot({ fullPage: true, animations: 'disabled' });
    const actual = PNG.sync.read(actualBuffer);
    const name = `${testInfo.project.name}-${route === '/' ? 'cover' : route.split('/')[2]}`;
    await mkdir('artifacts', { recursive: true });
    await writeFile(`artifacts/${name}.png`, actualBuffer);
    expect({ width: actual.width, height: actual.height }).toEqual({ width: expected.width, height: expected.height });
    const diff = new PNG({ width: actual.width, height: actual.height });
    const different = pixelmatch(expected.data, actual.data, diff.data, actual.width, actual.height, { threshold: 0.1 });
    const fraction = different / (actual.width * actual.height);
    if (fraction > 0.001) await writeFile(`artifacts/${name}-diff.png`, PNG.sync.write(diff));
    expect(fraction, `${different} pixels differ from original ZIP (${(fraction * 100).toFixed(4)}%)`).toBeLessThanOrEqual(0.001);
    expect(errors).toEqual([]);
    await reference.close();
  });
}

test('filters, additional stories and repeated navigation work', async ({ page }) => {
  await page.goto('/santuario/');
  await expect(page.locator('.stories .story:visible')).toHaveCount(3);
  await page.getByRole('button', { name: 'Más historias' }).click();
  await expect(page.locator('.stories .story:visible')).toHaveCount(6);
  await expect(page.getByRole('button', { name: 'Más historias' })).toBeHidden();
  for (const [category, count] of [['Naturaleza', 2], ['Rituales', 1], ['Arte y oficio', 1], ['Sabores', 1], ['Vida en la casa', 1]] as const) {
    const filter = page.getByRole('button', { name: category, exact: true });
    await filter.click();
    await expect(filter).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.stories .story:visible')).toHaveCount(count);
    await expect(page.locator('#filter-status')).toHaveText(`${count} historias en ${category.toLowerCase()}`);
  }
  await page.locator('[data-filter="Todas las historias"]').click();
  await expect(page.locator('.stories .story:visible')).toHaveCount(6);
  await page.locator('.story h3 a').first().click();
  await page.getByRole('link', { name: 'El Santuario', exact: true }).first().click();
  await expect(page.locator('.stories .story:visible')).toHaveCount(3);
  await page.locator('[data-filter="Sabores"]').click();
  await expect(page.locator('.stories .story:visible')).toHaveCount(1);
});

test('favorites persist and tolerate unavailable local storage', async ({ page }) => {
  await page.goto(`/santuario/lecturas/${slugs[0]}/`);
  const save = page.locator('.save-story');
  await save.click();
  await expect(save).toHaveAttribute('aria-pressed', 'true');
  await page.reload();
  await expect(save).toHaveAttribute('aria-pressed', 'true');
  await save.click();
  await expect(save).toHaveAttribute('aria-pressed', 'false');
  await page.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new Error('Unavailable'); } }));
  await page.reload();
  await save.click();
  await expect(save).toHaveText('No se pudo guardar en este navegador');
});

test('keyboard navigation, mobile menu and reduced motion', async ({ page, isMobile }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/santuario/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Ir al contenido' })).toBeFocused();
  const scrollBehavior = await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
  expect(scrollBehavior).toBe('auto');
  if (isMobile) {
    const menu = page.getByRole('button', { name: 'Abrir menú' });
    await menu.click();
    await expect(page.locator('#mobile-nav')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#mobile-nav')).toBeHidden();
    await expect(menu).toBeFocused();
    await menu.click();
    await page.locator('#mobile-nav').getByRole('link', { name: 'El diario' }).click();
    await expect(page.locator('#mobile-nav')).toBeHidden();
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
  }
});

test('all internal links resolve inside Santuario', async ({ page, request }) => {
  for (const route of routes) {
    await page.goto(`/santuario${route}`);
    const links = await page.locator('a[href^="/"]').evaluateAll(anchors => anchors.map(anchor => anchor.getAttribute('href')!));
    for (const href of new Set(links)) {
      expect(href).toMatch(/^\/santuario\//);
      const response = await request.get(href);
      expect(response.status(), href).toBe(200);
    }
  }
  await page.goto('/');
  await expect(page).toHaveURL(/\/santuario\/$/);
  const sitemap = await request.get('/sitemap.xml');
  expect(await sitemap.text()).not.toContain('<url>');
});

test('supplied images and fonts are preserved byte for byte', async () => {
  const files = await readdir(path.join(original, 'assets/editorial'));
  for (const file of files) {
    const expected = await readFile(path.join(original, 'assets/editorial', file));
    const actual = await readFile(path.join('public/santuario/assets/editorial', file));
    expect(actual.equals(expected), file).toBe(true);
  }
});
