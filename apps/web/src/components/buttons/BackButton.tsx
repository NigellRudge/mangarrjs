import Icon from "@/components/shared/Icon";
import { useRouter } from "next/router";

const BackButton = () => {
  const router = useRouter();
  return (
    <button onClick={() => router.back()} className="btn btn-ghost">
      <Icon name="chevronLeft" width={24} height={24} />
    </button>
  );
};

export default BackButton;
