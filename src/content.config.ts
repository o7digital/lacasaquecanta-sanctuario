import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const santuario = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/santuario' }),
  schema: z.object({
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: z.string(),
    category: z.enum(['Naturaleza', 'Rituales', 'Arte y oficio', 'Sabores', 'Vida en la casa']),
    summary: z.string(),
    image: z.string(),
    imageAlt: z.string(),
    heroAlt: z.string(),
    publishedAt: z.coerce.date(),
    draft: z.boolean().default(true),
    demo: z.boolean().default(true),
    displayOrder: z.number().int(),
    // Preserve the supplied editorial estimates; calculate one for new articles.
    readingTimeMinutes: z.number().int().positive().optional(),
    sections: z.array(z.object({ heading: z.string(), text: z.string() })).min(1),
    quote: z.string(),
  }),
});

export const collections = { santuario };
