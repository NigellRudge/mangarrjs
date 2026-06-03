import { JSX, ReactNode } from "react";
import { createPortal } from "react-dom";
import Icon from "@/components/shared/Icon";
import useOnKeyPress from "@/hooks/useOnKeyPress";

const Flyout = ({
  isOpen = false,
  children,
  footer,
  title,
  subTitle,
  onClose = () => {},
}: {
  isOpen?: boolean;
  children: ReactNode | JSX.Element;
  header?: string | JSX.Element | ReactNode;
  footer?: JSX.Element | ReactNode;
  onClose?: () => void;
  title?: string;
  subTitle?: string;
}) => {
  useOnKeyPress({ keycode: "Escape", callback: onClose });

  if (!children) return null;

  return createPortal(
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="z-[10]  absolute inset-0 animate-sidebar duration-200 bg-gray-800/80"
        />
      )}
      <div
        className={`z-[11]  ${isOpen ? "translate-x-0 opacity-100" : "translate-x-full"} fixed inset-y-0 right-0 w-[calc(100vw-16px)] max-w-[450px] p-2  transition-all duration-300 ease-in-out`}
      >
        <div
          className={` backdrop-blur-md flex flex-col gap-3 bg-base-100/90  border rounded-lg border-gray-700 h-full`}
        >
          <div className="flex flex-row justify-between p-4 border-b-gray-700 border-b">
            <div className="flex flex-col">
              <h3 className="text-gray-200 text-2xl font-normal">{title}</h3>
              <span className="text-gray-200 text-md font-normal">
                {subTitle}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-300 cursor-pointer p-1 flex items-center justify-center hover:text-gray-100 transition-colors ease-in-out duration-200"
            >
              <Icon name="close" size={32} />
            </button>
          </div>
          <div className="flex flex-col justify-between flex-1 px-2 pb-6">
            {children}
          </div>
          <div className="flex flex-col border-t border-gray-700 p-4">
            {footer}
          </div>
        </div>
      </div>
    </>,

    document.body,
  );
};

export default Flyout;
