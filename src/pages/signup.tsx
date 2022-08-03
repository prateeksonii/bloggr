import { NextPage } from "next";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import {
  createUserValidator,
  CreateUserValidator,
} from "../shared/create-user.validator";
import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "../utils/constants";

const SignupPage: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserValidator>({
    resolver: zodResolver(createUserValidator),
  });

  const router = useRouter();

  const { mutateAsync } = useMutation(async (data: CreateUserValidator) => {
    const response = await fetch(`${BASE_URL}/api/v1/users`, {
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

  const onSubmit: SubmitHandler<CreateUserValidator> = async (values) => {
    const res = await mutateAsync(values);

    if (!res.error) {
      toast.success("Successfully signed up");
      await router.replace("/signin");
    } else {
      toast.error(res.error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="w-3/5 mx-auto my-8">
        <h1 className="text-3xl font-bold">Get started with Bloggr</h1>

        <form
          className="my-8 flex flex-col gap-3 items-start"
          onSubmit={handleSubmit(onSubmit)}
        >
          <label htmlFor="name" className="block w-full">
            Full name
            <input
              type="text"
              className="block form-input bg-zinc-700 rounded w-1/3"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </label>
          <label htmlFor="email" className="block w-full">
            Email address
            <input
              type="email"
              className="block form-input bg-zinc-700 rounded w-1/3"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </label>
          <label htmlFor="password" className="block w-full">
            Password
            <input
              type="password"
              className="block form-input bg-zinc-700 rounded w-1/3"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </label>
          <button type="submit" className="bg-indigo-600 py-2 px-4 mt-2">
            Sign up
          </button>
        </form>
      </div>
    </>
  );
};

export default SignupPage;
