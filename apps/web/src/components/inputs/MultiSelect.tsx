import { useState, useRef, useEffect } from "react";

const MultiSelect = ({
  options,
  placeholder = "Select options",
  className = "",
}: {
  placeholder?: string;
  className?: string;
  options: { label: string; value: string }[];
}) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleOption = (value: string) => {
    setSelected((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value);
      }
      return [...prev, value];
    });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`w-full relative ${className}`} ref={dropdownRef}>
      {/* Input container */}
      <div
        className="input input-bordered w-full min-h-[3rem] flex flex-wrap gap-2 items-center cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        {selected.length === 0 && (
          <span className="text-gray-400">{placeholder}</span>
        )}

        {selected.map((value) => {
          const option = options.find((o) => o.value === value);
          return (
            <div key={value} className="badge badge-primary gap-1">
              {option?.label}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleOption(value);
                }}
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>

      {/* Dropdown */}
      {open && (
        <ul className="absolute z-50 mt-1 w-full bg-base-100 border rounded-box shadow max-h-60 overflow-y-auto">
          {options.map((option) => (
            <li
              key={option.value}
              className="p-2 hover:bg-base-200 cursor-pointer flex items-center gap-2"
              onClick={() => toggleOption(option.value)}
            >
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                readOnly
                checked={selected.includes(option.value)}
              />
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MultiSelect;
