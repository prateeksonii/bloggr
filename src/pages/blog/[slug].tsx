import { ArrowLeftIcon, ArrowCircleLeftIcon } from "@heroicons/react/solid";
import { NextPage } from "next";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Navbar from "../../components/Navbar";
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

  const goBack = () => {
    router.back();
  };

  return (
    <>
      <Navbar />
      <div className="mx-auto w-3/5">
        {data?.blog ? (
          <>
            <div className="relative">
              <ArrowCircleLeftIcon
                className="absolute -left-16 w-10 h-10 top-1/2 -translate-y-1/2 hover:bg-white rounded-full hover:text-black transition-all duration-200 hover:border-black cursor-pointer"
                onClick={goBack}
              />
              <h1 className="text-4xl font-bold tracking-tight">
                {data?.blog?.title}
              </h1>
            </div>
            <p className="font-light mt-2">
              Published by{" "}
              <span className="font-bold">{data?.blog?.author.name}</span> on{" "}
              <span className="font-bold">
                {data?.blog?.createdAt.toDateString()}
              </span>
            </p>
            <article className="my-8 prose prose-invert">
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
