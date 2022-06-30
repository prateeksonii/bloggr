import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Navbar from "../components/Navbar.";

const IndexPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Bloggr</title>
      </Head>
      <div className="min-h-screen">
        <Navbar />
        <div className="w-3/5 mx-auto grid grid-cols-2 py-12">
          <div>
            <h1 className="text-6xl font-extrabold tracking-tight">
              Share your knowledge with everyone
            </h1>
            <Link href="/explore">
              <a className="block my-8 py-3 px-6 font-bold text-lg rounded bg-indigo-600 w-max">
                Explore
              </a>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default IndexPage;
