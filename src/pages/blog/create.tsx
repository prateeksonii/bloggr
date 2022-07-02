import { zodResolver } from "@hookform/resolvers/zod";
import { NextPage } from "next";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import PageTitle from "../../components/PageTitle";
import {
  CreateBlogValidator,
  createBlogValidator,
} from "../../shared/create-blog.validator";
import { trpc } from "../../utils/trpc";

const CreateBlogPage: NextPage = () => {
  const { mutateAsync } = trpc.useMutation("blogs.create");

  const { register, handleSubmit } = useForm<CreateBlogValidator>({
    resolver: zodResolver(createBlogValidator),
  });

  const onSubmit: SubmitHandler<CreateBlogValidator> = async (values) => {
    await toast.promise(mutateAsync(values), {
      pending: "Publishing blog...",
      error: "Failed to publish blog",
      success: "Blog published successfully",
    });
  };

  return (
    <>
      <Navbar />
      <div className="w-3/5 mx-auto">
        <PageTitle title="Write your blog" />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 flex flex-col gap-3 mb-8"
        >
          <input
            type="text"
            {...register("title")}
            className="rounded-md text-2xl bg-zinc-900 outline-none border-none resize-none w-full"
            placeholder="Blog title"
          />
          <textarea
            className="rounded-md bg-zinc-900 outline-none border-none resize-none w-full min-h-[70vh] p-2 font-mono"
            placeholder="Type markdown here"
            {...register("content")}
          ></textarea>
          <div className="ml-auto">
            <button
              type="submit"
              className="bg-indigo-600 rounded-md py-2 px-4"
            >
              Publish
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateBlogPage;
