import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { blogBySlugValidator } from "../../shared/blog-by-slug.validator";
import { createBlogValidator } from "../../shared/create-blog.validator";
import { deleteBlogValidator } from "../../shared/delete-blog.validator";
import { createRouter } from "../context";

export const blogRouter = createRouter()
  .query("all", {
    async resolve({ ctx }) {
      const blogs = await ctx.prisma.blog.findMany({
        include: { author: true, likedBy: true },
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
        include: { author: true, likedBy: true },
      });

      return {
        blog,
        liked: blog?.likedBy?.some((user) => user.id === ctx.user?.id) ?? false,
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
  })
  .query("byUser", {
    async resolve({ ctx }) {
      const blogs = await ctx.prisma.blog.findMany({
        where: {
          authorId: ctx.user?.id,
        },
        include: {
          likedBy: true,
        },
      });

      return {
        blogs,
      };
    },
  })
  .mutation("delete", {
    input: deleteBlogValidator,
    async resolve({ input, ctx }) {
      if (ctx.user?.id !== input.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to delete this blog",
        });
      }

      console.log(input.blogId);

      await ctx.prisma.blog.delete({
        where: {
          id: input.blogId,
        },
      });

      return {
        ok: true,
      };
    },
  })
  .mutation("like", {
    input: z.object({
      blogId: z.string(),
    }),
    async resolve({ input, ctx }) {
      await ctx.prisma.blog.update({
        where: {
          id: input.blogId,
        },
        data: {
          likedBy: {
            connect: {
              id: ctx.user?.id,
            },
          },
        },
      });

      return {
        ok: true,
      };
    },
  })
  .mutation("dislike", {
    input: z.object({
      blogId: z.string(),
    }),
    async resolve({ input, ctx }) {
      await ctx.prisma.blog.update({
        where: {
          id: input.blogId,
        },
        data: {
          likedBy: {
            disconnect: {
              id: ctx.user?.id,
            },
          },
        },
      });

      return {
        ok: true,
      };
    },
  });
