import {
  HiBellAlert,
  HiOutlineBellAlert,
  HiCalendar,
  HiOutlineCalendar,
  HiOutlineClipboardDocumentList,
  HiClipboardDocumentList,
  HiOutlineFolderArrowDown,
  HiFolderArrowDown,
  HiArrowRightEndOnRectangle,
  HiInformationCircle,
  HiDocumentDuplicate,
} from "react-icons/hi2";
import {
  HiOutlineCog,
  HiCog,
  HiOutlineSearch,
  HiStar,
  HiMenuAlt2,
  HiX,
  HiChevronDoubleLeft,
  HiChevronLeft,
  HiChevronRight,
  HiChevronDoubleRight,
  HiOutlineBookmark,
  HiBookmark,
  HiUser,
  HiOutlineUser,
  HiLightningBolt,
  HiOutlineLightningBolt,
  HiSave,
  HiEye,
  HiEyeOff,
  HiRefresh,
  HiOutlinePlus,
  HiFolder,
  HiOutlineLogin,
} from "react-icons/hi";

export type IconName =
  | "gear"
  | "gearFilled"
  | "user"
  | "userFilled"
  | "logout"
  | "task"
  | "taskFilled"
  | "search"
  | "searchFilled"
  | "folder"
  | "folder2"
  | "folderFilled"
  | "bookmark"
  | "bookmarkFilled"
  | "star"
  | "hamburger"
  | "calendar"
  | "calendarFilled"
  | "chevronLeft"
  | "chevronDoubleLeft"
  | "chevronRight"
  | "chevronDoubleRight"
  | "notifications"
  | "notificationsFilled"
  | "services"
  | "servicesFilled"
  | "info"
  | "save"
  | "show"
  | "hide"
  | "copy"
  | "refresh"
  | "plus"
  | "login"
  | "close";

const Icon = ({
  name,
  size = 24,
  ...props
}: {
  name: IconName;
  width?: number;
  height?: number;
  className?: string;
  color?: string;
  size?: number;
}) => {
  switch (name) {
    case "gear":
      return <HiOutlineCog size={size} {...props} />;
    case "gearFilled":
      return <HiCog size={size} {...props} />;
    case "user":
      return <HiOutlineUser size={size} {...props} />;
    case "userFilled":
      return <HiUser size={size} {...props} />;
    case "logout":
      return <HiArrowRightEndOnRectangle size={size} {...props} />;
    case "task":
      return <HiOutlineClipboardDocumentList size={size} {...props} />;
    case "taskFilled":
      return <HiClipboardDocumentList size={size} {...props} />;
    case "search":
      return <HiOutlineSearch size={size} {...props} />;
    case "searchFilled":
      return <HiOutlineSearch size={size} {...props} />;
    case "folder2":
      return <HiFolder size={size} {...props} />;
    case "folder":
      return <HiOutlineFolderArrowDown size={size} {...props} />;
    case "folderFilled":
      return <HiFolderArrowDown size={size} {...props} />;
    case "bookmark":
      return <HiOutlineBookmark size={size} {...props} />;
    case "bookmarkFilled":
      return <HiBookmark size={size} {...props} />;
    case "star":
      return <HiStar size={size} {...props} />;
    case "hamburger":
      return <HiMenuAlt2 size={size} {...props} />;
    case "close":
      return <HiX size={size} {...props} />;
    case "calendar":
      return <HiOutlineCalendar size={size} {...props} />;
    case "calendarFilled":
      return <HiCalendar size={size} {...props} />;
    case "chevronDoubleLeft":
      return <HiChevronDoubleLeft size={size} {...props} />;
    case "chevronLeft":
      return <HiChevronLeft size={size} {...props} />;
    case "chevronDoubleRight":
      return <HiChevronDoubleRight size={size} {...props} />;
    case "chevronRight":
      return <HiChevronRight size={size} {...props} />;
    case "notifications":
      return <HiOutlineBellAlert size={size} {...props} />;
    case "notificationsFilled":
      return <HiBellAlert size={size} {...props} />;
    case "services":
      return <HiOutlineLightningBolt size={size} {...props} />;
    case "servicesFilled":
      return <HiLightningBolt size={size} {...props} />;
    case "info":
      return <HiInformationCircle size={size} {...props} />;
    case "save":
      return <HiSave size={size} {...props} />;
    case "show":
      return <HiEye size={size} {...props} />;
    case "hide":
      return <HiEyeOff size={size} {...props} />;
    case "refresh":
      return <HiRefresh size={size} {...props} />;
    case "copy":
      return <HiDocumentDuplicate size={size} {...props} />;
    case "plus":
      return <HiOutlinePlus size={size} {...props} />;
    case "login":
      return <HiOutlineLogin size={size} {...props} />;

    default:
      return null;
  }
};

export default Icon;
