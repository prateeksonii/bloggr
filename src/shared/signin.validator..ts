import { z } from "zod";

export const signinValidator = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});

export type SigninValidator = z.infer<typeof signinValidator>;
