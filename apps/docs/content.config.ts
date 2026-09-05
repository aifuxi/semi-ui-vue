import { defineCollection, defineContentConfig, z } from '@nuxt/content';

export default defineContentConfig({
  collections: {
    docs: defineCollection({
      type: 'page',
      source: '**/*.md',
      schema: z.object({
        locale: z.enum(['zh-CN', 'en-US']),
        slug: z.string(),
        category: z.string(),
        order: z.number(),
        englishTitle: z.string(),
      }),
    }),
  },
});
