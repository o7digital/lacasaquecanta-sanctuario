import { getCollection, type CollectionEntry } from 'astro:content';
import { homeHref, type Language } from './i18n';

export type Article = CollectionEntry<'santuario'>['data'];

export async function getArticles(language: Language = 'en') {
  const entries = await getCollection('santuario', ({ data }) => !data.draft);
  return entries.map(({ data }) => language === 'en' ? { ...data, ...data.en } : data)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

export function articleHref(article: Pick<Article, 'slug'>, language: Language = 'en') {
  return `${homeHref(language)}lecturas/${article.slug}/`;
}

export async function getArticlePaths(language: Language) {
  const articles = await getArticles(language);
  return articles.map(article => ({
    params: { slug: article.slug },
    props: { article, related: articles.filter(other => other.slug !== article.slug)
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()).slice(0, 2) },
  }));
}

export function readingTime(article: Article) {
  const text = [article.title, article.summary, ...article.sections.flatMap(s => [s.heading, s.text]), article.quote].join(' ');
  const estimate = Math.max(1, Math.ceil(text.trim().split(/\s+/u).length / 200));
  return article.readingTimeMinutes ?? estimate;
}

export function displayDate(date: Date, language: Language = 'en') {
  return new Intl.DateTimeFormat(language === 'es' ? 'es-MX' : 'en-US', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(date).replace(/ de /g, ' ').toLocaleUpperCase(language);
}
