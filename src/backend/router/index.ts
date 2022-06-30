import { createRouter } from "../context";
import { authRouter } from "./authRouter";
import { blogRouter } from "./blogRouter";
import { usersRouter } from "./usersRouter";

export const appRouter = createRouter()
  .merge("users.", usersRouter)
  .merge("auth.", authRouter)
  .merge("blogs.", blogRouter);

export type AppRouter = typeof appRouter;
