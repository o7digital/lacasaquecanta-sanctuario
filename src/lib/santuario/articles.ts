import { getCollection, type CollectionEntry } from 'astro:content';

export type Article = CollectionEntry<'santuario'>['data'];

export async function getArticles() {
  const entries = await getCollection('santuario', ({ data }) => !data.draft);
  return entries.map(({ data }) => data).sort((a, b) => a.displayOrder - b.displayOrder);
}

export function articleHref(article: Article) {
  return `/santuario/lecturas/${article.slug}/`;
}

export function readingTime(article: Article) {
  const text = [article.title, article.summary, ...article.sections.flatMap(s => [s.heading, s.text]), article.quote].join(' ');
  const estimate = Math.max(1, Math.ceil(text.trim().split(/\s+/u).length / 200));
  return article.readingTimeMinutes ?? estimate;
}

export function displayDate(date: Date) {
  return new Intl.DateTimeFormat('es-MX', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(date).replace(/ de /g, ' ').toLocaleUpperCase('es-MX');
}
