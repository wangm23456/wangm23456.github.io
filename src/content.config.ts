import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    author: z.string().default("潘勒斯"),
    tags: z.array(z.string()).default([]),
    research: z.array(z.string()).default([]),
  }),
});

const research = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    topic: z.enum(["muscle", "alcohol", "weight-loss-drugs", "fitness-supplements"]),
  }),
});

export const collections = { blog, research };

