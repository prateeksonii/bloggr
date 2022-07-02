import "../styles/globals.css";
import type { AppProps } from "next/app";
import { withTRPC } from "@trpc/next";
import { AppRouter } from "../backend/router";

import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { trpc } from "../utils/trpc";
import { useAtom } from "jotai";
import { userAtom } from "../atoms/userAtom";
import { useState } from "react";
import { useRouter } from "next/router";
import superjson from "superjson";

const protectedRoutes = ["/blog/create"];

function MyApp({ Component, pageProps }: AppProps) {
  const [user, setUser] = useAtom(userAtom);
  const [loadingUser, setLoadingUser] = useState(true);
  const router = useRouter();

  const { isLoading } = trpc.useQuery(["auth.me"], {
    onSettled(data, error) {
      if (error) {
        toast.error(error.message);
      }

      setUser(data?.user ?? null);
      setLoadingUser(false);
    },
  });

  if (isLoading || loadingUser) return <div>Checking auth status</div>;

  if (!user && protectedRoutes.includes(router.pathname)) {
    router.replace("/signin");
  }

  return (
    <>
      <Component {...pageProps} />
      <ToastContainer theme="dark" />
    </>
  );
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    const url = process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/trpc`
      : "http://localhost:3000/api/trpc";

    return {
      url,
      headers: {
        cookie: ctx?.req?.headers.cookie,
      },
      transformer: superjson,
    };
  },
  ssr: true,
})(MyApp);
