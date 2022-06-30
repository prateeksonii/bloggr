import { z } from "zod";

export const createBlogValidator = z.object({
  title: z.string().min(4),
  content: z.string().min(4),
});

export type CreateBlogValidator = z.infer<typeof createBlogValidator>;
