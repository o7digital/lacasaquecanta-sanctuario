import type { APIRoute } from 'astro';
import { articleHref, getArticles } from '../lib/santuario/articles';

export const GET: APIRoute = async ({ site }) => {
  // Demo entries remain excluded until their editorial validation.
  const articles = (await getArticles()).filter(article => !article.demo);
  const urls = articles.map(article => `<url><loc>${new URL(articleHref(article), site).href}</loc><lastmod>${article.publishedAt.toISOString()}</lastmod></url>`);
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
