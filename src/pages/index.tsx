import { NextPage } from "next";
import Link from "next/link";

const IndexPage: NextPage = () => {
  return (
    <div className="min-h-screen">
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
  );
};

export default IndexPage;
