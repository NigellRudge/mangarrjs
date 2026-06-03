import Image from "next/image";
import Link from "next/link";

const Logo = () => (
  <Link
    href="/apps/web/public"
    className="flex flex-row relative max-w-[400px] max-h-[100px] w-full min-h-[100px] items-center justify-center text-xl font-bold text-white"
  >
    <Image
      src="/logos/mangarr-logo-white.png"
      alt="logo"
      fill
      loading="eager"
      className="object-cover "
    />
  </Link>
);

export default Logo;
