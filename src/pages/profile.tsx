import { TrashIcon } from "@heroicons/react/solid";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { toast } from "react-toastify";
import { userAtom } from "../atoms/userAtom";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import { BASE_URL } from "../utils/constants";
import { queryClient } from "./_app";

const ProfilePage: NextPage = () => {
  const [user] = useAtom(userAtom);

  const { isLoading, isError, data } = useQuery(["blogs.byUser"], async () => {
    const { blogs } = await fetch(`${BASE_URL}/api/v1/blogs/user`).then((res) =>
      res.json()
    );
    return blogs;
  });
  const { mutateAsync } = useMutation(async (blogId: string) => {
    await fetch(`/api/v1/blogs/${blogId}`, {
      method: "DELETE",
    });
  });

  if (isLoading) return <div>Loading blogs...</div>;

  if (isError) return <div>Something went wrong</div>;

  if (!data ?? data?.blogs.length === 0) return <div>No blogs found</div>;

  const handleDeleteBlog = async (blogId: string, userId: string) => {
    await toast.promise(mutateAsync(blogId), {
      pending: "Deleting blog...",
      success: "Blog deleted",
      error: "Something went wrong",
    });
    queryClient.invalidateQueries(["blogs.byUser"]);
  };

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <Navbar />
      <div className="w-3/5 mx-auto">
        <PageTitle title={user?.name ?? ""} />

        <div className="my-8 flex flex-col gap-4">
          <p className="mt-4 text-lg">
            Total blogs published:{" "}
            <span className="font-bold text-2xl">{data?.blogs?.length}</span>
          </p>
          {data?.blogs.map((blog: any) => (
            <div
              key={blog.id}
              className="p-4 bg-zinc-900 rounded-md flex items-center justify-between"
            >
              <div className="flex flex-col">
                <Link href={`/blog/${blog.slug}`} key={blog.id}>
                  <a className="text-2xl font-bold cursor-pointer">
                    {blog.title}
                  </a>
                </Link>
                <p className="font-light text-sm mt-2">
                  <span>{blog.createdAt.toDateString()}</span>
                </p>
              </div>

              <button
                className="p-3 hover:bg-zinc-800 rounded-full transition-all z-10"
                onClick={() => handleDeleteBlog(blog.id, blog.authorId)}
              >
                <TrashIcon className="text-red-500 w-6 h-6" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
