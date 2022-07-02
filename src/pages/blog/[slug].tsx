import { HeartIcon as HeartIconOutline } from "@heroicons/react/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/solid";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import { toast } from "react-toastify";
import remarkGfm from "remark-gfm";
import Navbar from "../../components/Navbar";
import PageTitle from "../../components/PageTitle";
import { trpc } from "../../utils/trpc";

const BlogPage: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  const { data, isLoading, isError } = trpc.useQuery([
    "blogs.bySlug",
    {
      slug: slug as string,
    },
  ]);

  const trpcContext = trpc.useContext();

  const { mutateAsync: mutateAsyncLike } = trpc.useMutation("blogs.like");
  const { mutateAsync: mutateAsyncDislike } = trpc.useMutation("blogs.dislike");

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error...</p>;

  const handleLike = async () => {
    if (!data?.blog) return;

    await mutateAsyncLike({
      blogId: data.blog.id,
    });

    trpcContext.invalidateQueries(["blogs.bySlug"]);
  };

  const handleDislike = async () => {
    if (!data?.blog) return;

    await mutateAsyncDislike({
      blogId: data.blog.id,
    });

    trpcContext.invalidateQueries(["blogs.bySlug"]);
  };

  return (
    <>
      <Head>
        <title>{data?.blog?.title ?? "Blog"}</title>
      </Head>
      <Navbar />
      <div className="mx-auto w-3/5">
        {data?.blog ? (
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
                <span>{data.blog.likedBy.length}</span>
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
