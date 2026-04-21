import { useNavigationState } from "@/providers/NavigationStateProvider";
import Icon from "@/components/Icon";

const MenuButton = () => {
  const { isSideBarCollapsed, setIsSideBarCollapsed } = useNavigationState();
  return (
    <div className="lg:hidden flex">
      <button
        onClick={() => setIsSideBarCollapsed((prev) => !prev)}
        className="btn btn-square flex align-center justify-center"
      >
        <Icon
          name={isSideBarCollapsed ? "hamburger" : "close"}
          className="text-gray-200"
          width={32}
          height={32}
        />
      </button>
    </div>
  );
};

export default MenuButton;
