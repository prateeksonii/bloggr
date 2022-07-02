import { ArrowCircleLeftIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import type { FC } from "react";

type PageTitleProps = {
  title: string;
};

const PageTitle: FC<PageTitleProps> = ({ title }) => {
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  return (
    <div className="relative">
      <ArrowCircleLeftIcon
        className="absolute -left-16 w-10 h-10 top-1/2 -translate-y-1/2 hover:bg-white rounded-full hover:text-black transition-all duration-200 hover:border-black cursor-pointer"
        onClick={goBack}
      />
      <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
    </div>
  );
};

export default PageTitle;
