import * as trpc from "@trpc/server";
import { TRPCError } from "@trpc/server";
import argon2 from "argon2";
import { createUserValidator } from "../../shared/create-user.validator";
import { createRouter } from "../context";

export const usersRouter = createRouter().mutation("create", {
  input: createUserValidator,
  async resolve({ input, ctx }) {
    const existingUser = await ctx.prisma.user.findUnique({
      where: {
        email: input.email,
      },
    });

    if (existingUser) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "User already exists",
      });
    }

    const hashedPassword = await argon2.hash(input.password, {
      saltLength: 12,
    });

    const user = await ctx.prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: hashedPassword,
      },
    });

    return {
      user,
    };
  },
});
