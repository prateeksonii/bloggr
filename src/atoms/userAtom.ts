import { Blog, User } from "@prisma/client";
import { atom } from "jotai";

export const userAtom = atom<(User & { blogs: Blog[] }) | null>(null);
