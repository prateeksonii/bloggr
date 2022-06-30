import argon2 from "argon2";

export const hashPassword = (password: string) =>
  argon2.hash(password, {
    saltLength: 12,
  });

export const verifyPassword = (hash: string, password: string) =>
  argon2.verify(hash, password);
