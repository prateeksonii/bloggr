import { createRouter } from "../context";
import { usersRouter } from "./usersRouter";

export const appRouter = createRouter().merge("users.", usersRouter);

export type AppRouter = typeof appRouter;
