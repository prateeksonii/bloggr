import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { FC, ReactNode, useState } from "react";
import { toast } from "react-toastify";
import { userAtom } from "../atoms/userAtom";
import { BASE_URL } from "../utils/constants";

const protectedRoutes = ["/blog/create"];

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  const [, setUser] = useAtom(userAtom);
  const [loadingUser, setLoadingUser] = useState(true);
  const router = useRouter();

  const { data: user, isLoading } = useQuery(
    ["auth.me"],
    async () => {
      const res = await fetch(`${BASE_URL}/api/v1/auth/me`, {
        credentials: "include",
      });
      if (res.status !== 200) return null;
      const user = await res.json();
      return user;
    },
    {
      onSettled(user, error: any) {
        if (error) {
          toast.error(error.message);
        }

        setUser(user ?? null);
        setLoadingUser(false);
      },
    }
  );

  if (isLoading || loadingUser) return <div>Checking auth status</div>;

  if (!user && protectedRoutes.includes(router.pathname)) {
    router.replace("/signin");
  }

  return <>{children}</>;
};

export default Layout;
