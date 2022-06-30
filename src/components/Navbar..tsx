import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="w-3/5 mx-auto h-18 flex items-center justify-between">
      <div className="tracking-widest text-xl">Bloggr</div>
      <Link href="/signin">
        <a className="block my-8 py-2 px-4 rounded bg-indigo-600 w-max">
          Sign in
        </a>
      </Link>
    </nav>
  );
};

export default Navbar;
