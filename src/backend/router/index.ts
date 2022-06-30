import { createRouter } from "../context";
import { authRouter } from "./authRouter";
import { usersRouter } from "./usersRouter";

export const appRouter = createRouter()
  .merge("users.", usersRouter)
  .merge("auth.", authRouter);

export type AppRouter = typeof appRouter;
