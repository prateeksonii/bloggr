import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import PageTitle from "../../components/PageTitle";
import {
  CreateBlogValidator,
  createBlogValidator,
} from "../../shared/create-blog.validator";
import { BASE_URL } from "../../utils/constants";

const CreateBlogPage: NextPage = () => {
  const router = useRouter();

  const { mutateAsync } = useMutation(async (data: CreateBlogValidator) => {
    const response = await fetch(`${BASE_URL}/api/v1/blogs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.status === 500) {
      const { message } = await response.json();
      return {
        error: {
          message,
        },
      };
    }

    return {
      error: null,
    };
  });

  const { register, handleSubmit } = useForm<CreateBlogValidator>({
    resolver: zodResolver(createBlogValidator),
  });

  const onSubmit: SubmitHandler<CreateBlogValidator> = async (values) => {
    const res = await mutateAsync(values);
    if (!res.error) {
      toast.success("Successfully created blog");
      await router.push("/explore");
    } else {
      toast.error(res.error.message);
    }
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
