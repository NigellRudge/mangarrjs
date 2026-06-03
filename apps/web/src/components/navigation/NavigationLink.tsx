import Link from "next/link";
import { IconName } from "@/components/shared/Icon";
import { ReactNode } from "react";

const IconWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex items-center justify-center">{children}</div>;
};

const NavigationLink = ({
  label,
  url,
  leftIcon = null,
  rightIcon = null,
  textSize = "md",
  isActive,
}: {
  label: string;
  url: string;
  isActive: boolean;
  iconName?: IconName;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  textSize?: "sm" | "lg" | "md";
}) => (
  <Link
    href={url}
    className={` flex flex-row gap-1 px-4 py-2 rounded-md ${isActive ? "text-white bg-base-300 border border-gray-700" : "text-gray-400 border-none"} hover:text-white hover:bg-base-300 transition-all duration-200 ease-in-out font-bold m-0`}
  >
    {leftIcon && <IconWrapper>{leftIcon}</IconWrapper>}
    <span className={`text-[${textSize}]`}></span>
    {label}
    {rightIcon && <IconWrapper>{rightIcon}</IconWrapper>}
  </Link>
);

export default NavigationLink;
