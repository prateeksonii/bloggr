import { TRPCError } from "@trpc/server";
import { blogBySlugValidator } from "../../shared/blog-by-slug.validator";
import { createBlogValidator } from "../../shared/create-blog.validator";
import { createRouter } from "../context";

export const blogRouter = createRouter()
  .query("all", {
    async resolve({ ctx }) {
      const blogs = await ctx.prisma.blog.findMany({
        include: { author: true },
      });

      return {
        blogs,
      };
    },
  })
  .query("bySlug", {
    input: blogBySlugValidator,
    async resolve({ input, ctx }) {
      const blog = await ctx.prisma.blog.findUnique({
        where: {
          slug: input.slug,
        },
        include: { author: true },
      });

      return {
        blog,
      };
    },
  })
  .middleware(({ ctx, next }) => {
    if (!ctx.user)
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to create a blog",
      });

    return next();
  })
  .mutation("create", {
    input: createBlogValidator,
    async resolve({ input, ctx }) {
      const blog = await ctx.prisma.blog.create({
        data: {
          title: input.title,
          content: input.content,
          slug: input.title.toLowerCase().split(" ").join("-"),
          author: {
            connect: {
              id: ctx.user!.id,
            },
          },
        },
      });

      return {
        blog,
      };
    },
  });
