import { z } from "zod";

export const blogBySlugValidator = z.object({
  slug: z.string().min(4),
});

export type BlogBySlugValidator = z.infer<typeof blogBySlugValidator>;
