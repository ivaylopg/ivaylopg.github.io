import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    layout: z.string().optional(),
    title: z.string(),
    // Jekyll accepts tags as either a YAML array or space-separated string
    tags: z.preprocess(
      val => {
        if (!val) return [];
        if (typeof val === 'string') return val.split(/\s+/);
        return val;
      },
      z.array(z.string())
    ),
    headline: z.string().optional(),
    thumbnail: z.string().optional(),
    thumbnailGif: z.string().optional(),
    cover: z.any().optional(),
    media: z.array(z.any()).optional().default([]),
    sections: z.array(z.any()).optional().default([]),
    customjs: z.string().optional(),
    customcss: z.string().optional(),
    priority: z.number().optional(),
  }),
});

const cv = defineCollection({
  loader: glob({ pattern: 'cv.md', base: './src/content/cv' }),
  schema: z.object({
    title: z.string(),
  }),
});

export const collections = { projects, cv };
