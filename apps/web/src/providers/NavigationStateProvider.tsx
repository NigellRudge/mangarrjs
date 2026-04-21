import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/router";

type NavigationStateType = {
  isSideBarCollapsed: boolean;
  setIsSideBarCollapsed: Dispatch<SetStateAction<boolean>>;
};

const NavigationStateContext = createContext<NavigationStateType>({
  isSideBarCollapsed: true,
  setIsSideBarCollapsed: () => {},
});

const NavigationStateProvider = ({ children }: { children: ReactNode }) => {
  const [isSideBarCollapsed, setIsSideBarCollapsed] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setIsSideBarCollapsed(true);
  }, [router.asPath]);

  return (
    <NavigationStateContext.Provider
      value={{ isSideBarCollapsed, setIsSideBarCollapsed }}
    >
      {children}
    </NavigationStateContext.Provider>
  );
};

export const useNavigationState = () => useContext(NavigationStateContext);

export default NavigationStateProvider;
