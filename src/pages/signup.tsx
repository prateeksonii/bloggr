import { NextPage } from "next";
import { useForm } from "react-hook-form";
import Navbar from "../components/Navbar.";

const SignupPage: NextPage = () => {
  const { register } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  return (
    <>
      <Navbar />
      <div className="w-3/5 mx-auto my-8">
        <h1 className="text-3xl font-bold">Get started with Bloggr</h1>

        <form className="my-8 flex flex-col gap-3 items-start">
          <label htmlFor="name" className="block w-full">
            Full name
            <input
              type="text"
              className="block form-input bg-zinc-700 rounded w-1/3"
            />
          </label>
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
            Sign up
          </button>
        </form>
      </div>
    </>
  );
};

export default SignupPage;
