import { PrismaClient } from "@prisma/client";
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";

export async function createContext(opts?: trpcNext.CreateNextContextOptions) {
  const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"],
  });

  return {
    prisma,
  };
}

type Context = trpc.inferAsyncReturnType<typeof createContext>;

export function createRouter() {
  return trpc.router<Context>();
}