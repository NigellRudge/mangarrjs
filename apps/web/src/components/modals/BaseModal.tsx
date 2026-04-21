import { ReactNode } from "react";
import { Transition } from "@headlessui/react";
import { createPortal } from "react-dom";
import useClickOutside from "@/hooks/useClickOutside";

const BaseModal = ({
  children,
  onSuccessClick,
  onCancelClick = () => {},
  isOpen = false,
}: {
  children: ReactNode;
  isOpen?: boolean;
  onSuccessClick?: (data?: any) => void;
  onCancelClick?: () => void;
}) => {
  const { ref } = useClickOutside(() => {
    if (!isOpen) return;
    // onCancelClick();
  });

  return createPortal(
    <Transition
      as="div"
      className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center"
      show={isOpen}
    >
      <div className="absolute z-0 w-full h-full bg-gray-700 opacity-60" />
      <div ref={ref} className="block z-10 animate-fadein">
        {children}
      </div>
    </Transition>,
    document.body,
  );
};

export default BaseModal;
