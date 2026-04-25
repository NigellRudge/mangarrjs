import LoginForm from "@/components/forms/LoginForm";
import Carousel from "@/components/Carousel";
import Logo from "@/components/Logo";

const LoginPage = () => {
  return (
    <div className="flex flex-col w-screen h-screen items-center justify-end md:justify-center ">
      <Carousel />
      <div className="z-10 flex flex-col justify-center items-center p-8 w-[100vw] md:w-lg bg-base-300/80 rounded-t-3xl md:rounded-xl py-8 h-[35vh]">
        <div className="z-10 block mb-4 min-w-[400px] min-h-[100px] w-full ">
          <Logo />
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
