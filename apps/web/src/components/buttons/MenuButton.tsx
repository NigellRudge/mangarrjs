import { useNavigationState } from "@/providers/NavigationStateProvider";
import Icon from "@/components/shared/Icon";

const MenuButton = () => {
  const { setIsSideBarCollapsed } = useNavigationState();
  return (
    <div className="lg:hidden flex">
      <button
        onClick={() => setIsSideBarCollapsed(false)}
        className="flex align-center justify-center p-2 btn btn-link"
      >
        <Icon name="hamburger" className="text-gray-200" size={30} />
      </button>
    </div>
  );
};

export default MenuButton;
