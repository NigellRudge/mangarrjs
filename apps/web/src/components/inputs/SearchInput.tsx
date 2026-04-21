import Icon from "@/components/Icon";
import useSearchInput from "@/hooks/useSearch";

const SearchInput = () => {
  const {
    inputValue,
    handleSearch,
    showClearButton,
    clearQuery,
    onFocus,
    onBlur,
  } = useSearchInput();

  return (
    <div className="block relative w-full">
      <label className="input w-full  rounded-2xl bg-base-300 outline-none h-[50px] relative">
        <Icon name="search" className="text-gray-300 " />
        <input
          className="text-gray-300 placeholder-gray-400 outline-none text-lg "
          type="input"
          value={inputValue}
          onChange={handleSearch}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder="Search Mangas"
        />
        {showClearButton && (
          <button
            className="btn btn-ghost bg-gray-200 rounded-full px-2 py-1 h-[35px]"
            onClick={clearQuery}
          >
            <Icon name="close" size={20} className="text-gray-800 " />
          </button>
        )}
      </label>
    </div>
  );
};

export default SearchInput;
