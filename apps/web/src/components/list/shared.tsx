export const TypeIndicator = ({ type }: { type: "manga" | "chapter" }) => {
  if (!["manga", "chapter"].includes(type)) return null;
  const backgroundColor = type === "manga" ? "bg-secondary" : "bg-primary";
  const text = type === "manga" ? "Manga" : "Chapter";

  return (
    <div
      className={`text-xs top-3 right-3 absolute z-[5] flex items-center justify-center px-2 py-1 rounded-2xl text-gray-100 ${backgroundColor} group-hover:scale-[1.02] transition-transform ease-in-out duration-200`}
    >
      {text}
    </div>
  );
};
