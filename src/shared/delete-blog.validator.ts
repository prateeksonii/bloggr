import { z } from "zod";

export const deleteBlogValidator = z.object({
  userId: z.string().min(4),
  blogId: z.string().min(4),
});

export type DeleteBlogValidator = z.infer<typeof deleteBlogValidator>;
