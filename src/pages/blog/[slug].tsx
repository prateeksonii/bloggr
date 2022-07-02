import { ArrowLeftIcon, ArrowCircleLeftIcon } from "@heroicons/react/solid";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
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

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error...</p>;

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
