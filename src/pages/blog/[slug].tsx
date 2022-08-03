import { HeartIcon as HeartIconOutline } from "@heroicons/react/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/solid";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import superjson from "superjson";
import { userAtom } from "../../atoms/userAtom";
import Navbar from "../../components/Navbar";
import PageTitle from "../../components/PageTitle";
import { BASE_URL } from "../../utils/constants";
import { queryClient } from "../_app";

const BlogPage: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  const [user] = useAtom(userAtom);

  const { data, isLoading, isError } = useQuery<any>(
    ["blogs.bySlug"],
    async () => {
      const blog = await fetch(
        `${BASE_URL}/api/v1/blogs/${slug}?userId=${user?.id}`,
        {
          credentials: "include",
        }
      ).then((res) => res.json());
      return superjson.parse(blog);
    }
  );

  const { mutateAsync: mutateAsyncLike } = useMutation(async () => {
    await fetch(`${BASE_URL}/api/v1/blogs/${data?.blog?.id}/like`, {
      method: "POST",
      credentials: "include",
    });
  });
  const { mutateAsync: mutateAsyncDislike } = useMutation(async () => {
    await fetch(`${BASE_URL}/api/v1/blogs/${data?.blog?.id}/dislike`, {
      method: "POST",
      credentials: "include",
    });
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error...</p>;

  const handleLike = async () => {
    if (!data) return;

    await mutateAsyncLike();

    queryClient.invalidateQueries(["blogs.bySlug"]);
  };

  const handleDislike = async () => {
    if (!data) return;

    await mutateAsyncDislike();

    queryClient.invalidateQueries(["blogs.bySlug"]);
  };

  return (
    <>
      <Head>
        <title>{data?.blog?.title ?? "Blog"}</title>
      </Head>
      <Navbar />
      <div className="mx-auto w-3/5">
        {data ? (
          <>
            <PageTitle title={data?.blog?.title ?? ""} />
            <p className="font-light mt-2">
              Published by{" "}
              <span className="font-bold">{data?.blog?.author.name}</span> on{" "}
              <span className="font-bold">
                {data?.blog?.createdAt.toDateString()}
              </span>
              <span className="mt-4 flex items-center gap-2">
                {data?.liked ? (
                  <HeartIconSolid className="w-6 h-6" onClick={handleDislike} />
                ) : (
                  <HeartIconOutline className="w-6 h-6" onClick={handleLike} />
                )}{" "}
                <span>{data?.blog?.likedBy.length}</span>
              </span>
            </p>
            <article className="my-8 prose !max-w-full lg:prose-lg prose-invert bg-zinc-900 p-8 rounded-md">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {data?.blog?.content}
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
