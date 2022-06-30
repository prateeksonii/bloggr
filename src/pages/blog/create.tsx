import Navbar from "../../components/Navbar";

const CreateBlogPage = () => {
  return (
    <>
      <Navbar />
      <div className="w-3/5 mx-auto">
        <textarea className="rounded-md bg-zinc-800 outline-none border-none resize-none w-full min-h-[90vh] p-8"></textarea>
      </div>
    </>
  );
};

export default CreateBlogPage;
