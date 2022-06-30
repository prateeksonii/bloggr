import { NextPage } from "next";
import Link from "next/link";
import { useForm } from "react-hook-form";

const SigninPage: NextPage = () => {
  const { register } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <div className="w-3/5 mx-auto my-8">
      <h1 className="text-3xl font-bold">Sign in to continue.</h1>
      <Link href="/signup">
        <a className="block mt-4">
          Not registered? <span className="text-indigo-300">Signup here</span>
        </a>
      </Link>

      <form className="my-4 flex flex-col gap-3 items-start">
        <label htmlFor="email" className="block w-full">
          Email address
          <input
            type="email"
            className="block form-input bg-zinc-700 rounded w-1/3"
          />
        </label>
        <label htmlFor="password" className="block w-full">
          Password
          <input
            type="password"
            className="block form-input bg-zinc-700 rounded w-1/3"
          />
        </label>
        <button type="submit" className="bg-indigo-600 py-2 px-4 mt-2">
          Sign in
        </button>
      </form>
    </div>
  );
};

export default SigninPage;
