import {
  createContext,
  SetStateAction,
  useState,
  Dispatch,
  useEffect,
} from "react";
import { LayoutSchema } from "../../schema";

type NavSchema = {
  link: string;
  text: string;
};

type NavLinkSchema = {
  navLinkData: NavSchema[];
  setNavLinkData: Dispatch<SetStateAction<Array<NavSchema>>>;
};
export const navDefaultValues = {
  navLinkData: [],
  setNavLinkData: () => null,
};

export const NavContext = createContext<NavLinkSchema>(navDefaultValues);

const NavProvider = ({ children }: LayoutSchema) => {
  const [navLinkData, setNavLinkData] = useState<NavSchema[]>([]);
  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("categoryHandlerNav")) {
      setNavLinkData(
        JSON.parse(localStorage.getItem("categoryHandlerNav") as string)
      );
    }
    setFirstLoad(false);
  }, []);

  useEffect(() => {
    !firstLoad &&
      localStorage.setItem("categoryHandlerNav", JSON.stringify(navLinkData));
  }, [navLinkData, firstLoad]);

  return (
    <NavContext.Provider
      value={{
        navLinkData,
        setNavLinkData,
      }}
    >
      {children}
    </NavContext.Provider>
  );
};

export default NavProvider;
