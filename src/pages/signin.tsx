import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { SigninValidator, signinValidator } from "../shared/signin.validator.";
import { BASE_URL } from "../utils/constants";

const SigninPage: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninValidator>({
    resolver: zodResolver(signinValidator),
  });

  const router = useRouter();

  const { mutateAsync, data } = useMutation(async (data: SigninValidator) => {
    const response = await fetch(`${BASE_URL}/api/v1/auth/signin`, {
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

  const onSubmit: SubmitHandler<SigninValidator> = async (values) => {
    const res = await mutateAsync(values);

    if (!res.error) {
      toast.success("Successfully signed in");
      await router.replace("/explore");
    } else {
      toast.error(res.error.message);
    }
  };

  return (
    <div className="w-3/5 mx-auto my-8">
      <h1 className="text-3xl font-bold">Sign in to continue.</h1>
      <Link href="/signup">
        <a className="block mt-4">
          Not registered? <span className="text-indigo-300">Signup here</span>
        </a>
      </Link>

      <form
        className="my-4 flex flex-col gap-3 items-start"
        onSubmit={handleSubmit(onSubmit)}
      >
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
        <button type="submit" className="bg-indigo-600 py-2 px-4 mt-2 rounded">
          Sign in
        </button>
      </form>
    </div>
  );
};

export default SigninPage;
