import { Popover, Transition } from "@headlessui/react";
import { useAtom } from "jotai";
import Link from "next/link";
import { toast } from "react-toastify";
import { ChevronUpIcon } from "@heroicons/react/solid";
import { userAtom } from "../atoms/userAtom";
import React from "react";
import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "../utils/constants";
import { queryClient } from "../pages/_app";

const Navbar = () => {
  const [user] = useAtom<any>(userAtom);

  const { mutateAsync } = useMutation(async () => {
    await fetch(`${BASE_URL}/api/v1/auth/signout`, {
      method: "DELETE",
    });

    return null;
  });

  const handleSignout = async () => {
    await toast.promise(mutateAsync(), {
      pending: "Signing out...",
      error: "Failed to sign out",
      success: "Signed out successfully",
    });

    queryClient.invalidateQueries(["auth.me"]);
  };

  return (
    <nav className="w-3/5 mx-auto h-[80px] flex items-center justify-between">
      <Link href="/explore">
        <a className="tracking-widest text-xl">Bloggr</a>
      </Link>
      {user ? (
        <div className="flex items-center gap-8">
          <Link href="/blog/create">
            <a className="bg-indigo-600 py-2 px-4 rounded-md">Create blog</a>
          </Link>
          <Popover as="div" className="relative">
            {({ open }) => (
              <>
                <Popover.Button className="flex items-center gap-2 rounded-md outline-none">
                  <div className="rounded-full bg-zinc-700 p-2">
                    {user.name
                      .split(" ")
                      .map((name: string) => name[0])
                      .join(".")}
                  </div>
                  <ChevronUpIcon
                    className={`${
                      !open ? "rotate-180 transform" : ""
                    } h-5 w-5 text-indigo-500 transition-all`}
                  />
                </Popover.Button>
                <Transition
                  as={React.Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Popover.Panel className="absolute top-[140%] right-0 min-w-[300px]">
                    <div className="bg-zinc-900 w-full grid gap-3 p-4 rounded-md text-center">
                      <span>Welcome, {user.name}</span>
                      <Link href="/profile">
                        <a className="block py-2 px-4 rounded w-full font-bold bg-zinc-700">
                          View profile
                        </a>
                      </Link>
                      <button
                        className="block py-2 px-4 rounded bg-indigo-600 w-full"
                        onClick={handleSignout}
                      >
                        Sign out
                      </button>
                    </div>
                  </Popover.Panel>
                </Transition>
              </>
            )}
          </Popover>
        </div>
      ) : (
        // <div className="flex items-center gap-4">
        //   <div>{user.name}</div>
        // </div>
        <Link href="/signin">
          <a className="block py-2 px-4 rounded bg-indigo-600 w-max">Sign in</a>
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
