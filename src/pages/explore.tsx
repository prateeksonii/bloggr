import { NextPage } from "next";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/solid";
import Head from "next/head";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../utils/constants";

const ExplorePage: NextPage = () => {
  const { data, isLoading, isError } = useQuery(["blogs.all"], async () => {
    const { blogs } = await fetch(`${BASE_URL}/api/v1/blogs`).then((res) =>
      res.json()
    );
    return blogs;
  });

  return (
    <>
      <Head>
        <title>Bloggr | Explore</title>
      </Head>
      <Navbar />
      <div className="w-3/5 mx-auto">
        <h1 className="text-3xl font-extrabold tracking-tight">Explore</h1>
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error...</p>}
        {data && data.blogs.length > 0 ? (
          <div className="my-8 flex flex-col gap-4">
            {data.blogs.map((blog: any) => (
              <Link href={`/blog/${blog.slug}`} key={blog.id}>
                <div className="p-4 bg-zinc-900 rounded-md cursor-pointer">
                  <h2 className="text-2xl font-bold">{blog.title}</h2>
                  <p className="font-light text-sm mt-2">
                    Published by{" "}
                    <span className="font-bold">{blog.author.name}</span> on{" "}
                    <span className="font-bold">
                      {blog.createdAt.toDateString()}
                    </span>
                    <span className="mt-4 flex items-center gap-2">
                      <HeartIconSolid className="w-6 h-6" />
                      <span>{blog.likedBy.length}</span>
                    </span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-8">No blogs found</p>
        )}
      </div>
    </>
  );
};

export default ExplorePage;
