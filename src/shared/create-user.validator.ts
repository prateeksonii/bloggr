import { z } from "zod";

export const createUserValidator = z.object({
  name: z.string().min(4),
  email: z.string().email(),
  password: z.string().min(4),
});

export type CreateUserValidator = z.infer<typeof createUserValidator>;
