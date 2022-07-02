import { Blog, User } from "@prisma/client";
import * as trpc from "@trpc/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "./utils/jwt";
import { prisma } from "./utils/prisma";

const getUserFromRequest = (req: NextApiRequest) => {
  const token = req.cookies.token;

  if (token) {
    try {
      const payload = verifyToken<{
        sub: string;
        user: User & { blogs: Blog[] };
      }>(token);
      return payload.user;
    } catch (e) {
      return null;
    }
  }

  return null;
};

export const createContext = async ({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  const user = getUserFromRequest(req);

  return {
    prisma,
    req,
    res,
    user,
  };
};

type Context = trpc.inferAsyncReturnType<typeof createContext>;

export function createRouter() {
  return trpc.router<Context>();
}
