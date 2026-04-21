import { useState } from "react";
import useClickOutside from "@/hooks/useClickOutside";
import Link from "next/link";
import Icon, { IconName } from "@/components/Icon";
import useAuth from "@/hooks/useAuth";
import Image from "next/image";

const MenuItem = ({
  url,
  label,
  icon,
  onClick,
}: {
  url: string;
  label: string;
  icon: IconName;
  onClick?: () => void;
}) => {
  return (
    <li className="hover:bg-base-200 rounded-md group">
      <Link
        href={url}
        onClick={() => onClick && onClick()}
        className="text-white w-full h-full p-2 flex flex-row item-center gap-3"
      >
        <Icon
          className="group-hover:text-primary"
          name={icon}
          height={24}
          width={24}
        />
        {label}
      </Link>
    </li>
  );
};

const AccountMenuBtn = ({}) => {
  const { logout, user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const { ref } = useClickOutside(() => setIsCollapsed(true));
  const handleClick = () => setIsCollapsed((prev) => !prev);

  return (
    <div className="relative">
      <div ref={ref} onClick={handleClick} className="cursor-pointer">
        <div className="avatar">
          <div className="w-10 rounded-full overflow-hidden relative">
            <Image
              alt="/avatar.jpg"
              fill
              src="/avatar.jpg"
              loading="eager"
              sizes="100px"
            />
          </div>
        </div>
      </div>

      {!isCollapsed && (
        <ul className="w-64 animate-dropdown absolute flex flex-col right-0 mt-3 origin-top-right rounded-md shadow-lg scale-100 bg-base-100/95 border-1 z-20 border-gray-500 p-2">
          <li className="flex flex-col border-b border-gray-500 px-4 pt-2 pb-4 mb-2">
            <span className="text-xl text-gray-100 font-bold capitalize">
              {user?.username}
            </span>
            <span className="text-sm text-gray-400 font-semibold">
              {user?.email}
            </span>
          </li>
          <MenuItem url="/" label="Account" icon="user" />
          <MenuItem url="/settings" label="Setting" icon="gear" />
          <MenuItem url="/" label="Logout" icon="logout" onClick={logout} />
        </ul>
      )}
    </div>
  );
};

export default AccountMenuBtn;
