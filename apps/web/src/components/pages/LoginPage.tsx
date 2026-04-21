import LoginForm from "@/components/forms/LoginForm";
import Carousel from "@/components/Carousel";
import Image from "next/image";

const LoginPage = () => {
  return (
    <div className="flex flex-col w-screen h-screen items-center justify-end md:justify-center ">
      <Carousel />
      <div className="z-10 h-[150px] w-full md:hidden block absolute top-0">
        <Image src="/logos/app-logo.svg" alt="logo" fill loading="eager" />
      </div>
      <div className="z-10 flex flex-col justify-center items-center p-8 w-[100vw] md:w-lg bg-base-300/80 rounded-t-3xl md:rounded-xl py-8">
        <div className="z-10 relative h-[100px] w-full hidden md:block mb-4">
          <Image src="/logos/app-logo.svg" alt="logo" fill loading="eager" />
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
