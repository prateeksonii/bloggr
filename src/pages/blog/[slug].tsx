import { HeartIcon as HeartIconOutline } from "@heroicons/react/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/solid";
import { useMutation, useQuery } from "@tanstack/react-query";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Navbar from "../../components/Navbar";
import PageTitle from "../../components/PageTitle";
import { BASE_URL } from "../../utils/constants";
import { queryClient } from "../_app";

const BlogPage: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  const {
    data: blog,
    isLoading,
    isError,
  } = useQuery(["blogs.bySlug"], async () => {
    const { blog } = await fetch(`${BASE_URL}/api/v1/blogs/${slug}`).then(
      (res) => res.json()
    );
    return blog;
  });

  const { mutateAsync: mutateAsyncLike } = useMutation(async () => {
    await fetch(`${BASE_URL}/api/v1/blogs/${blog?.id}/like`, {
      method: "POST",
    });
  });
  const { mutateAsync: mutateAsyncDislike } = useMutation(async () => {
    await fetch(`${BASE_URL}/api/v1/blogs/${blog?.id}/dislike`, {
      method: "POST",
    });
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error...</p>;

  const handleLike = async () => {
    if (!blog) return;

    await mutateAsyncLike();

    queryClient.invalidateQueries(["blogs.bySlug"]);
  };

  const handleDislike = async () => {
    if (!blog) return;

    await mutateAsyncDislike();

    queryClient.invalidateQueries(["blogs.bySlug"]);
  };

  return (
    <>
      <Head>
        <title>{blog?.blog?.title ?? "Blog"}</title>
      </Head>
      <Navbar />
      <div className="mx-auto w-3/5">
        {blog ? (
          <>
            <PageTitle title={blog?.title ?? ""} />
            <p className="font-light mt-2">
              Published by{" "}
              <span className="font-bold">{blog?.author.name}</span> on{" "}
              <span className="font-bold">
                {blog?.createdAt.toDateString()}
              </span>
              <span className="mt-4 flex items-center gap-2">
                {blog?.liked ? (
                  <HeartIconSolid className="w-6 h-6" onClick={handleDislike} />
                ) : (
                  <HeartIconOutline className="w-6 h-6" onClick={handleLike} />
                )}{" "}
                <span>{blog.blog.likedBy.length}</span>
              </span>
            </p>
            <article className="my-8 prose !max-w-full lg:prose-lg prose-invert bg-zinc-900 p-8 rounded-md">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {blog?.content}
              </ReactMarkdown>
            </article>
          </>
        ) : (
          <p>No blog found</p>
        )}
      </div>
    </>
  );
};

export default BlogPage;
