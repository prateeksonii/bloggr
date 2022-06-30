import * as trpc from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { createUserValidator } from "../../shared/create-user.validator";
import { createRouter } from "../context";
import { hashPassword } from "../utils/argon2";

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

    const hashedPassword = await hashPassword(input.password);

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
