import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    draft: z.boolean().optional().default(false),
    ctaType: z.enum(['audit', 'copywriting', 'redesign', 'general']).optional().default('general'),
    ctaTitle: z.string().optional(),
    ctaDesc: z.string().optional(),
    ctaButton: z.string().optional(),
  }),
});

export const collections = { blog };
