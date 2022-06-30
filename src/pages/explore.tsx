import { NextPage } from "next";
import Head from "next/head";
import Navbar from "../components/Navbar.";

const ExplorePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Bloggr | Explore</title>
      </Head>
      <Navbar />
      <div className="w-3/5 mx-auto">
        <h1 className="text-3xl font-extrabold tracking-tight">Explore</h1>
      </div>
    </>
  );
};

export default ExplorePage;
