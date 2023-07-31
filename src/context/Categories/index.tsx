import {
  createContext,
  SetStateAction,
  useState,
  Dispatch,
  useEffect,
} from "react";
import { LayoutSchema } from "../../schema";

type CategorySchema = {
  id: string;
  type: string;
  field: string;
};

export type CategoriesSchema = {
  id: string;
  name: string;
  fields: CategorySchema[];
};

type CatListSchema = {
  categories: CategoriesSchema[];
  setCategories: Dispatch<SetStateAction<Array<CategoriesSchema>>>;
};

const catDefaultValues = {
  categories: [],
  setCategories: () => null,
};

export const CatContext = createContext<CatListSchema>(catDefaultValues);

const CatProvider = ({ children }: LayoutSchema) => {
  const [categories, setCategories] = useState<Array<CategoriesSchema>>([]);
  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("categoryHandler")) {
      setCategories(
        JSON.parse(localStorage.getItem("categoryHandler") as string)
      );
    }
    setFirstLoad(false);
  }, []);

  useEffect(() => {
    !firstLoad &&
      localStorage.setItem("categoryHandler", JSON.stringify(categories));
  }, [categories]);

  return (
    <CatContext.Provider
      value={{
        categories,
        setCategories,
      }}
    >
      {children}
    </CatContext.Provider>
  );
};

export default CatProvider;
