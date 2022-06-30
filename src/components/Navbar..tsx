import { useAtom } from "jotai";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { userAtom } from "../atoms/userAtom";
import { trpc } from "../utils/trpc";

const Navbar = () => {
  const router = useRouter();
  const [user, setUser] = useAtom(userAtom);
  const { mutateAsync } = trpc.useMutation("auth.signout");
  const trcpContext = trpc.useContext();

  const handleSignout = async () => {
    await toast.promise(mutateAsync(), {
      pending: "Signing out...",
      error: "Failed to sign out",
      success: "Signed out successfully",
    });

    trcpContext.invalidateQueries("auth.me");
  };

  return (
    <nav className="w-3/5 mx-auto h-16 flex items-center justify-between">
      <div className="tracking-widest text-xl">Bloggr</div>
      {user ? (
        <div className="flex items-center gap-4">
          <div>{user.name}</div>
          <button
            className="block py-2 px-4 rounded bg-indigo-600 w-max"
            onClick={handleSignout}
          >
            Sign out
          </button>
        </div>
      ) : (
        <Link href="/signin">
          <a className="block py-2 px-4 rounded bg-indigo-600 w-max">Sign in</a>
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
