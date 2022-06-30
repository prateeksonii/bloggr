import { User } from "@prisma/client";
import jwt from "jsonwebtoken";

export const signToken = (user: User) =>
  jwt.sign(
    {
      sub: user.id,
      user,
    },
    process.env.JWT_SECRET ?? "restinpeace",
    {
      expiresIn: "1y",
    }
  );

export const verifyToken = <T>(token: string) =>
  jwt.verify(token, process.env.JWT_SECRET ?? "restinpeace") as T;
