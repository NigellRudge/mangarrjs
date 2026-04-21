import Image from "next/image";
import Link from "next/link";

const Logo = () => (
  <Link
    href="/"
    className="flex relative h-[96px] w-full items-center text-xl font-bold text-white"
  >
    <Image src="/logos/app-logo.svg" alt="logo" fill loading="eager" />
  </Link>
);

export default Logo;
