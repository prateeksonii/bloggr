import { NextPage } from "next";
import { useRouter } from "next/router";
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

  return (
    <>
      <Navbar />
      <div className="mx-auto w-3/5">
        <h1 className="text-4xl font-bold tracking-tight">
          {data?.blog?.title}
        </h1>
        <p className="font-light mt-2">
          Published by{" "}
          <span className="font-bold">{data?.blog?.author.name}</span> on{" "}
          <span className="font-bold">
            {data?.blog?.createdAt.toDateString()}
          </span>
        </p>
        <p className="my-8">{data?.blog?.content}</p>
      </div>
    </>
  );
};

export default BlogPage;
