import Icon, { IconName } from "@/components/Icon";
import { ReactNode } from "react";
import Image from "next/image";

const Section = ({
  label,
  iconName,
  logo,
  body,
  footer,
}: {
  label: string;
  logo?: string;
  iconName?: IconName;
  body: ReactNode;
  footer: ReactNode;
}) => {
  return (
    <div className="border border-gray-600 rounded-lg w-full md:max-w-[500px] bg-base-200">
      <div className="flex flex-row border-b gap-4 border-gray-600 px-6 py-3">
        {iconName && <Icon name={iconName} />}
        {logo && (
          <span className="w-8 aspect-square relative">
            <Image
              fill
              className="w-full h-full object-cover"
              src={logo}
              alt={`service-${label}-${logo}`}
            />
          </span>
        )}
        <span className="text-lg text-gray-200">{label}</span>
      </div>
      <div className="px-6 py-3">{body}</div>
      <div className="px-6 py-3 border-gray-600  border-t">{footer}</div>
    </div>
  );
};

export default Section;
