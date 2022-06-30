import { TRPCError } from "@trpc/server";
import { serialize } from "cookie";
import { signinValidator } from "../../shared/signin.validator.";
import { createRouter } from "../context";
import { verifyPassword } from "../utils/argon2";
import { signToken } from "../utils/jwt";

export const authRouter = createRouter()
  .mutation("signin", {
    input: signinValidator,
    async resolve({ input, ctx }) {
      const user = await ctx.prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const isValid = await verifyPassword(user.password, input.password);

      if (!isValid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      const token = await ctx.prisma.userToken.create({
        data: {
          token: signToken(user),
          userId: user.id,
        },
      });

      ctx.res?.setHeader(
        "Set-Cookie",
        serialize("token", token.token, { maxAge: 365 * 24 * 60 * 60 * 1000 })
      );

      return {
        ok: true,
      };
    },
  })
  .mutation("signout", {
    resolve({ ctx }) {
      ctx.res?.setHeader("Set-Cookie", serialize("token", "", { maxAge: 0 }));
      ctx.req.user = null;

      return {
        ok: true,
      };
    },
  })
  .query("me", {
    async resolve({ ctx }) {
      ctx.req.user = ctx.user;
      return {
        user: ctx.user,
      };
    },
  });
