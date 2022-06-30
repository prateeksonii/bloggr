import "../styles/globals.css";
import type { AppProps } from "next/app";
import { withTRPC } from "@trpc/next";
import { AppRouter } from "../backend/router";

import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { trpc } from "../utils/trpc";
import { useAtom } from "jotai";
import { userAtom } from "../atoms/userAtom";
import { useEffect, useState } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  const [user, setUser] = useAtom(userAtom);
  const [loadingUser, setLoadingUser] = useState(true);

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

  return (
    <>
      <Component {...pageProps} />
      <ToastContainer theme="dark" />
    </>
  );
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/trpc`
      : "http://localhost:3000/api/trpc";

    return {
      url,
      headers: {
        cookie: ctx?.req?.headers.cookie,
      },
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: true,
})(MyApp);
