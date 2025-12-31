import { defineCollection, z } from 'astro:content';

const expressions = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(), // Unique ID that never changes
    title: z.string(),
    description: z.string(),
    dateAdded: z.string(),
    lastUpdated: z.string().optional(),
    aeVersion: z.string(),
    expressionTypes: z.array(z.string()),
    layerType: z.string(),
    propertyType: z.string(),
    complexity: z.number().min(1).max(4),
    projects: z.array(z.string()),
    tags: z.array(z.string()).optional(),
    code: z.string(),
    annotations: z.array(z.object({
      lines: z.string(),
      title: z.string(),
      description: z.string()
    }))
  })
});

export const collections = { expressions };
