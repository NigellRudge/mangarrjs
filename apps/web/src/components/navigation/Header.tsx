import AccountMenuBtn from "@/components/buttons/AccountMenuBtn";
import MenuButton from "@/components/buttons/MenuButton";
import SearchInput from "@/components/inputs/SearchInput";
import useIsHovering from "@/hooks/useIsHovering";

const Header = ({ isScrolled = false }: { isScrolled?: boolean }) => {
  const { ref, isHovering } = useIsHovering();
  const isTransparent = isScrolled && !isHovering;
  return (
    <header
      ref={ref}
      className={`absolute top-0 left-0 right-0 transition-all ease-in-out duration-200 z-10 navbar px-5 pt-4 md:pr-6 flex flex-row justify-between gap-2 md:gap-8 bg-base-100 ${isTransparent ? "opacity-90" : "opacity-100"}`}
    >
      <MenuButton />

      <SearchInput />
      <div className=" flex-none gap-2">
        <AccountMenuBtn />
      </div>
    </header>
  );
};

export default Header;
